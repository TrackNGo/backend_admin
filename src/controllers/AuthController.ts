import { Request, RequestHandler, Response } from "express"
import bcrypt from "bcrypt"
import UserModel from "../models/UserModel"
import { generateJwt } from "../security/jwt"

export const Login: RequestHandler = async (req:Request, res:Response) => {
    const { loginIdentifier, password } = req.body

    try {
        if (!loginIdentifier || !password) {
            return res.status(400).json({ message: "Missing required fields." });
        }
        // Find the user by NIC, username, or mobile
        const user = await UserModel.findOne({
            $or: [
                { username: loginIdentifier },
                { mobile: loginIdentifier },
            ],
        })

        if (!user) {
            res.status(404).json({ message: "User not found" })
            return
        }

        // Validate the password
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            res.status(401).json({ message: "Invalid credentials" })
            return
        }

        // Generate a JWT token
        const token = generateJwt(user)

        // Send response
        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                username: user.username,
                accType: user.accType,
            },
        })
    } catch (error) {
        res.status(500).json({ error: "An unexpected error occurred. Please try again" })
    }
}

//return Promise.resolve();
