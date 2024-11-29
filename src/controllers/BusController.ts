import { Request, Response } from "express";
import BusModel from "../models/BusModel";
import BusRouteModel from "../models/BusRouteModel";

// Get all bus
export const getAllBuses = async (req: Request, res: Response): Promise<any> => {
    try {
        const buses = await BusModel.find();

        // Check if buses are found
        if (!buses || buses.length === 0) {
            return res.status(404).json({ message: "No buses found" });
        }

        res.status(200).json(buses);
    } catch (error: any) {
        // Send a detailed error response to the client
        res.status(500).json({
            message: "An error occurred while fetching buses.", error: error.message || "Internal Server Error",
        });
    }
};

// Get bus by bus number
export const getBusByBusNumber = async (req: Request, res: Response): Promise<any> => {
    const { busNumber } = req.params;

    try {
        // Validate busNumber parameter
        if (!busNumber) {
            return res.status(400).json({ message: "Bus number is required" });
        }

        // Find the bus by busNumber
        const bus = await BusModel.findOne({ busNumber });

        if (!bus) {
            return res.status(404).json({ message: "Bus not found" });
        }

        // Find the associated bus route by busNumber
        const busRoute = await BusRouteModel.findOne({ busNumber });

        // Check if busRoute exists
        if (!busRoute) {
            return res.status(404).json({ message: "Bus route not found for this bus" });
        }

        // Return the bus and bus route data
        res.status(200).json({ bus, busRoute, });
    } catch (error: any) {
        // Log the error for debugging purposes
        console.error("Error fetching bus details:", error);

        // Handle database or other unexpected errors
        if (error.name === "CastError") {
            return res.status(400).json({ message: "Invalid bus number format" });
        }
        if (error.name === "MongoNetworkError") {
            return res.status(503).json({ message: "Database is currently unavailable. Please try again later." });
        }

        // Send a generic error message for other types of errors
        res.status(500).json({
            message: "An error occurred while fetching bus details.", error: error.message || "Internal Server Error",
        });
    }
};

// Add bus
export const addBus = async (req: Request, res: Response): Promise<any> => {
    const {
        busNumber,
        startLocation,
        endLocation,
        routeNumber,
        fareEstimate,
        type,
        status,
    } = req.body;

    try {
        // Validate required fields except for routeStops
        if (
            !busNumber ||
            !startLocation ||
            !endLocation ||
            !routeNumber ||
            !fareEstimate ||
            !type
        ) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Check if the bus number already exists
        const existingBus = await BusModel.findOne({ busNumber });
        if (existingBus) {
            return res.status(409).json({ message: "Bus number already exists" });
        }

        // Create a new bus using the provided data
        const newBus = new BusModel({
            busNumber,
            startLocation,
            endLocation,
            routeNumber,
            fareEstimate,
            type,
            status,
        });

        // Save the new bus to the database
        await newBus.save();

        // Automatically create a bus route using the same bus details (routeStops is optional)
        const newBusRoute = new BusRouteModel({
            busNumber,
            routeNumber,
            startLocation,
            endLocation,
            routeStops: [], // routeStops is optional and is set as an empty array
            status,
        });

        // Save the new bus route
        await newBusRoute.save();

        // Send success response with bus and bus route details
        res.status(201).json({
            message: "Bus and bus route added successfully",
            bus: newBus,
            busRoute: newBusRoute,
        });
    } catch (error: any) {
        // Log the error for debugging purposes
        console.error("Error adding bus:", error);

        // Handle different types of errors
        if (error.name === "ValidationError") {
            return res.status(400).json({ message: "Invalid data provided", error: error.message });
        }
        if (error.name === "MongoNetworkError") {
            return res.status(503).json({ message: "Database is currently unavailable. Please try again later." });
        }

        // Handle database errors or unexpected issues
        res.status(500).json({
            message: "An error occurred while adding the bus and bus route.",
            error: error.message || "Internal Server Error",
        });
    }
};

// Update bus details by bus number
export const updateBusDetails = async (req: Request, res: Response): Promise<any> => {
    const { busNumber } = req.params;
    const updateData = req.body;

    // Define the allowed fields for validation
    const allowedFields = [
        "startLocation",
        "endLocation",
        "routeNumber",
        "fareEstimate",
        "type",
        "status"
    ];

    try {
        // Validate required fields
        if (!busNumber) {
            return res.status(400).json({ message: "Bus number is required for update" });
        }

        if (!updateData || Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "Missing updating data" });
        }

        // Filter out invalid fields from the request body
        const validUpdateData: Record<string, any> = {};
        for (const key in updateData) {
            if (allowedFields.includes(key)) {
                validUpdateData[key] = updateData[key];
            }
        }

        // Check if there are valid fields to update
        if (Object.keys(validUpdateData).length === 0) {
            return res.status(400).json({
                message: "No valid fields provided for update",
                allowedFields,
            });
        }

        // Check if the bus exists
        const bus = await BusModel.findOne({ busNumber });
        if (!bus) {
            return res.status(404).json({ message: "Bus not found" });
        }

        // Update the bus details
        const updatedBus = await BusModel.findOneAndUpdate(
            { busNumber },
            validUpdateData,
            {
                new: true,
                runValidators: true,
            }
        );

        // Update associated BusRoute if relevant fields are provided
        if (
            validUpdateData.startLocation ||
            validUpdateData.endLocation ||
            validUpdateData.routeNumber ||
            validUpdateData.status
        ) {
            await BusRouteModel.findOneAndUpdate(
                { busNumber },
                {
                    ...(validUpdateData.startLocation && { startLocation: validUpdateData.startLocation }),
                    ...(validUpdateData.endLocation && { endLocation: validUpdateData.endLocation }),
                    ...(validUpdateData.routeNumber && { routeNumber: validUpdateData.routeNumber }),
                    ...(validUpdateData.status && { status: validUpdateData.status }),
                },
                { new: true, runValidators: true }
            );
        }

        res.status(200).json({
            message: "Bus details updated successfully",
            bus: updatedBus,
        });
    } catch (error: any) {
        res.status(500).json({
            message: "An error occurred while updating bus details.",
            error: error.message || "Internal Server Error",
        });
    }
};


// Delete bus by bus number
export const deleteBusByBusNumber = async (req: Request, res: Response): Promise<any> => {
    const { busNumber } = req.params;

    try {
        if (!busNumber) {
            return res.status(400).json({ message: "Bus number is required" });
        }
        // Check if the bus exists before attempting to delete it
        const bus = await BusModel.findOneAndDelete({ busNumber });
        if (!bus) {
            return res.status(404).json({ message: "Bus not found" });
        }

        // Attempt to delete the associated bus route
        const busRoute = await BusRouteModel.findOneAndDelete({ busNumber });
        if (!busRoute) {
            return res.status(404).json({ message: "Associated bus route not found, but bus deleted successfully" });
        }

        // Send success response after both bus and bus route are deleted
        res.status(200).json({ message: "Bus deleted successfully" });
    } catch (error: any) {
        // Log the error for debugging purposes
        console.error("Error deleting bus:", error);

        // Handle database errors or unexpected issues
        if (error.name === "CastError") {
            return res.status(400).json({ message: "Invalid bus number format", error: error.message });
        }
        if (error.name === "MongoNetworkError") {
            return res.status(503).json({ message: "Database is currently unavailable. Please try again later." });
        }

        // Handle other types of errors
        res.status(500).json({
            message: "An error occurred while deleting the bus and bus route.", error: error.message || "Internal Server Error",
        });
    }
};
