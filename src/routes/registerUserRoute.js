import CryptoJS from 'crypto-js'
import express from 'express'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import Usuario from '../models/userModel.js'

const router = express.Router()

dotenv.config()

router.post("/", async (req, res) => {
    try {

      console.log("senha recebida:", req.body.senha)

      const hashedPassword = await bcrypt.hash(req.body.senha, 10)

      const {nome, email, googleId} = req.body;
  
      const novoUsuario = new Usuario({
        nome,
        email,
        senha: hashedPassword,
        tipo:'usuarioComum',
        googleId: googleId || null
      });
      
  
      await novoUsuario.save();
  
      const userData = {
        nome: novoUsuario.nome,
        email: novoUsuario.email,
      };
  
      const encrypted = CryptoJS.AES.encrypt(
        JSON.stringify(userData),
        process.env.COOKIE_SECRET_USER
      ).toString();
  
      res.cookie("sessao_usuario", encrypted, {
        maxAge: 1000 * 60 * 60 * 24 * 30, 
        httpOnly: true, 
        secure: false, 
      });
  
      return res.status(201).json({ mensagem: "Usuario cadastrado com sucesso"})
    } catch (error) {
      console.error(error);
      if (error.code === 11000) {
        return res.status(400).json({ mensagem: "O email já está sendo usado!" });
      }
    
      return res.status(500).json({ mensagem: "Erro interno no servidor" });
    }
  });
  
  export default router;