import { Document } from 'mongoose';

export enum FormType {
  BUS_SERVICE = 'busService',
  TECHNICAL = 'technical'
}

export interface Comment {
  text: string;
  adminName: string;
  createdAt: Date;
}

export interface BaseContactSubmission extends Document {
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