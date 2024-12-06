import { Document } from "mongoose";

export interface BusData extends Document {
  busRouteNumber: string;
  busType: string;
  price: number;
  startTime: string;
  endTime: string;
}
