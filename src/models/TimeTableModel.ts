import mongoose, { Schema } from "mongoose";
import { TimeTable } from "../interfaces/TimeTable";

// Define schema for TimeTable, where buses are an array of references to BusData
const timeTableSchema = new Schema<TimeTable>({
  startLocation: { type: String, required: true },
  endLocation: { type: String, required: true },
  busRouteNumber: { type: String, required: true },
  busType: { type: String, required: true },
  price: { type: Number, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
});

const TimeTableModel = mongoose.model<TimeTable>("TimeTable", timeTableSchema);

export default TimeTableModel;
