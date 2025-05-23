import express from 'express';
import Tarefa from '../models/tarefasModel.js';
import CryptoJS from 'crypto-js';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const encryptedEmail = req.cookies.sessao_usuario;
    if (!encryptedEmail) return res.status(401).json({ mensagem: 'Não autenticado' });

    const bytes = CryptoJS.AES.decrypt(encryptedEmail, process.env.COOKIE_SECRET_USER);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    const parsed = JSON.parse(decryptedData);
    const email = parsed.email;

    const tarefas = await Tarefa.find({ usuarioEmail: email }).sort({ dataHora: 1 });
    res.json(tarefas);
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao buscar tarefas' });
  }
});


export default router