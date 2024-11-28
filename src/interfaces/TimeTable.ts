import { Document } from "mongoose"

export interface BusData extends Document{
    busRouteNumber: string,
    busType: string,
    price: number,
    startTime: string,
    endTime: string,
}
export interface TimeTable extends Document{
    startLocation: string,
    endLocation: string,
    bus: BusData[]
}
