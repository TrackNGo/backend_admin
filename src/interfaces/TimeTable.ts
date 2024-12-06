import { Document } from "mongoose";
import { BusData } from "./BusData";

export interface TimeTable extends Document {
  startLocation: string;
  endLocation: string;
  bus: BusData[];
}
