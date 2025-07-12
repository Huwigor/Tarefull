import express from 'express'
import mongoose from 'mongoose'
import Tarefa from '../models/tarefasModel.js'
import Grupo from '../models/modelGrupo.js'
import { validarNome } from '../utils/sanitizeDataGroups.js'
import authMiddleware from '../utils/authMiddleware.js'


const GroupRoutes = express.Router()

GroupRoutes.get('/get', authMiddleware, async(req, res)=>{
    try{

        const email = req.user.userEmail

        const grupos = await Grupo.find({emailUser: email});

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

    }catch(err){
        console.error(err)
        return res.status(500).json({error: 'Erro ao carregar Grupos!'})
    }
})


GroupRoutes.post('/add', authMiddleware, async(req, res)=>{
    try{

        const {nome}= req.body
        const email = req.user.userEmail

        const nomeValidado = validarNome(nome)
        if(!nomeValidado.isValid){
            return res.status(401).json({mensagem: nomeValidado.error})
        }
        const nomeLimpo = nomeValidado.valor

        const totalGrupos = await Grupo.countDocuments({emailUser: email})

        if(totalGrupos >= 5){
            return res.status(403).json({ mensagem: 'Limite de 5 grupos atingido!' });
        }
        
        const novoGrupo = new Grupo({
            nome: nomeLimpo,
            emailUser: email
        })

        await novoGrupo.save()

        res.status(200).json({mensagem: 'grupo criado com sucesso!'})

    }catch(err){
        return res.status(400).json({error: 'Erro ao adicionar grupo!'})
    }
})


GroupRoutes.put('/edit', authMiddleware, async (req, res)=>{
    try{

        const {_id, nome} = req.body

        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(400).json({ message: 'O formato do id de grupo é inválido!' })
        }

        const nomeValidado = validarNome(nome)
        if(!nomeValidado.isValid){
            return res.status(401).json({message: nomeValidado.error})
        }
        const nomeLimpo = nomeValidado.valor

        const grupoEditado = await Grupo.findOneAndUpdate(
            {_id: _id},
            {nome: nomeLimpo},
            {new:true}
        )

        if(!grupoEditado){
            return res.status(401).json({messsage: 'O grupo não existe!'})
        }
        
        return res.status(200).json({message: 'Grupo atualizado com sucesso!'})

    }catch(err){
        return res.status(500).json({error: 'Erro ao Editar Grupo!'})
    }
})


GroupRoutes.delete('/delete', async(req, res)=>{
    try{

        const id = req.body.id

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'O formato do id de grupo é inválido!' })
        }

        const grupoDeletado = await Grupo.findOneAndDelete({ _id: id })
        
        if(!grupoDeletado){
            return res.status(400).json({message:'Grupo não encontrado!'})
        }

        await Tarefa.deleteMany({ grupoId: id})
    
        return res.status(200).json({message: 'Grupo e tarefas deletados com sucesso!'})


    }catch(err){
        return res.status(500).json({error: 'Erro ao deletar grupo!'})
    }
})




export default GroupRoutes