import mongoose, { Schema } from 'mongoose';
import {
  FormType,
  Comment,
  ContactSubmission,
  BusServiceSubmission,
  TechnicalSubmission
} from '../interfaces/formSubmission';

const commentSchema = new Schema<Comment>({
  text: { type: String, required: true },
  adminName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const contactSubmissionSchema = new Schema<ContactSubmission>({
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
  comments: [commentSchema]
}, { discriminatorKey: 'formType' });

// Create the base model
const ContactSubmissionModel = mongoose.model<ContactSubmission>('ContactSubmission', contactSubmissionSchema);

// Create discriminators for specific types
ContactSubmissionModel.discriminator<BusServiceSubmission>(
  FormType.BUS_SERVICE,
  new Schema({
    busNumber: { type: String, required: true },
    ownerName: { type: String, required: true },
    ownerContact: { type: String, required: true },
    registrationNumber: { type: String, required: true },
    routeDetails: { type: String, required: true }
  })
);

ContactSubmissionModel.discriminator<TechnicalSubmission>(
  FormType.TECHNICAL,
  new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    issueType: { type: String, required: true },
    description: { type: String, required: true }
  })
);

export default ContactSubmissionModel;