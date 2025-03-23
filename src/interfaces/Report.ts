import { Document } from "mongoose"

interface Report extends Document {
    busNumber: string;
    issueType: string;
    description: string;
    reportedAt?: Date;
    contactDetails?: string;
    adminComment?: string;
}

export default Report
