import mongoose, { Schema } from 'mongoose'
import BusDetails from '../interfaces/BusDetails'

const busModelSchema = new Schema<BusDetails>(
    {
        busNumber: {
            type: String,
            required: true
        },
        startLocation: {
            type: String,
            required: true
        },
        endLocation: {
            type: String,
            required: true
        },
        routeNumber: {
            type: String,
            required: true
        },
        fareEstimate: {
            type: String,
            required: true
        },
        type: {
            type: String,
            enum: ['Normal', 'Semi-Luxury', 'Luxury'], default: 'Normal'
        },
        status: {
            type: Boolean,
            default: false
        },
    },
    {
        timestamps: true,
    }
)

const BusModel = mongoose.model('Bus', busModelSchema)

export default BusModel
