import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

const ROUTES_SUBTASK = process.env.SUBTASK_ROUTES

export const getSubTask = async ({tarefaId})=>{
    const res = await axios.get(
        `${ROUTES_SUBTASK}load`,
        {
            params:{tarefaId:tarefaId},
            withCredentials:true
        }
    )
    return res.data
}

export const addSubTask = async ({task, tarefaId})=>{
    const res = await axios.put(
        `${ROUTES_SUBTASK}add`, 
        {task, tarefaId}, 
        {withCredentials:true})
    return res.data
}

export const editSubTask = async({descricao, tarefaId, subTarefaId})=>{
    const res = await axios.put(
        `${ROUTES_SUBTASK}edit`, 
        {descricao, tarefaId, subTarefaId}, 
        {withCredentials:true}
    )
    return res.data
}

export const deleteSubTask = async({subTarefaId, tarefaId})=>{
    const res = await axios.delete(
        `${ROUTES_SUBTASK}delete`,
        {
            data:{subTarefaId, tarefaId},
            withCredentials:true
        }
    )
    return res.data
}
