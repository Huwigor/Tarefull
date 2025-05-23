import express from 'express';
import Tarefa from '../models/tarefasModel.js';
import Grupo from '../models/modelGrupo.js';
import CryptoJS from 'crypto-js';
import dotenv from 'dotenv';
import { PanelRightDashed } from 'lucide-react';

dotenv.config();
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const encryptedEmail = req.cookies.sessao_usuario;
    if (!encryptedEmail) return res.status(401).json({ mensagem: 'Usuário não autenticado' });

    const bytes = CryptoJS.AES.decrypt(encryptedEmail, process.env.COOKIE_SECRET_USER);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

    const parsed = JSON.parse(decryptedData)
    const email = parsed.email

    
    let { nome, tempo, grupoId, detalhes } = req.body;

    if (!grupoId || grupoId.trim() === "") {
      let grupoDefault = await Grupo.findOne({ nome: 'Todas as Tarefas' });

      if (!grupoDefault) {
        grupoDefault = new Grupo({ nome: 'Todas as Tarefas' });
        await grupoDefault.save();
      }

      grupoId = grupoDefault._id;
    }

    const novaTarefa = new Tarefa({
      nome,
      dataHora: new Date(tempo),
      grupoId,
      detalhes,
      usuarioEmail: email
    });

    const tarefaSalva = await novaTarefa.save();
    res.status(201).json(tarefaSalva);
  } catch (err) {
    console.error("Erro ao salvar tarefa:", err.message);
    res.status(500).json({ mensagem: 'Erro ao salvar tarefa' });
  }
});

export default router;
