import { Request, Response } from "express";
import UserModel from "../models/UserModel";
import bcrypt from 'bcryptjs';

// Check mongoDB id
const isValidObjectId = (id: string): boolean => /^[0-9a-fA-F]{24}$/.test(id);

// Filter object
const generateFilter = (param: string) => {
    if (isValidObjectId(param)) {
        return { _id: param }; // Filter by MongoDB ObjectID
    } else {
        return { $or: [{ nic: param }, { username: param }] }; // NIC or Username
    }
};

const generateFilterForUpdate = (param: string) => {
    if (isValidObjectId(param)) {
        return { _id: param }; // Filter by MongoDB ObjectID
    } else {
        return { $or: [{ username: param }] }; // NIC or Username
    }
};

// Create user
export const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { password, ...otherData } = req.body;

        if (!password) {
            res.status(400).json({ error: "Password is required" });
            return;
        }

        if(password.length < 8){
            res.status(400).json({ error: "Password must be at least 8 characters long" });
            return;
        }

        const existingUser = await UserModel.findOne({
            $or: [{ username: otherData.username }, { nic: otherData.nic }],
        });
        if (existingUser) {
            res.status(400).json({ error: "User with the same NIC or username already exists" });
            return;
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save the user with the hashed password
        const newUser = new UserModel({ ...otherData, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error: any) {
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get user by id, nic, username
export const getUser = async (req: Request, res: Response): Promise<void> => {
    const { param } = req.params;

    if (!param) {
        res.status(400).json({ error: "Parameter is required" });
        return;
    }

    try {
        const filter = generateFilter(param);
        const user = await UserModel.findOne(filter).select("-password");

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.json({ user });
    } catch (error: any) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get all users
export const getAllUsers = async (_req: Request, res: Response): Promise<void> => {
    try {
        const users = await UserModel.find().select("-password");
        res.json({ users });
    } catch (error: any) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Update user by id, username
export const updateUser = async (req: Request, res: Response): Promise<void> => {
    const { param } = req.params;

    if (!param) {
        res.status(400).json({ error: "Parameter is required" });
        return;
    }

    try {
        const filter = generateFilterForUpdate(param);
        const updatedUser = await UserModel.findOneAndUpdate(filter, req.body, { new: true });

        if (!updatedUser) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.json({ message: "User updated successfully", user: updatedUser });
    } catch (error: any) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Delete user by id, nic, username
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    const { param } = req.params;

    if (!param) {
        res.status(400).json({ error: "Parameter is required" });
        return;
    }

    try {
        const filter = generateFilter(param);
        const deletedUser = await UserModel.findOneAndDelete(filter);

        if (!deletedUser) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.json({ message: "User deleted successfully", user: deletedUser });
    } catch (error: any) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
