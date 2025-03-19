import { Document } from "mongoose"

interface Report extends Document {
    busNumber: string;
    issueType: string;
    description: string;
    contactDetails: string;
    createdAt: Date;
}

export default Report
