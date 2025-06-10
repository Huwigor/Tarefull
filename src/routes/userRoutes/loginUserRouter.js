import express from 'express';
import bcrypt from 'bcrypt';
import User from '../../models/userModel.js'; 
import dotenv from 'dotenv'
import CryptoJS from 'crypto-js';
import validator from 'validator'
import jwt from 'jsonwebtoken'

dotenv.config()



function validarEmail(email){

  if(!email){
    return 'Um Email é obrigatório'
  }

  if(!validator.isEmail(email)){
    return 'Insira um email válido!'
  }

}

function validarSenha(senha){

  if(!senha){
    return "A senha é obrigatória"
  }

  if(!validator.isLength(senha, {min:8})){
    return 'A senha deve ter no mínimo 8 caracteres!'
  }
   
  if(!/[A-Z]/.test(senha)){
    return 'A senha deve ter pelo menos uma letra maiúscula!'
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(senha)) {
    return "A senha deve conter pelo menos um caractere especial";
  }

  return null
}


const router = express.Router();

router.post('/', async (req, res) => {
  const { email, senha } = req.body;

  const erroEmail = validarEmail(req.body.email)
   if (erroEmail){
    return res.status(400).json({mensagem: 'Formato de email inválido!'})
   }

   const erroSenha = validarSenha(req.body.senha)
   if(erroSenha){
    return res.status(400).json({mensagem: 'Formato de senha inválido!'})
   }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ mensagem: 'Usuário não registrado!' });
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

    const token = jwt.sign(
     {userId:user.id, email:user.email},
     process.env.JWT_SECRET,
     {expiresIn: '30d'}      
    )
    
    user.authToken = token
    user.authTokenExpiry = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
    await user.save()
    
    res.status(200).json({ mensagem: 'Login realizado com sucesso', user: req.session.user });

  } catch (err) {
    console.error('Erro ao logar:', err);
    res.status(500).json({ mensagem: 'Erro interno do servidor' });
  }
});

export default router;
