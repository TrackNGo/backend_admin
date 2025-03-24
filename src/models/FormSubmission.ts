import mongoose, { Document, Schema } from 'mongoose';

export enum FormType {
    BUS_SERVICE = 'busService',
    TECHNICAL = 'technical'
}

interface Comment {
    text: string;
    adminName: string;
    createdAt: Date;
}

interface BaseContactSubmission extends Document {
    formType: FormType;
    submittedAt: Date;
    comments: Comment[];
}

export interface BusServiceSubmission extends BaseContactSubmission {
    formType: FormType.BUS_SERVICE;
    busNumber: string;
    ownerName: string;
    ownerContact: string;
    registrationNumber: string;
    routeDetails: string;
}

export interface TechnicalSubmission extends BaseContactSubmission {
    formType: FormType.TECHNICAL;
    name: string;
    email: string;
    issueType: string;
    description: string;
}

export type ContactSubmission = BusServiceSubmission | TechnicalSubmission;

const contactSubmissionSchema = new Schema({
    formType: { type: String, enum: Object.values(FormType), required: true },
    submittedAt: { type: Date, default: Date.now },
    // Bus Service fields
    busNumber: { type: String },
    ownerName: { type: String },
    ownerContact: { type: String },
    registrationNumber: { type: String },
    routeDetails: { type: String },
    // Technical Support fields
    name: { type: String },
    email: { type: String },
    issueType: { type: String },
    description: { type: String },
    // Comments
    comments: [{
        text: { type: String, required: true },
        adminName: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
    }]
}, { discriminatorKey: 'formType' });

export default mongoose.model<ContactSubmission>('ContactSubmission', contactSubmissionSchema);