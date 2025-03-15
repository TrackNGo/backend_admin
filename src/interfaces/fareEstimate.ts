import { Document } from "mongoose";

export interface FareEstimate extends Document {
    routeNumber: string;  
    startStop: string;
    endStop: string;
    estimatedFare: number;
    busType: 'Normal' | 'Semi-Luxury' | 'Luxury'; 
}

export default FareEstimate;
