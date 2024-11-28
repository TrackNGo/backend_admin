import mongoose, { Schema } from 'mongoose'
import lostNfoundDetail from '../interfaces/lostandFound'

const lostAndFoundItemSchema = new Schema<lostNfoundDetail>(
  {
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    busRoute: {
      type: String,
      required: true,
    },
    contactDetails: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['lost', 'found'],
      required: true,
    },
  },
  { timestamps: true }
);

const LostAndFoundItemModel = mongoose.model('LostAndFoundItem', lostAndFoundItemSchema)

export default LostAndFoundItemModel
