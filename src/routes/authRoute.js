import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import EmailQueue from '../models/emailQueueModel.js';
import dotenv from 'dotenv';

const router = express.Router();

dotenv.config();

const FRONTEND_URL = process.env.FRONT_URL;
const JWT_SECRET = process.env.JWT_SECRET;

router.post('/forgotPassword', async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 3600000; 
    await user.save();

    const link = `${FRONTEND_URL}/resetPassword/${token}`;

    await EmailQueue.create({
        to: email,
        subject: 'Recuperação de senha',
        templateData: { link },
    });

    res.json({ message: 'Link de recuperação enviado ao e-mail.' });
});

router.post('/resetPassword/:token', async (req, res) => {
    const { token } = req.params;
    const { password } = req.body; 

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findOne({ _id: decoded.id, resetToken: token, resetTokenExpiry: { $gt: Date.now() } });

        if (!user) {
            console.log('Usuário não encontrado ou token inválido/expirado.');
            return res.status(400).json({ message: 'Token inválido ou expirado' });
        }

        const isSamePassword = await bcrypt.compare(password, user.senha);

        if (isSamePassword) {
            user.resetToken = undefined;
            user.resetTokenExpiry = undefined;
            await user.save();
            console.log('Nova senha é igual à antiga. Token de redefinição removido.');
            return res.json({ message: 'A nova senha é a mesma que a senha atual. Token de redefinição removido.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.senha = hashedPassword; 
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();

        res.json({ message: 'Senha redefinida com sucesso.' });
    } catch(err) {
        console.error('Erro ao redefinir senha:', err);
        res.status(400).json({ message: 'Token inválido ou expirado' });
    }
});

export default router;
