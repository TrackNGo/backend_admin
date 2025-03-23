import { Document } from "mongoose"

interface Report extends Document {
    busNumber: string;
    issueType: string;
    description: string;
    reportedAt?: Date;
    contactDetails?: string;
}

export default Report
