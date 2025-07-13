import express from 'express'
import { validarEmail, validarNome, validarSenha } from '../../utils/sanitizeDataAuthUser.js'
import EmailQueue from '../../models/emailQueueModel.js'
import EnviarEmail from '../../email/funSendUserRegisterEmail.js'
import { gerarToken } from '../../utils/gerarTokenJwt.js'
import User from '../../models/userModel.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'



const UserRegister  = express.Router()


UserRegister.post('/registerStepOne', async(req, res)=>{
    try{

        const {nome, email} = req.body

        const nomeValidado = validarNome(nome)
        if(!nomeValidado.isValid){
            return res.status(401).json({error: nomeValidado.error})
        }
        const nomeLimpo = nomeValidado.valor

        const emailValidado = validarEmail(email)
        if(!emailValidado.isValid){
            return res.status(401).json({error: emailValidado.error})
        }
        const emailLimpo = emailValidado.valor

        const dominio = emailLimpo.split('@')[1]

        if (dominio.toLowerCase() !== 'gmail.com') {
            return res.status(400).json({ message: 'Aceitamos apenas emails do Gmail!' })
        }

        const userExistente = await User.findOne({ email: emailLimpo })

        if(userExistente){
            return res.status(400).json({message: 'O email já está cadastrado!'})
        }


        const emailExistente = await EmailQueue.findOne({ email: emailLimpo });


        let tokenAtual;

        if (emailExistente) {

        try {

            jwt.verify(emailExistente.tokenJwt, process.env.JWT_SECRET);

            return res.status(400).json({
                message: 'Uma mensagem de cadastro foi enviada, verifique seu email.'
            });

        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                tokenAtual = gerarToken(nomeLimpo, emailLimpo);
                emailExistente.tokenJwt = tokenAtual;
                await emailExistente.save();

            } else {
               return res.status(400).json({ message: 'Token inválido, tente novamente.' });
            }
        }
        } else {

            tokenAtual = gerarToken(nomeLimpo, emailLimpo)

            const dadosEmail = new EmailQueue({
                email: emailLimpo,
                tokenJwt: tokenAtual,
                assunto: 'Registro'
            })
            await dadosEmail.save();
        
       }
      
        const URL_FRONT = process.env.FRONT_URL
        const linkCadastro = `${URL_FRONT}/registerUserStepThree/${tokenAtual}`;

        await EnviarEmail(emailLimpo, linkCadastro);
        
        res.json({message: 'Dados para confirmação por email enviados!'})

    }catch(err){
        console.error(err)
        return res.status(500).json({error: 'Erro ao enviar o email de registro!'})
    }
})






UserRegister.post('/registerStepThree', async(req, res)=>{
    try{

        const {senha, token} = req.body

        const senhaValidada = validarSenha(senha)
        if(!senhaValidada.isValid){
            return res.status(401).json({error: senhaValidada.error})
        }
        const senhaLimpa = senhaValidada.valor
 
        let decoded
        try{
            decoded = jwt.verify(token, process.env.JWT_SECRET)
        }catch(error){
            if (error.name === 'TokenExpiredError') {
              return res.status(401).json({error: 'Não permitido, refaça o processo de cadastro!'})
            }
            
            return res.status(401).json({ message: 'Token inválido!' })
            
        }

        const { nome, email } = decoded

        const tokenEmail = await EmailQueue.findOne({ email })

        if (!tokenEmail) {
            return res.status(404).json({ message: 'Token não encontrado para este email!' })
        }

        if (token !== tokenEmail.tokenJwt) {
            return res.status(401).json({ message: 'Token não corresponde ao salvo no servidor!' })
        }

        const hashedPassword = await bcrypt.hash(senhaLimpa, 10)

        const novoUsuario = await User.create({
            nome,
            email,
            senha: hashedPassword,
            tipo:'usuarioComum',
            googleId: null,
        })
        
        const authToken = jwt.sign(
            { nome: novoUsuario.nome, email: novoUsuario.email },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        )
        
        const tokenExpiry = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
        novoUsuario.authToken = authToken
        novoUsuario.authTokenExpiry = tokenExpiry
        await novoUsuario.save()

        await EmailQueue.deleteOne({email})
        
        res.status(201).json({ message: 'Usuário criado com sucesso!', usuario: novoUsuario })
         
    }catch(err){
        console.error(err)
        return res.status(500).json({error: 'Erro ao enviar o email de registro!'})
    }
})



export default UserRegister