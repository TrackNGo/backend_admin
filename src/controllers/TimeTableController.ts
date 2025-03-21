import { Request, Response } from "express";
import TimeTableModel from "../models/TimeTableModel";  // Path to your TimeTable model

// Create TimeTable with validation
export const createTimeTable = async (req: Request, res: Response): Promise<any> => {
    try {
        const { startLocation, endLocation, busRouteNumber, busType, price, startTime, endTime } = req.body;

        // Validate required fields
        if (!startLocation || !endLocation || !busRouteNumber || !busType || !price || !startTime || !endTime) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if a time table already exists for this route
        const existingTimeTable = await TimeTableModel.findOne({
            startLocation,
            endLocation,
            busRouteNumber,
            startTime,
            endTime
        });

        if (existingTimeTable) {
            return res.status(400).json({ message: "This time table entry already exists" });
        }

        // Create a new time table entry
        const timeTable = new TimeTableModel({
            startLocation,
            endLocation,
            busRouteNumber,
            busType,
            price,
            startTime,
            endTime,
        });

        // Save to database
        await timeTable.save();

        // Send a success response
        res.status(201).json({ message: "Time Table created successfully", timeTable });
    } catch (error: any) {
        console.error("Error creating time table:", error);
        res.status(500).json({ message: "Error creating time table", error: error.message });
    }
};

// Get all time tables
export const getAllTimeTables = async (req: Request, res: Response): Promise<any> => {
    try {
        const timeTables = await TimeTableModel.find();
        res.status(200).json(timeTables);
    } catch (error: any) {
        console.error("Error fetching time tables:", error);
        res.status(500).json({ message: "Error fetching time tables", error: error.message });
    }
};

// Get time tables by locations
export const getTimeTableByLocations = async (req: Request, res: Response): Promise<any> => {
    try {
        const { startLocation, endLocation } = req.query;

        if (!startLocation || !endLocation) {
            return res.status(400).json({ message: "Start location and end location are required" });
        }

        const timeTables = await TimeTableModel.find({
            startLocation,
            endLocation
        });

        if (timeTables.length == 0) {
            return res.status(200).json({ message: "No time tables found for the specified locations" });
        }

        res.status(200).json(timeTables);
    } catch (error: any) {
        console.error("Error fetching time tables by locations:", error);
        res.status(500).json({ message: "Error fetching time tables by locations", error: error.message });
    }
};

// Get time tables by route number and bus type
export const getTimeTableByRouteAndType = async (req: Request, res: Response): Promise<any> => {
    try {
        const { busRouteNumber, busType } = req.query;

        if (!busRouteNumber || !busType) {
            return res.status(400).json({ message: "Bus route number and bus type are required" });
        }

        const timeTables = await TimeTableModel.find({
            busRouteNumber,
            busType
        });

        if (!timeTables.length) {
            return res.status(404).json({ message: "No time tables found for the specified route and type" });
        }

        res.status(200).json(timeTables);
    } catch (error: any) {
        console.error("Error fetching time tables by route and type:", error);
        res.status(500).json({ message: "Error fetching time tables by route and type", error: error.message });
    }
};

// Get time table by ID
export const getTimeTableById = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;

        const timeTable = await TimeTableModel.findById(id);

        if (!timeTable) {
            return res.status(404).json({ message: "Time table not found" });
        }

        res.status(200).json(timeTable);
    } catch (error: any) {
        console.error("Error fetching time table by ID:", error);
        res.status(500).json({ message: "Error fetching time table by ID", error: error.message });
    }
};

// Update time table by ID
export const updateTimeTable = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const { startLocation, endLocation, busRouteNumber, busType, price, startTime, endTime } = req.body;

        // Validate that all fields are provided
        if (!startLocation || !endLocation || !busRouteNumber || !busType || !price || !startTime || !endTime) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const updatedTimeTable = await TimeTableModel.findByIdAndUpdate(
            id,
            { startLocation, endLocation, busRouteNumber, busType, price, startTime, endTime },
            { new: true }
        );

        if (!updatedTimeTable) {
            return res.status(404).json({ message: "Time table not found" });
        }

        res.status(200).json({ message: "Time table updated successfully", updatedTimeTable });
    } catch (error: any) {
        console.error("Error updating time table:", error);
        res.status(500).json({ message: "Error updating time table", error: error.message });
    }
};

// Delete time table by ID
export const deleteTimeTable = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;

        const deletedTimeTable = await TimeTableModel.findByIdAndDelete(id);

        if (!deletedTimeTable) {
            return res.status(404).json({ message: "Time table not found" });
        }

        res.status(200).json({ message: "Time table deleted successfully" });
    } catch (error: any) {
        console.error("Error deleting time table:", error);
        res.status(500).json({ message: "Error deleting time table", error: error.message });
    }
};