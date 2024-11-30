import { Request, Response } from "express";
import UserModel from "../models/UserModel";
import bcrypt from 'bcryptjs';

// User controllers and Login has been tested and documented 
// Check mongoDB id
const isValidObjectId = (id: string): boolean => /^[0-9a-fA-F]{24}$/.test(id);

// Validate mobile number format
const isValidMobileNumber = (mobile: string): boolean => /^07\d{8}$/.test(mobile);

// Validate password strength
const isValidPassword = (password: string): boolean =>
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/.test(password);

// Filter object
// const generateFilter = (param: string) => {
//     if (isValidObjectId(param)) {
//         return { _id: param }; // Filter by MongoDB ObjectID
//     } else {
//         return { $or: [{ nic: param }, { username: param }] }; // NIC or Username
//     }
// };

const generateFilter = (param: string) => {
    if (isValidObjectId(param)) {
        return { _id: param }; // Filter by MongoDB ObjectId
    } else if (/^\d{9}[Vv]$/.test(param)) {
        return { nic: param }; // Filter by NIC (e.g., "123456789V")
    } else {
        return { username: param }; // Filter by username
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
        console.log(req.body)
        if (!otherData.username || !otherData.nic || !otherData.firstName || !otherData.lastName || !otherData.mobile || !otherData.accType) {
            res.status(400).json({ error: "Missing required field" });
            return;
        }

        if (!password) {
            res.status(400).json({ error: "Missing Password Field" });
            return;
        }

        // Validate password strength
        if (!isValidPassword(password)) {
            res.status(400).json({
                error: "Password must be at least 8 characters long and include at least one uppercase letter, one number, and one special character.",
            });
            return;
        }

        // Validate mobile number format
        if (!isValidMobileNumber(otherData.mobile)) {
            res.status(400).json({ error: "Invalid mobile number format. Mobile number must start with '07' and contain 10 digits." });
            return;
        }


        const existingUser = await UserModel.findOne({
            $or: [{ username: otherData.username }],
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
        // console.log(error)
        res.status(500).json(error.message); // Error will be displayed as Json
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

    const { username, firstName, lastName, mobile, accType } = req.body;
    if (!username && !firstName && !lastName && !mobile && !accType) {
        res.status(400).json({ error: "At least one field (username, firstName, lastName, mobile, accType) must be provided for update" });
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
