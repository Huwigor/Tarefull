import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  senha: {
    type: String,
    required:false
  },
  
  resetToken: String,
  resetTokenExpiry:Date,

  googleId: {
    type: String
  },
  tipo: {
    type: String,
    required: true
  }
});



const User = mongoose.models.User || mongoose.model('User', UserSchema);
export default User;
