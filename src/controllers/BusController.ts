import { Request, Response } from "express";
import BusModel from "../models/BusModel";
import BusRouteModel from "../models/BusRouteModel";
import exp from "constants";
import BusLocation from "../models/busLocationModel";

// @note tested the code and created documentation

// Get all bus
export const getAllBuses = async (req: Request, res: Response): Promise<any> => {
    try {
        const buses = await BusModel.find().sort({ updatedAt: -1 }); // Sorting by the latest order (newest first)

        // Check if buses are found
        if (!buses || buses.length === 0) {
            return res.status(404).json({ message: "No buses found" });
        }

        res.status(200).json(buses);
    } catch (error: any) {
        // Send a detailed error response to the client
        res.status(500).json({
            message: "An error occurred while fetching buses.",
            error: error.message || "Internal Server Error",
        });
    }
}

// Get bus by bus number
export const getBusByBusNumber = async (req: Request, res: Response): Promise<void> => {
    const { busNumber } = req.params

    try {
        // Validate busNumber parameter
        if (!busNumber) {
            res.status(400).json({ message: "Bus number is required" })
            return
        }

        // Find the bus by busNumber
        const bus = await BusModel.findOne({ busNumber: { $regex: new RegExp(`^${busNumber}$`, 'i') } })
        if (!bus) {
            res.status(404).json({ message: "Bus not found" })
            return
        }

        // Return the bus data
        res.status(200).json(bus)
    } catch (error: any) {
        console.error("Error fetching bus details:", error)

        // Handle specific errors
        if (error.name === "CastError") {
            res.status(400).json({ message: "Invalid bus number format" })
        } else if (error.name === "MongoNetworkError") {
            res.status(503).json({ message: "Database is currently unavailable. Please try again later." })
        } else {
            // Generic error response
            res.status(500).json({
                message: "An error occurred while fetching bus details",
                error: error.message || "Internal Server Error",
            })
        }
    }
}

//count total buses
export const countTotalBuses = async (req: Request, res: Response): Promise<void> => {
    try {
        const totalBuses = await BusModel.countDocuments() // Count total buses in the collection

        res.status(200).json({ totalBuses }) // Respond with count
    } catch (error: any) {
        res.status(500).json({
            message: "An error occurred while counting total buses.",
            error: error?.message || "Internal Server Error",
        })
    }
}


//count active buses
export const activeBuses = async (req: Request, res: Response): Promise<void> => {
    try {
        const activeBuses = await BusModel.countDocuments({ status: true }) // Count active buses

        res.status(200).json({ activeBuses }) // Respond with count
    } catch (error: any) {
        res.status(500).json({
            message: "An error occurred while counting active buses.",
            error: error?.message || "Internal Server Error",
        })
    }
}

//count non-active buses
export const nonActiveBuses = async (req: Request, res: Response): Promise<void> => {
    try {
        const nonActiveBuses = await BusModel.countDocuments({ status: false }) // Count non-active buses

        res.status(200).json({ nonActiveBuses }) // Respond with count
    } catch (error: any) {
        res.status(500).json({
            message: "An error occurred while counting non-active buses.",
            error: error?.message || "Internal Server Error",
        })
    }
}

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

        const newBusLocationModel = new BusLocation({
            busNumber:busNumber,
            latitude:0,
            longitude:0
        })

        // Save the new bus to the database
        await newBus.save();
        await newBusLocationModel.save()

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
        const bus = await BusModel.findOne({ busNumber: { $regex: new RegExp(`^${busNumber}$`, 'i') } });
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
        const bus = await BusModel.findOneAndDelete({ busNumber: { $regex: new RegExp(`^${busNumber}$`, 'i') } });
        if (!bus) {
            return res.status(404).json({ message: "Bus not found" });
        }

        // Attempt to delete the associated bus route
        const busRoute = await BusRouteModel.findOneAndDelete({ busNumber: { $regex: new RegExp(`^${busNumber}$`, 'i') } });
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

//get buses by bus route number
export const getBusesByRouteNumber = async (req: Request, res: Response): Promise<void> => {
    const { routeNumber } = req.params

    try {
        // Validate routeNumber parameter
        if (!routeNumber) {
            res.status(400).json({ message: "Route number is required" })
            return
        }

        // Find buses by routeNumber
        const buses = await BusModel.find({ routeNumber })
        if (buses.length === 0) {
            res.status(404).json({ message: "No buses found for this route number" })
            return
        }

        // Return the list of buses
        res.status(200).json(buses)
    } catch (error: any) {
        console.error("Error fetching buses by route number:", error)

        // Handle specific errors
        if (error.name === "CastError") {
            res.status(400).json({ message: "Invalid route number format" })
        } else if (error.name === "MongoNetworkError") {
            res.status(503).json({ message: "Database is currently unavailable. Please try again later." })
        } else {
            // Generic error response
            res.status(500).json({
                message: "An error occurred while fetching buses by route number",
                error: error.message || "Internal Server Error",
            })
        }
    }
}


//bus status update
export const updateBusStatus = async (req: Request, res: Response): Promise<any> => {
    const { busNumber } = req.params; // Bus number from the URL
    const { status } = req.body; // New status from the request body

    try {
        // Validate the status field
        if (typeof status !== 'boolean') {
            return res.status(400).json({ error: 'Invalid status value. It must be true or false.' });
        }

        // Find the bus by busNumber and update its status
        const bus = await BusModel.findOneAndUpdate(
            { busNumber },
            { status },
            { new: true } // Return the updated document
        );

        // If the bus is not found, return an error
        if (!bus) {
            return res.status(404).json({ error: 'Bus not found' });
        }

        // Return the updated bus details
        res.status(200).json({ message: 'Bus status updated successfully', bus });
    } catch (error: any) {
        console.error('Error updating bus status:', error);
        res.status(500).json({ error: 'An error occurred while updating bus status', details: error.message });
    }
}