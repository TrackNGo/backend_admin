import { Document } from "mongoose"

interface BusDetails extends Document {
    busNumber: string
    startLocation: string
    endLocation: string
    routeNumber: string
    fareEstimate: string
    type: 'Normal' | 'Semi-Luxury' | 'Luxury'
    status: boolean
}

export default BusDetails
