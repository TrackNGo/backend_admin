import jwt from "jsonwebtoken"
import UserDetails from "../interfaces/UserDetails"

export const generateJwt = (user: UserDetails) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not set in the environment variables.");
    }
    const token = jwt.sign({
        username: user.username,
        sub: user._id
    }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '1h'
    })
    return token
}

export const validateJwt = (token: string) => {
    try {
        jwt.verify(token, process.env.JWT_SECRET || "secret"); // Verify the token
        return true;
    } catch (error) {
        console.error("Invalid JWT:", error);
        return false;
    }
}

export const getUsernameFromJwt = (token: string) => {
    try {
        const decoded = jwt.decode(token)
        if (!decoded) {
            return null
        }
        return decoded.sub
    } catch (error) {
        console.error("Error decoding JWT:", error);
        return null;
    }

}