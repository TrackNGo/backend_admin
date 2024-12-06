import mongoose, { Schema } from "mongoose";
import { BusData } from "../interfaces/BusData";

const busDataSchema = new Schema<BusData>({
    busRouteNumber: { type: String, required: true },
    busType: { type: String, enum: ["Normal", "Semi-Luxury", "Luxury"], required: true },
    price: { type: Number, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
});

const BusDataModel = mongoose.model<BusData>("BusData", busDataSchema);

export default BusDataModel;
