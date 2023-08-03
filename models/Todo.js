import mongoose from 'mongoose';
import { Types } from 'mongoose';
import User from './userModel.js';
import Place from './placeModel.js';


const todoSchema = new mongoose.Schema({
  time: {
    type: String,
    default: null,
  },  
  task: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  day: {
    type: Number, 
  },
  place: {
    type: String,
    ref: 'Place',
  },
  userID: {
    type: Types.ObjectId,
    ref: 'User',
  },
});

const Todo = mongoose.model('Todo', todoSchema);

export default Todo;
