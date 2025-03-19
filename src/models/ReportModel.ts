import mongoose, { Schema } from "mongoose";
import Report from "../interfaces/Report";

const ReportSchema = new Schema<Report>({
    busNumber: { type: String, required: true },
    issueType: { type: String, required: true },
    description: { type: String, required: true },
    contactDetails: { type: String, required: false },
    createdAt: { type: Date, default: Date.now },
});

const ReportModel = mongoose.model<Report>("Report", ReportSchema);

export default ReportModel;
