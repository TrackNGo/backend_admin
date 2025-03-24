import mongoose, { Document, Schema } from 'mongoose';

export enum FormType {
    BUS_SERVICE = 'busService',
    TECHNICAL = 'technical'
}

interface BaseFormSubmission extends Document {
    formType: FormType;
    submittedAt: Date;
}

export interface BusServiceSubmission extends BaseFormSubmission {
    formType: FormType.BUS_SERVICE;
    busNumber: string;
    ownerName: string;
    ownerContact: string;
    registrationNumber: string;
    routeDetails: string;
}

export interface TechnicalSubmission extends BaseFormSubmission {
    formType: FormType.TECHNICAL;
    name: string;
    email: string;
    issueType: string;
    description: string;
}

export type FormSubmission = BusServiceSubmission | TechnicalSubmission;

const formSubmissionSchema = new Schema({
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
    description: { type: String }
}, { discriminatorKey: 'formType' });

export default mongoose.model<FormSubmission>('FormSubmission', formSubmissionSchema);