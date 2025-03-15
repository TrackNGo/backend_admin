import { Request, Response } from "express";
import FareEstimate from "../models/FareEstimateModel";


export const getFareEstimates = async (req: Request, res: Response): Promise<any> => {
    try {
        const fareEstimates = await FareEstimate.find();

        if (!fareEstimates || fareEstimates.length === 0) {
            return res.status(404).json({ message: "No fare estimates found" })
        }

        res.status(200).json({ fareEstimates });
    }
    catch (error: any) {
        console.error("Error fetching fare estimates:", error);
        res.status(500).json({ message: "An error occurred while fetching fare estimates", error: error.message || "Internal Server Error" });
    }
}

// Add a fare between two stops on the bus route
export const addFareToRoute = async (req: Request, res: Response): Promise<any> => {
    const { routeNumber, busType, startStop, endStop, estimatedFare } = req.body;

    try {
        // Validate the inputs
        if (!routeNumber || !busType || !startStop || !endStop || estimatedFare === undefined) {
            return res.status(400).json({ message: "Please provide all required fields: routeNumber, busType, startStop, endStop, and estimatedFare" });
        }

        // Create a new fare estimate entry
        const newFareEstimate = new FareEstimate({
            routeNumber,
            busType,
            startStop,
            endStop,
            estimatedFare,
        });

        await newFareEstimate.save();

        res.status(201).json({ message: "Fare added to route successfully", fareDetails: newFareEstimate });
    } catch (error: any) {
        console.error("Error adding fare to route:", error);
        res.status(500).json({ message: "An error occurred while adding fare to route", error: error.message || "Internal Server Error" });
    }
};

// Delete fare details for a specific stop
export const deleteFareForStop = async (req: Request, res: Response): Promise<any> => {
    const { routeNumber, busType, startStop, endStop } = req.body;

    try {
        // Validate the inputs
        if (!routeNumber || !busType || !startStop || !endStop) {
            return res.status(400).json({ message: "Please provide routeNumber, busType, startStop, and endStop" });
        }

        // Delete the fare estimate entry
        const deletedFare = await FareEstimate.findOneAndDelete({ routeNumber, busType, startStop, endStop });

        if (!deletedFare) {
            return res.status(404).json({ message: "Fare not found" });
        }

        res.status(200).json({ message: "Fare deleted successfully" });
    } catch (error: any) {
        console.error("Error deleting fare for stop:", error);
        res.status(500).json({ message: "An error occurred while deleting fare for stop", error: error.message || "Internal Server Error" });
    }
};

// Update fare for a specific stop
export const updateFareForStop = async (req: Request, res: Response): Promise<any> => {
    const { routeNumber, busType, startStop, endStop, estimatedFare } = req.body;

    try {
        // Validate the inputs
        if (!routeNumber || !busType || !startStop || !endStop || estimatedFare === undefined) {
            return res.status(400).json({ message: "Please provide routeNumber, busType, startStop, endStop, and estimatedFare" });
        }

        // Update the fare estimate entry
        const updatedFare = await FareEstimate.findOneAndUpdate(
            { routeNumber, busType, startStop, endStop },
            { estimatedFare },
            { new: true }
        );

        if (!updatedFare) {
            return res.status(404).json({ message: "Fare not found" });
        }

        res.status(200).json({ message: "Fare updated successfully", fareDetails: updatedFare });
    } catch (error: any) {
        console.error("Error updating fare for stop:", error);
        res.status(500).json({ message: "An error occurred while updating fare for stop", error: error.message || "Internal Server Error" });
    }
};
