import express from 'express'
import Tarefa from '../models/tarefasModel.js';
import validator from 'validator'
import mongoose from 'mongoose'
import { validarNome } from '../utils/sanitizeDataTasks.js'
import authMiddleware from '../utils/authMiddleware.js';


const TasksRoutes = express.Router()




TasksRoutes.post('/add', authMiddleware, async (req, res)=>{
  try{

    const { nome, tempo, dataCadastro, grupoId} = req.body
    const emailUser = req.user.userEmail

    const nomeValidado = validarNome(nome)
    if(!nomeValidado.isValid){
        return res.status(401).json({message: nomeValidado.error})
    }
    const nomeLimpo = nomeValidado.valor

    if (!validator.isISO8601(tempo)) {
        return res.status(400).json({ message: 'Formato de data inválido!' })
    }

    if (!validator.isISO8601(dataCadastro)) {
        return res.status(400).json({ message: 'Formato de data atual inválido!' })
    }

    let idGrupo 

    if(!grupoId || grupoId.trim() === ''){
        idGrupo = 'grupo_geral'
    } else{
        if (!mongoose.Types.ObjectId.isValid(grupoId)) {
                return res.status(400).json({ message: 'O formato do id do grupo é inválido!' })
        }
        idGrupo = grupoId.toString()

        const tarefasNoGrupo = await Tarefa.countDocuments({ grupoId: idGrupo });

        if (tarefasNoGrupo >= 5) {
            return res.status(403).json({ message: 'Este grupo já possui 5 tarefas!' });
        }
    }


    const novaTarefa = new Tarefa({
        nome: nomeLimpo,
        usuarioEmail: emailUser,
        dataHora: new Date(tempo),
        dataCadastro: new Date(dataCadastro),
        grupoId : idGrupo,
    })

    const tarefaSalva = await novaTarefa.save()
    res.status(201).json(tarefaSalva)

  }catch(err){
    return res.status(400).json({message: 'Erro ao adicionar Tarefa'})
  }

})









TasksRoutes.put('/edit', authMiddleware, async(req, res)=>{

    try{

        const {id, nome, dataHora} = req.body

        if (!id){
            return res.status(400).json({message:'O id da tarefa é obrigatório!'})
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Formato de id inválido!' })
        }

        const nomeValidado = validarNome(nome)
        if(!nomeValidado.isValid){
            return res.status(401).json({message: nomeValidado.error})
        }
        const nomeLimpo = nomeValidado.valor

        if (!validator.isISO8601(dataHora)) {
            return res.status(400).json({ message: 'Formato de data inválido!' })
        }
                

        const tarefaAtualizada =  await Tarefa.findOneAndUpdate(
            {_id: id},
            {nome: nomeLimpo, dataHora},
            {new:true},
        )

        if (!tarefaAtualizada) {
            return res.status(404).json({ mensagem: 'Tarefa não encontrada' });
        }

        res.json({message: 'Tarefa atualizada com sucesso!'})

    }catch(err){
        return res.status(400).json({message: 'Erro ao editar Tarefa'})
    }
    
})









TasksRoutes.delete('/delete', authMiddleware, async(req, res)=>{

    try{

        const { id } = req.body

        if (!id){
            return res.status(400).json({message:'O id da tarefa é obrigatório!'})
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Formato de id inválido!' })
        }

        const tarefa = await Tarefa.findOneAndDelete({ _id: id });

        if (!tarefa) {
        return res.status(404).json({ mensagem: 'Tarefa não encontrada' });
        }

        res.json({ mensagem: 'Tarefa apagada com sucesso' });

    }catch(err){
        return res.status(400).json({message: 'Erro ao deletar Tarefa'})
    }

})



export default TasksRoutes