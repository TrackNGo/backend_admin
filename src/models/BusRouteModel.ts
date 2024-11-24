import mongoose, { Schema } from "mongoose";
import BusRoute from "../interfaces/BusRoute";

const busRouteSchema = new Schema<BusRoute>(
{
    busNumber: {
        type: String,
        required: true,
        unique: true,
    },
    routeNumber: {
        type: String,
        required: true,
    },
    startLocation: {
        type: String,
        required: true,
    },
    endLocation: {
        type: String,
        required: true,
    },
    routeStops: {
        type: [String],
        default: [],
    },  
},
    { timestamps: true }
);

const BusRouteModel = mongoose.model<BusRoute>("BusRoute", busRouteSchema);

export default BusRouteModel;
