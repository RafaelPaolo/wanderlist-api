import mongoose from 'mongoose';
import User from './userModel.js';
import { Types } from 'mongoose';

const placeSchema = new mongoose.Schema({
  user: {
    type: Types.ObjectId,
    ref: User,
  },
  place: {
    type: String,
    default: null,
  },  
  fromDate: {
    type: Date,
    default:null,
  },
  toDate: {
    type: Date,
    default: null,
  },
});

const Place = mongoose.model('Place', placeSchema);

export default Place;