import { Request, Response } from "express";
import FareEstimate from "../models/FareEstimateModel";

// Add a fare between two stops on the bus route
export const addFareToRoute = async (req: Request, res: Response): Promise<any> => {
    const { busNumber, startStopIndex, endStopIndex, fare } = req.body;

    try {
        // Validate the inputs
        if (!busNumber || startStopIndex === undefined || endStopIndex === undefined || fare === undefined) {
            return res.status(400).json({ message: "Please provide all required fields: busNumber, startStopIndex, endStopIndex, and fare" });
        }

        // Create a new fare estimate entry
        const newFareEstimate = new FareEstimate({
            busNumber,
            startStopIndex,
            endStopIndex,
            fare,
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
    const { busNumber, startStopIndex, endStopIndex } = req.body;

    try {
        // Validate the inputs
        if (!busNumber || startStopIndex === undefined || endStopIndex === undefined) {
            return res.status(400).json({ message: "Please provide busNumber, startStopIndex, and endStopIndex" });
        }

        // Delete the fare estimate entry
        const deletedFare = await FareEstimate.findOneAndDelete({ busNumber, startStopIndex, endStopIndex });

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
    const { busNumber, startStopIndex, endStopIndex, newFare } = req.body;

    try {
        // Validate the inputs
        if (!busNumber || startStopIndex === undefined || endStopIndex === undefined || newFare === undefined) {
            return res.status(400).json({ message: "Please provide busNumber, startStopIndex, endStopIndex, and newFare" });
        }

        // Update the fare estimate entry
        const updatedFare = await FareEstimate.findOneAndUpdate(
            { busNumber, startStopIndex, endStopIndex },
            { fare: newFare },
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


