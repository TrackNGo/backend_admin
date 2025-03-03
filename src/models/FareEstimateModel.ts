import mongoose, { Schema } from "mongoose";
import FareEstimate from "../interfaces/fareEstimate";

const fareEstimateSchema = new Schema<FareEstimate>(
    {
        busNumber: {
            type: String,
            required: true,
        },
        startStop: {
            type: String,
            required: true,
        },
        endStop: {
            type: String,
            required: true,
        },
        estimatedFare: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

const FareEstimateModel = mongoose.model<FareEstimate>("FareEstimate", fareEstimateSchema);

export default FareEstimateModel;
