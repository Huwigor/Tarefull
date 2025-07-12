import express from "express";
import passport from "passport";
import CryptoJS from "crypto-js";
import dotenv from 'dotenv'

dotenv.config()


const router = express.Router();

router.get("/google", passport.authenticate("google", {
  scope: ["profile", "email"]
}));

router.get("/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONT_URL}/loginUser`
  }),
  (req, res) => {
    const userData = {
      _id: req.user._id.toString(),
      nome: req.user.nome,
      email: req.user.email,
    };

    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(userData),
      process.env.COOKIE_SECRET_USER
    ).toString();

    res.cookie("sessao_usuario", encrypted, {
      maxAge: 1000 * 60 * 60 * 24 * 30, 
      httpOnly: true,
      secure: false
    });

    res.redirect(`${process.env.FRONT_URL}`);
  }
);

export default router;
