import { Request, Response } from "express";
import BusModel from "../models/BusModel";
import BusRouteModel from "../models/BusRouteModel";

// Get all bus
export const getAllBuses = async (req: Request,res: Response): Promise<any> => {
try {
    const buses = await BusModel.find();

    // Check if buses are found
    if (!buses || buses.length === 0) {
        return res.status(404).json({ message: "No buses found" });
    }

    res.status(200).json(buses);
} catch (error: any) {
    // Send a detailed error response to the client
    res.status(500).json({message: "An error occurred while fetching buses.",error: error.message || "Internal Server Error",
    });
}
};
