import { Request, RequestHandler, Response } from "express";
import bcrypt from "bcrypt";
import UserModel from "../models/UserModel";
import { generateJwt } from "../security/jwt";

export const Login: RequestHandler = async (req: Request, res: Response) => {
    const { loginIdentifier, password } = req.body;

    try {

        if (!loginIdentifier || !password) {
            res.status(400).json({ message: "Login identifier and password are required" });
            return;
        }

        // Find the user by username or mobile
        const user = await UserModel.findOne({
            $or: [
                { username: loginIdentifier },
                { mobile: loginIdentifier },
            ],
        });

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        // Validate the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }

        // Check if the user account is active
        // if (!user.isActive) {
        //     res.status(403).json({ message: "User account is inactive" });
        //     return;
        // }

        // Generate a JWT token
        const token = generateJwt(user);

        // Send response
        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                username: user.username,
                accType: user.accType,
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "An error occurred during login" })
    }
};