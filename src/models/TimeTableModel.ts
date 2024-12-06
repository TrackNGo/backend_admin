import mongoose, { Schema } from "mongoose";
import { TimeTable } from "../interfaces/TimeTable";
import BusDataModel from "./BusDataModel";

const timeTableSchema = new Schema<TimeTable>({
  startLocation: { type: String, required: true },
  endLocation: { type: String, required: true },
  bus: [{ type: mongoose.Schema.Types.ObjectId, ref: "BusData" }],
});

const TimeTableModel = mongoose.model<TimeTable>("TimeTable", timeTableSchema);

export default TimeTableModel;
