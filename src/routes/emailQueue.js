import express from 'express';
import EmailQueue from '../models/emailQueueModel.js';
import cron from 'node-cron';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer'; 

const router = express.Router();
dotenv.config();

const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS } = process.env;

const transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: parseInt(EMAIL_PORT, 10),
    secure: parseInt(EMAIL_PORT, 10) === 465, 
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
    },
});

router.get('/process-queue', async (req, res) => {
    const result = await processEmailQueue();
    res.json(result);
});

cron.schedule('*/1 * * * *', async () => {
    console.log('Processando fila de e-mails...');
    await processEmailQueue();
});

async function processEmailQueue() {
    const emails = await EmailQueue.find({ status: 'pending' }).limit(5);

    const results = [];

    for (const email of emails) {
        try {
            const emailContent = `
                <p>Olá,</p>
                <p>Você solicitou uma recuperação de senha. Clique no link abaixo para redefinir sua senha:</p>
                <p><a href="${email.templateData.link}">${email.templateData.link}</a></p>
                <p>Se você não solicitou isso, ignore este e-mail.</p>
            `;

            const mailOptions = {
                from: EMAIL_USER, 
                to: email.to,    
                subject: email.subject, 
                html: emailContent, 
            };

            await transporter.sendMail(mailOptions);

            await EmailQueue.updateOne(
                { _id: email._id },
                { $set: { status: 'sent', lastAttempt: new Date() } }
            );

            console.log(` Email enviado para ${email.to}`);
            results.push({ email: email.to, status: 'sent' });
        } catch (err) {
            console.error(`Erro ao enviar para ${email.to}:`, err);
            await EmailQueue.updateOne(
                { _id: email._id },
                {
                    $set: { lastAttempt: new Date() },
                    $inc: { attempts: 1 },
                    $set: { status: email.attempts >= 3 ? 'failed' : 'pending' }
                }
            );

            results.push({ email: email.to, status: 'error' });
        }
    }

    return results;
}

export default router;
