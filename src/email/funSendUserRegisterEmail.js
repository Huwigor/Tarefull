import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
      user: process.env.EMAIL_MAIN,
      pass: process.env.GOOGLE_EMAIL_PASS
    },
    secure: true,
    port: 465
});


async function EnviarEmail(email, linkCadastro) {
    try {
        const emailContent = `
            <p>Olá, somos da equipe Tarefull e aqui está..</p>
            <h3>Seu link de cadastro!</h3>
            <p><a href="${linkCadastro}">Clique aqui para continuar o cadastro</a></p>
            <p>Se você não solicitou isso, ignore este e-mail.</p>
        `;

        const mailOptions = {
            from: process.env.EMAIL_MAIN, 
            to: email,    
            subject: 'Confirmação de cadastro!', 
            html: emailContent, 
        };

        const resultado = await transporter.sendMail(mailOptions);
        console.log('Email enviado para', resultado.messageId);
        return resultado;

    } catch (err) {
        console.error(`Erro ao enviar para ${email}:`, err);
        throw err; 
    }   
}


export default EnviarEmail
