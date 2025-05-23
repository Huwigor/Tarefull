import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/userModel.js'; 
import dotenv from 'dotenv'
import CryptoJS from 'crypto-js';

dotenv.config()


const router = express.Router();

router.post('/', async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha){
    return res.status(400).json({mensagem: 'Email e senha obrigatorios'})
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ mensagem: 'Usuário não encontrado' });
    }

    if (user.tipo === 'googleAccount') {
      return res.status(401).json({ mensagem: 'Essa conta foi registrada com o Google. Use "Continue com o Google".' });
    }

    const senhaCorreta = await bcrypt.compare(senha, user.senha);

    if (!senhaCorreta) {
      return res.status(401).json({ mensagem: 'Email ou Senha inválido!' });
    }

    req.session.user = {
      id: user._id,
      nome: user.nome,
      email: user.email
    };

    
    const userData = {
      user: user.nome,
      email: user.email
    }

    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(userData),
      process.env.COOKIE_SECRET_USER
    ).toString();

    res.cookie("sessao_usuario", encrypted, {
      maxAge: 1000 * 60 * 60 * 24 * 30, 
      httpOnly: true, 
      secure: false, 
    });
    
    res.status(200).json({ mensagem: 'Login realizado com sucesso', user: req.session.user });

  } catch (err) {
    console.error('Erro ao logar:', err);
    res.status(500).json({ mensagem: 'Erro interno do servidor' });
  }
});

export default router;
