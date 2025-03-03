import { Document } from "mongoose";

export interface FareEstimate extends Document {
    busNumber: string;
    startStop: string;
    endStop: string;
    estimatedFare: number;
}

export default FareEstimate;
