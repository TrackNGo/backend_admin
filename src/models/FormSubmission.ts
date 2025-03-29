import mongoose from 'mongoose';
import {
  SubmissionType,
  SubmissionStatus,
  ContactSubmission
} from '../interfaces/FormSubmi';

const submissionSchema = new mongoose.Schema({
  type: { 
    type: String, 
    enum: Object.values(SubmissionType), 
    required: true 
  },
  name: { type: String, required: true },
  contact: { type: String, required: true },
  status: { 
    type: String, 
    enum: Object.values(SubmissionStatus),
    default: SubmissionStatus.PENDING
  },
  submittedAt: { type: Date, default: Date.now },
  adminComment: String,
  // Bus Service specific
  busNumber: String,
  registrationNumber: String,
  routeDetails: String,
  // Technical specific
  issueType: String,
  description: String
}, { discriminatorKey: 'type' });

export default mongoose.model<ContactSubmission>('Contact', submissionSchema);