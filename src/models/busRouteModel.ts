import mongoose, { Schema } from 'mongoose'
import BusRouteTypes from '../interfaces/BusRouteTypes'

const busRouteSchema = new Schema<BusRouteTypes>(
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
    status: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)


const BusRouteModel = mongoose.model<BusRouteTypes>('BusRoute', busRouteSchema)

export default BusRouteModel
