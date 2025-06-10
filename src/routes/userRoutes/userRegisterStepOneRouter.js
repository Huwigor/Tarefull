import express from 'express'
import jwt from 'jsonwebtoken'
import EmailQueue from '../../models/emailQueueModel.js';
import User from '../../models/userModel.js';  
import mongoDB from '../../config/db.js';
import validator from 'validator'
import EnviarEmail from '../../email/funSendUserRegisterEmail.js'


const router = express.Router()
mongoDB()



function gerarToken(nome, email) {
  return jwt.sign({ nome, email }, process.env.JWT_SECRET, { expiresIn: '24h' });
}



router.put('/', async (req, res)=>{
  try{
  
    const {nome, email} = req.body

    const nomeLimpo = validator.trim(nome || '');

    if (!nomeLimpo) {
       return res.status(400).json({ message: 'O nome é obrigatório!' });
    }

    if (!validator.isLength(nomeLimpo, { min: 8, max: 30 })) {
       return res.status(400).json({ message: 'O nome deve ter entre 8 e 30 caracteres!' });
    }

    if (!email) {
       return res.status(400).json({ message: 'O email é obrigatório!' });
    }

    if(!validator.isLength(email, {min:20, max: 254})) {
      return res.status(400).json({ message: 'O email deve ter entre 20 a 254 caracteres!' })
    }

    if (!validator.isEmail(email)) {
       return res.status(400).json({ message: 'Formato de email inválido!' });
    }

    const emailLimpo = validator.normalizeEmail(email || '');

    const dominio = emailLimpo.split('@')[1];

    if (dominio.toLowerCase() !== 'gmail.com') {
        return res.status(400).json({ message: 'Aceitamos apenas emails do Gmail!' });
    }

    const userExistente = await User.findOne({ email: email })

    if(userExistente){
        return res.status(400).json({message: 'O email já está cadastrado!'})
    }


    const emailExistente = await EmailQueue.findOne({ email: email });


    let tokenAtual;

    if (emailExistente) {

      try {
        jwt.verify(emailExistente.tokenJwt, process.env.JWT_SECRET);

        return res.status(400).json({
          message: 'Uma mensagem de cadastro foi enviada, verifique seu email.'
        });

      } catch (err) {
        if (err.name === 'TokenExpiredError') {
          tokenAtual = gerarToken(nome, email);
          emailExistente.tokenJwt = tokenAtual;
          await emailExistente.save();

        } else {
          return res.status(400).json({ message: 'Token inválido, tente novamente.' });
        }
      }
    } else {
      tokenAtual = gerarToken(nome, email);
      const dadosEmail = new EmailQueue({
        email,
        tokenJwt: tokenAtual,
        assunto: 'Registro'
      });
      await dadosEmail.save();
    }
    
    const URL_FRONT = process.env.FRONT_URL
    const linkCadastro = `${URL_FRONT}/registerUserStepThree/${tokenAtual}`;

    await EnviarEmail(email, linkCadastro);
    

    res.json({message: 'Dados para confirmação por email enviados!'})

  } catch(err){
    res.status(500).json({message: 'Erro ao enviar dados para confirmação de email!'})
    console.log(err)
  }

})

export default router