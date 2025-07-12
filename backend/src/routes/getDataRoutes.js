import express from 'express'
import authMiddleware from '../utils/authMiddleware.js'
import Tarefa from '../models/tarefasModel.js'
import Grupo from '../models/modelGrupo.js'


const GetData = express.Router()


GetData.get('/allTasks', authMiddleware, async(req, res)=>{

    try{

        const email = req.user.userEmail

        const tarefas = await Tarefa.find({ usuarioEmail: email }).sort({ dataHora: 1 });
        res.json(tarefas);

    }catch(err){
        return res.status(401).json({error: 'Erro ao buscar todas as tasks!'})
    }

})




GetData.get('/allGroups', authMiddleware, async(req, res)=>{

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
        return res.status(401).json({error: 'Erro ao carregar os grupos!'})
    }
})





GetData.get('/taskInProgress', authMiddleware, async(req, res)=>{

    try{
          
        const email = req.user.userEmail
        const agora = new Date();
          
        const tarefas = await Tarefa.find({ 
        usuarioEmail: email, 
        dataHora: { $gte: agora } 
        }).sort({ dataHora: 1 });
    
        res.json(tarefas);

    }catch(err){
       return res.status(401).json({error: 'Erro ao carregar as tarefas em andamento!'}) 
    }

})



GetData.get('/tasksFinished', authMiddleware, async(req, res)=>{
    
    try{

        const email = req.user.userEmail
        const agora = new Date();
          
        const tarefas = await Tarefa.find({ 
        usuarioEmail: email, 
        dataHora: { $lt: agora } 
        }).sort({ dataHora: -1 });
    
        res.json(tarefas);
    }catch(err){
        return res.status(401).json({error: 'Erro ao carregar tarefas finalizadas!'})
    }
})




export default GetData