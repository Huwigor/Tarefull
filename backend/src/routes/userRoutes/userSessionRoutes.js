import express from 'express'
import authMiddleware from '../../utils/authMiddleware.js'
import { validarSenha, validarEmail } from '../../utils/sanitizeDataAuthUser.js'
import User from '../../models/userModel.js'
import CryptoJS from 'crypto-js'
import bcrypt from 'bcryptjs'



const UserSession = express.Router()


UserSession.post('/login', async(req, res)=>{

    try{

        const { email, senha } = req.body;
        
        const emailValidado = validarEmail(email)
        if(!emailValidado.isValid){
            return res.status(401).json({mensagem: emailValidado.error})
        }
        const emailLimpo = emailValidado.valor

        const senhaValidada = validarSenha(senha)
        if(!senhaValidada.isValid){
            return res.status(401).json({mensagem: senhaValidada.error})
        }
        const senhaLimpa = senhaValidada.valor
            
        const user = await User.findOne({ email: emailLimpo })

        if(!user){
            return res.status(401).json({mensagem: 'Email ou senha inválido!'})
        }
    
        if (user.tipo === 'googleAccount') {
            return res.status(401).json({ mensagem: 'Essa conta foi registrada com o Google. Use "Continue com o Google".' })
        }
    
        const senhaCorreta = await bcrypt.compare(senhaLimpa, user.senha)
    
        if (!senhaCorreta) {
            return res.status(401).json({ mensagem: 'Email ou Senha inválido!' })
        }
    
        const userData = {
            _id: user._id.toString(),
            nome: user.nome,
            email: user.email
        }
    
        const encrypted = CryptoJS.AES.encrypt(
            JSON.stringify(userData),
            process.env.COOKIE_SECRET_USER
        ).toString()
    
    
        res.cookie("sessao_usuario", encrypted, {
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'None' ,
            maxAge: 1000 * 60 * 60 * 24 * 30
        })
        
        res.status(200).json({ mensagem: 'Login realizado com sucesso'})

    }catch(err){
        console.log(err)
        return res.status(401).json({error: 'Erro ao realizar o login!'})
    }
})




UserSession.post('/logout', authMiddleware, async(req, res)=>{
    try{

        res.clearCookie("sessao_usuario", {
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'None' ,
            maxAge: 1000 * 60 * 60 * 24 * 30
        });

        res.status(200).json({ mensagem: "Sessão encerrada com sucesso" });

    }catch(err){
        return res.status(401).json({error: 'Errp ao realizar o login!'})
    }
})



export default UserSession