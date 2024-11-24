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
    // fareDetails: {
    //     type: [Number],
    //     default: [], // Stores the fare for each stop or between stops
    // }, 
},
    { timestamps: true }
);

const BusRouteModel = mongoose.model<BusRoute>("BusRoute", busRouteSchema);

export default BusRouteModel;
