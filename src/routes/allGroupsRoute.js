import express from 'express'
import Grupo from '../models/modelGrupo.js'
import Tarefa from '../models/tarefasModel.js'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const grupos = await Grupo.find();

    const gruposComTarefas = await Promise.all(
      grupos.map(async (grupo) => {
        const tarefas = await Tarefa.find({ grupoId: grupo._id });

        const tarefasFormatadas = tarefas.map((tarefa) => ({
          ...tarefa.toObject(),
          dataHora: tarefa.dataHora?.toISOString(),
          criadoEm: tarefa.criadoEm?.toISOString()
        }));

        return {
          ...grupo.toObject(),
          tarefas: tarefasFormatadas
        };
      })
    );

    res.json(gruposComTarefas);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar dados' });
  }
});

export default router  
  