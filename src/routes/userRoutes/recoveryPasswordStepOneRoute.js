import express from 'express'
import jwt from 'jsonwebtoken'
import User from '../../models/userModel.js'
import EmailQueue from '../../models/emailQueueModel.js'
import EnviarEmail from '../../email/funSendEmailForgotPassword.js'
import mongoDB from '../../config/db.js'
import validator from 'validator'


const router = express.Router()
mongoDB()



const JWT_SECRET = process.env.JWT_SECRET
const URL_FRONT = process.env.FRONT_URL


router.post('/', async (req, res) => {

    const { email } = req.body

    try{

        if (!email) {
            return res.status(400).json({ message: 'O email é obrigatório!' });
        }
    
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: 'Formato de email inválido!' });
        }
    
        const emailLimpo = validator.normalizeEmail(email || '');
    
        const dominio = emailLimpo.split('@')[1];
    
        if (dominio.toLowerCase() !== 'gmail.com') {
            return res.status(400).json({ message: 'Aceitamos apenas emails do Gmail!' });
        }

        const user = await User.findOne({ email })
    
        if (!user) return res.status(404).json({ message: 'Usuário não encontrado' })

        const listaExistente = await EmailQueue.findOne({email:email, assunto: 'Recuperação'})

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
            email,
            tokenJwt,
            assunto: 'Recuperação',
            lastAttempt: Date.now()
        })
    
        await EnviarEmail(userEmail, link)
    
        return res.status(200).json({ message: `Link de recuperação enviado ao e-mail ${userEmail}!` })

    } catch(err) {
        console.error('Erro na rota de recuperação de senha:', err)
        return res.status(500).json({ message: 'Erro ao processar solicitação.' })
    }

});

export default router