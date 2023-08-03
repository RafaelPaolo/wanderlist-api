import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    default: null,
  },  
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    default: null,
  },
});

const User = mongoose.model('User', userSchema);

export default User;

