import mongoose from 'mongoose';


const UserSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId()
  },
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

  authToken: String,
  authTokenExpiry: Date,

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
