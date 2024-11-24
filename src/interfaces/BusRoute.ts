import { Document } from "mongoose"

interface BusRoute extends Document {
    busNumber: string
    routeNumber: string
    startLocation: string
    endLocation: string
    routeStops: string[]
}

export default BusRoute
