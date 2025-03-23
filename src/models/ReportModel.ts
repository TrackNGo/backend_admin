import mongoose, { Schema } from "mongoose";
import Report from "../interfaces/Report";

const ReportSchema = new Schema<Report>({
    busNumber: { type: String, required: true },
    issueType: { type: String, required: true },
    description: { type: String, required: true },
    reportedAt: { type: Date, default: Date.now },
    contactDetails: { type: String, required: false },
});

const ReportModel = mongoose.model<Report>("Report", ReportSchema);

export default ReportModel;
