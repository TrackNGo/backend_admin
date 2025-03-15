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
export const deleteFareEstimate = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "Missing ID parameter" });
        }

        const deletedFare = await FareEstimate.findByIdAndDelete(id);

        if (!deletedFare) {
            return res.status(404).json({ message: "Fare Estimate not found" });
        }

        res.status(200).json({ message: "Fare Estimate deleted successfully" });
    } catch (error: any) {
        console.error("Error deleting fare estimate:", error);
        res.status(500).json({ message: "Error deleting fare estimate", error: error.message });
    }
}

export const getFareEstimateById=async(req:Request,res:Response):Promise<any>=>{
    try{
        const{id}=req.params;
        const fareEstimate=await FareEstimate.findById(id);
        if(!fareEstimate){
            return res.status(404).json({message:"Fare Estimate not found"});
        }
        res.status(200).json(fareEstimate);
    }catch(error:any){
        console.error("Error fetching fare estimate by ID:",error);
        res.status(500).json({message:"Error fetching fare estimate by ID",error:error.message});
    }
}

// Update fare for a specific stop
export const updateFareEstimate = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const updatedFare = await FareEstimate.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedFare) {
            return res.status(404).json({ message: "Fare Estimate not found" });
        }

        res.status(200).json({ message: "Fare Estimate updated successfully", updatedFare });
    } catch (error: any) {
        console.error("Error updating fare estimate:", error);
        res.status(500).json({ message: "Error updating fare estimate", error: error.message });
    }
}