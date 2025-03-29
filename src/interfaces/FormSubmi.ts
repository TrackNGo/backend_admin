import { Document } from 'mongoose';

export enum SubmissionType {
  BUS_SERVICE = 'bus-service',
  TECHNICAL = 'technical'
}

export enum SubmissionStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in-progress',
  RESOLVED = 'resolved'
}

export interface BaseSubmission extends Document {
  type: SubmissionType;
  name: string;
  contact: string;
  status: SubmissionStatus;
  submittedAt: Date;
  adminComment?: string;
}

export interface BusServiceSubmission extends BaseSubmission {
  type: SubmissionType.BUS_SERVICE;
  busNumber: string;
  registrationNumber: string;
  routeDetails: string;
}

export interface TechnicalSubmission extends BaseSubmission {
  type: SubmissionType.TECHNICAL;
  issueType: string;
  description: string;
}

export type ContactSubmission = BusServiceSubmission | TechnicalSubmission;