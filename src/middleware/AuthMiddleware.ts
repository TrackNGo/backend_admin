import { NextFunction, Request, Response } from "express";
import { validateJwt } from "../security/jwt";

export const AuthMiddleware = (req: Request, res: Response, next: NextFunction):void => {
    const authHeader = req.headers.authorization
    const token = authHeader?.replace("Bearer ", "")

    // Check token empty?
    if (!token) {
        res.status(401).json({ message: "Unauthorized" })
        return
    }

    //check token validate
    if (!validateJwt(token)) {
        res.status(401).json({ message: "Unauthorized" })
        return
    }

    next()
}
