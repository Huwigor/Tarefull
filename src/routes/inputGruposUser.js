import express from 'express'
import CryptoJS from 'crypto-js';
import Grupo from '../models/modelGrupo.js';
import dotenv from 'dotenv'

dotenv.config()

const router = express.Router()

router.get('/', async (req, res)=>{


    try{

        const encryptedEmail = req.cookies.sessao_usuario;

        if (!encryptedEmail) {
            return res.status(401).json({ mensagem: 'Usuário não autenticado' });
        }

        const bytes = CryptoJS.AES.decrypt(encryptedEmail, process.env.COOKIE_SECRET_USER);
        const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

        const parsed = JSON.parse(decryptedData); 
        const emailUser = parsed.email


        if (!emailUser) {
            return res.status(401).json({ mensagem: 'Falha na descriptografia do email' });
        }

        console.log('Email do usuário:', emailUser);
        
        const grupos = await Grupo.find({ emailUser })
        res.status(200).json(grupos)

    } catch (err) {
        console.error('Erro ao buscar grupos:', err.message);
        res.status(500).json({ mensagem: 'Erro interno ao buscar grupos' });
    }
})

export default router