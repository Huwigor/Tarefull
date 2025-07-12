import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/userModel.js'; 
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import crypto from 'crypto'

dotenv.config()

const ID_CLIENT = process.env.GOOGLE_CLIENT_ID
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL


passport.use(new GoogleStrategy({
  clientID: ID_CLIENT,
  clientSecret: CLIENT_SECRET,
  callbackURL: CALLBACK_URL
},
async (accessToken, refreshToken, profile, done) => {
  try {
    let existingUser = await User.findOne({ email: profile.emails[0].value });

    if (existingUser) {
      return done(null, existingUser); 
    }

      const randomPassword = crypto.randomBytes(20).toString('hex');

      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      const idUser = profile._id
      const email = profile.emails[0].value

      const token = jwt.sign(
        { userId: idUser, email: email },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
      );
      
      const tokenExpiry = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
      
      
    const newUser = new User({
      nome: profile.displayName,
      email: profile.emails[0].value,
      senha: hashedPassword,
      authToken: token,
      authTokenExpiry: tokenExpiry,
      tipo:'googleAccount' 
    });

    await newUser.save();

   

    done(null, newUser);
  } catch (err) {
    return done(err, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
