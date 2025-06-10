import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../models/userModel.js';
import EmailQueue from '../../models/emailQueueModel.js';
import validator from 'validator'


const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;


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



router.post('/:token', async (req, res) => {
    const { password } = req.body
    const {token} = req.params

    try {

      const erroSenha = validarSenha(password)
      if(erroSenha){
        return res.status(400).json({mensagem: 'Formato de senha inválido!'})
      }
      
      const decoded = jwt.verify(token, JWT_SECRET);

      if(!decoded){
        return res.status(400).json({mensagem: 'Token inválido!'})
      }

      const user = await User.findOne({ _id: decoded.id });

      
      const emailList = await EmailQueue.findOne({ 
        email: user.email, 
        assunto: 'Recuperação'
      })

      if(!emailList){
        return res.status(400).json({message:'Ação Negada! Refaça o processo de recuperação!'})
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      user.senha = hashedPassword; 
      await user.save();

      const email = user.email
      await EmailQueue.deleteOne({email:email, assunto: 'Recuperação'})
      

        res.json({ message: 'Senha redefinida com sucesso.' });
    } catch(err) {
        res.status(400).json({ message: 'Token inválido ou expirado' });
    }
});

export default router;
