import express from 'express'
import Tarefa from '../models/tarefasModel.js'
import { validarNome } from '../utils/sanitizeDataSubTasks.js'
import validator from 'validator'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import authMiddleware from '../utils/authMiddleware.js'

dotenv.config()

const SubTaskRoutes = express.Router()





SubTaskRoutes.get('/load', authMiddleware, async (req, res) =>{

    try{

        const tarefaId = req.query.tarefaId

        
        if (!mongoose.Types.ObjectId.isValid(tarefaId)) {
            return res.status(400).json({ message: 'O formato do id da tarefa é inválido!' })
        }

        const tarefa = await Tarefa.findById(tarefaId);

        if (!tarefa) {
            return res.status(404).json({ message: 'Tarefa não encontrada' });
        }

        res.status(200).json({ subTarefa: tarefa.subTarefa });

    }catch(err){
        console.error(err)
        return res.status(401).json({message: 'Erro ao carregar sub tasks!'})
    }
})  










SubTaskRoutes.put('/add', authMiddleware, async(req, res) =>{

    try{

        const {task, tarefaId} = req.body

        const subTaskValidada = validarNome(task)
        if(!subTaskValidada.isValid){
            return res.status(401).json({message: subTaskValidada.error})
        }
        const taskLimpa = subTaskValidada.valor
      
        if (!mongoose.Types.ObjectId.isValid(tarefaId)) {
            return res.status(400).json({ message: 'ID da tarefa inválido!' });
        }
                
        const searchTask = await Tarefa.findById(tarefaId)

        if(!searchTask){
            throw new Error('Tarefa não encontrada!')
        }

        if(searchTask.subTarefa.length >= 5){
            return
        }
    
        const newSubTask = {
            descricao: taskLimpa,
            subTaskStatus:'pendente'
        }
    
        searchTask.subTarefa.push(newSubTask)
        await searchTask.save()

        return res.status(200).json({ message: 'Sub-tarefa adicionada com sucesso!' });

    }catch(err){
        console.log(err)
        return res.status(400).json({message:'Erro ao adicionar sub task!'})
    }
    
})













SubTaskRoutes.put('/edit', authMiddleware, async (req, res)=>{

    try{

        const {descricao, tarefaId, subTarefaId} = req.body

        const descricaoValidada = validarNome(descricao)
        if(!descricaoValidada.isValid){
            return res.status(401).json({message: descricaoValidada.error})
        }
        const descricaoLimpa = descricaoValidada.valor
         

        if (!mongoose.Types.ObjectId.isValid(tarefaId)) {
            return res.status(400).json({ message: 'ID da tarefa inválido!' });
        }

         if (!mongoose.Types.ObjectId.isValid(subTarefaId)) {
            return res.status(400).json({ message: 'ID da subt tarefa inválido!' });
        }
 
    
        const tarefaAtualizada = await Tarefa.findOneAndUpdate(
            {_id:tarefaId, 'subTarefa._id':subTarefaId},
            {$set:{'subTarefa.$.descricao':descricaoLimpa}},
            {new:true}
        )

        if(!tarefaAtualizada){
            return res.status(200).json({message: 'Sub tarefa não encontrada!'})
        }

        return res.status(200).json({message:'Sub tarefa atualizada com sucesso!'})

    }catch(err){
        return res.status(500).json({message: 'Erro ao editar sub tarefa!'})
    }
})















SubTaskRoutes.delete('/delete', authMiddleware, async(req, res)=>{

    try{

        const {tarefaId, subTarefaId} =  req.body

        if(!subTarefaId || !tarefaId){
            return res.status(400).json({message: 'O id da tarefa e sub tarefa não fornecidos!'})
        }

        if (!mongoose.Types.ObjectId.isValid(tarefaId)) {
            return res.status(400).json({ message: 'ID da tarefa inválido!' });
        }

        if (!mongoose.Types.ObjectId.isValid(subTarefaId)) {
            return res.status(400).json({ message: 'ID da subt tarefa inválido!' });
        }
        
        await Tarefa.findOneAndUpdate(
            { _id: tarefaId, 'subTarefa._id': subTarefaId },
            { '$pull': { 'subTarefa': { _id: subTarefaId } } }, 
            { new: true } 
        );

        return res.status(200).json({message:'Tarefa excluida com sucesso!'})

    }catch(err){
        return res.status(500).json({message: 'Erro ao deletar sub tarefa!'})
    }
})













SubTaskRoutes.put('/status', authMiddleware, async(req, res)=>{
   
    try{

        const { status, subTarefaId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(subTarefaId)) {
            return res.status(400).json({ message: 'ID da subt tarefa inválido!' });
        }

        const allowedStatuses = ['pendente', 'concluido'];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ mensagem: 'Status inválido' });
        }

        const tarefa = await Tarefa.findOneAndUpdate(
            { 'subTarefa._id': subTarefaId }, 
            { '$set': { 'subTarefa.$.subTaskStatus': status } }, 
            { new: true, runValidators: true } 
        )
    
        if (!tarefa) {
            throw new Error(`Tarefa principal não encontrada para a subtarefa ${subTarefaId}.`);
        }
    
        res.json({ mensagem: 'Sub Tarefa atualizada com sucesso!' });

    }catch(err){
       return res.status(500).json({message: 'Erro ao atualizar o status!'}) 
    }

})



export default SubTaskRoutes    


