import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

const EMAIL_MAIN = process.env.EMAIL_MAIN
const GOOGLE_EMAIL_PASS = process.env.GOOGLE_EMAIL_PASS

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
      user: EMAIL_MAIN,
      pass: GOOGLE_EMAIL_PASS
    },
    secure: true,
    port: 465
})


async function EnviarEmail(userEmail, link) {
    try {
        const emailContent = `
            <p>Olá, somos da equipe Tarefull e aqui está..</p>
            <h3>Seu link de recuperação!</h3>
            <p><a href="${link}">Clique aqui para continuar com a recuperação de conta!</a></p>
            <p>Se você não solicitou isso, ignore este e-mail.</p>
        `

        const mailOptions = {
            from: EMAIL_MAIN, 
            to: userEmail,    
            subject: 'Recuperação de conta!', 
            html: emailContent, 
        }

        const resultado = await transporter.sendMail(mailOptions)
        console.log('Email enviado para', resultado.messageId)
        return resultado

    } catch (err) {
        console.error(`Erro ao enviar para ${userEmail}:`, err)
        throw err
    }   
}


export default EnviarEmail