import { Request, Response } from "express";
import BusRouteModel from "../models/BusRouteModel";

// Add a fare between two stops on the bus route
export const addFareToRoute = async (req: Request,res: Response): Promise<any> => {
    const { busNumber, startStopIndex, endStopIndex, fare } = req.body;

    try {
        // Validate the inputs
        if (
            !busNumber ||
            startStopIndex === undefined ||
            endStopIndex === undefined ||
            fare === undefined
        ) {
            return res.status(400).json({message:"Please provide all required fields: busNumber, startStopIndex, endStopIndex, and fare",});
        }

        // Fetch the bus route by bus number
        const busRoute = await BusRouteModel.findOne({ busNumber });

        if (!busRoute) {
            return res.status(404).json({ message: "Bus not found" });
        }

        // Validate stop indices
        if (
            startStopIndex < 0 ||
            endStopIndex < 0 ||
            startStopIndex >= busRoute.routeStops.length ||
            endStopIndex >= busRoute.routeStops.length
        ) {
            return res.status(400).json({ message: "Invalid stop indices" });
        }

        // Set the fare for the stops
        const startIndex = Math.min(startStopIndex, endStopIndex);
        const endIndex = Math.max(startStopIndex, endStopIndex);

        // Fill fareDetails array for the given stop range
        for (let i = startIndex; i < endIndex; i++) {
            busRoute.fareDetails[i] = fare;
        }

        // Save the updated bus route
        await busRoute.save();

        res.status(200).json({
            message: "Fare added to route successfully",
            fareDetails: busRoute.fareDetails,
        });
    } catch (error: any) {
        console.error("Error adding fare to route:", error);
        res.status(500).json({message: "An error occurred while adding fare to route",error: error.message || "Internal Server Error",});
    }
};


// Delete fare details for a specific stop
export const deleteFareForStop = async (req: Request, res: Response): Promise<any> => {
    const { busNumber, stopIndex } = req.body;

    try {
        // Validate the inputs
        if (!busNumber || stopIndex === undefined) {
            return res.status(400).json({ message: 'Please provide busNumber and stopIndex' });
        }

        // Fetch the bus route by bus number
        const busRoute = await BusRouteModel.findOne({ busNumber });

        if (!busRoute) {
            return res.status(404).json({ message: 'Bus not found' });
        }

        // Validate the stop index
        if (stopIndex < 0 || stopIndex >= busRoute.fareDetails.length) {
            return res.status(400).json({ message: 'Invalid stop index' });
        }

        // Remove the fare for the specific stop (set to 0 or null)
        busRoute.fareDetails[stopIndex] = 0;

        // Save the updated bus route
        await busRoute.save();

        res.status(200).json({message: 'Fare deleted successfully for stop',fareDetails: busRoute.fareDetails,});
    } catch (error: any) {
        console.error('Error deleting fare for stop:', error);
        res.status(500).json({message: 'An error occurred while deleting fare for stop',error: error.message || 'Internal Server Error',});
    }
};


// Update fare for a specific stop
export const updateFareForStop = async (req: Request, res: Response): Promise<any> => {
    const { busNumber, stopIndex, newFare } = req.body;

    try {
        // Validate the inputs
        if (!busNumber || stopIndex === undefined || newFare === undefined) {
            return res.status(400).json({ message: 'Please provide busNumber, stopIndex, and newFare' });
        }

        // Fetch the bus route by bus number
        const busRoute = await BusRouteModel.findOne({ busNumber });

        if (!busRoute) {
            return res.status(404).json({ message: 'Bus not found' });
        }

        // Validate the stop index
        if (stopIndex < 0 || stopIndex >= busRoute.fareDetails.length) {
            return res.status(400).json({ message: 'Invalid stop index' });
        }

        // Update the fare for the specific stop
        busRoute.fareDetails[stopIndex] = newFare;

        // Save the updated bus route
        await busRoute.save();

        res.status(200).json({message: 'Fare updated successfully for stop',fareDetails: busRoute.fareDetails,});
    } catch (error: any) {
        console.error('Error updating fare for stop:', error);
        res.status(500).json({message: 'An error occurred while updating fare for stop',error: error.message || 'Internal Server Error',
        });
    }
};


