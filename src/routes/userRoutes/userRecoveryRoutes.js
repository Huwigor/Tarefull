import express from 'express'
import bcrypt from 'bcryptjs'
import { validarEmail, validarSenha } from '../../utils/sanitizeDataAuthUser.js'
import User from '../../models/userModel.js'
import EmailQueue from '../../models/emailQueueModel.js'
import jwt from 'jsonwebtoken'
import EnviarEmail from '../../email/funSendEmailForgotPassword.js'



const JWT_SECRET = process.env.JWT_SECRET
const URL_FRONT = process.env.FRONT_URL
const UserRecovery = express.Router()


UserRecovery.post('/recoveryStepOne', async(req, res)=>{
    try{

        const { email } = req.body

        const emailValidado = validarEmail(email)

        if(!emailValidado.isValid){
            return res.status(401).json({message: emailValidado.error})
        }
        const emailLimpo = emailValidado.valor
        
        const user = await User.findOne({ email: emailLimpo })
    
        if (!user) return res.status(404).json({ message: 'Usuário não encontrado' })

        const listaExistente = await EmailQueue.findOne({email:emailLimpo, assunto: 'Recuperação'})

        if(listaExistente){
            return res.status(400).json({message: `Uma mensagem de recuperação já foi enviada ao ${email}, verifique sua Caixa de entrada! `})
        }
    
        if (user.resetToken && user.resetTokenExpiry > Date.now()) {
            return res.status(400).json({ message: 'Um email de recuperação já foi enviado, verifique sua caixa de mensagem.' })
        }
    
        const tokenJwt = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '24h' })
    
        const userEmail = user.email
        const link = `${URL_FRONT}/resetPassword/${tokenJwt}`
    
    
        await EmailQueue.create({
            email: emailLimpo,
            tokenJwt,
            assunto: 'Recuperação',
            lastAttempt: Date.now()
        })
    
        await EnviarEmail(userEmail, link)
    
        return res.status(200).json({ message: `Link de recuperação enviado ao e-mail ${userEmail}!` })


    }catch(err){
        return res.status(500).json({message: 'Erro ao enviar email de recuperação!'})
    }
})







UserRecovery.post('/recoveryStepThree/:token', async(req, res)=>{
    try{

        const { password } = req.body
        const {token} = req.params

        const senhaValidada = validarSenha(password)
        if(!senhaValidada.isValid){
          return res.status(400).json({message: senhaValidada.error})
        }
        const senhaLimpa = senhaValidada.valor
        
        const decoded = jwt.verify(token, JWT_SECRET);

        if(!decoded){
           return res.status(400).json({message: 'Token inválido!'})
        }

        const user = await User.findOne({ _id: decoded.id });
 
        const emailList = await EmailQueue.findOne({ 
            email: user.email, 
            assunto: 'Recuperação'
        })

        if(!emailList){
           return res.status(400).json({message:'Ação Negada! Refaça o processo de recuperação!'})
        }

        const hashedPassword = await bcrypt.hash(senhaLimpa, 10);
        user.senha = hashedPassword; 
        await user.save();

        const email = user.email
        await EmailQueue.deleteOne({email:email, assunto: 'Recuperação'})
        

        res.json({ message: 'Senha redefinida com sucesso.' });

    }catch(err){
        return res.status(401).json({message: 'Erro ao redefinir senha!'})
    }
})


export default UserRecovery