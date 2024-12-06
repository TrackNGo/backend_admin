import { Document } from "mongoose";

export interface TimeTable extends Document {
    startLocation: string;
    endLocation: string;
    busRouteNumber: string;
    busType: string;
    price: number;
    startTime: string;
    endTime: string;
 }