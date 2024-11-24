import { Document } from "mongoose"

interface BusRoute extends Document {
    busNumber: string
    routeNumber: string
    startLocation: string
    endLocation: string
    routeStops: string[]
    // fareDetails: number[]
}

export default BusRoute
