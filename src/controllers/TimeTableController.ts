import { Request, Response } from "express"
import TimeTableModel from "../models/TimeTableModel"

export const getAllTimeTable = async (req: Request, res: Response):Promise<any> => {
    try {
        const timeTable = await TimeTableModel.find()
        if (!timeTable) {
            return res.status(404).json({ message: "No Time Tables found" })
        }
    } catch (error:any) {
        return res.status(500).json({
            message: "An error occurred while fetching buses.", error: error.message || "Internal Server Error",
        })
    }
}