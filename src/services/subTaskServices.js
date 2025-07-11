import axios from 'axios'
const SUBTASK_ROUTES = import.meta.env.VITE_SUBTASK_ROUTES

export const getSubTask = async ({tarefaId})=>{
    const res = await axios.get(
        `${SUBTASK_ROUTES}load`,
        {
            params:{tarefaId:tarefaId},
            withCredentials:true
        }
    )
    return res.data
}

export const addSubTask = async ({task, tarefaId})=>{
    const res = await axios.put(
        `${SUBTASK_ROUTES}add`, 
        {task, tarefaId}, 
        {withCredentials:true})
    return res.data
}

export const editSubTask = async({descricao, tarefaId, subTarefaId})=>{
    const res = await axios.put(
        `${SUBTASK_ROUTES}edit`, 
        {descricao, tarefaId, subTarefaId}, 
        {withCredentials:true}
    )
    return res.data
}

export const deleteSubTask = async({subTarefaId, tarefaId})=>{
    const res = await axios.delete(
        `${SUBTASK_ROUTES}delete`,
        {
            data:{subTarefaId, tarefaId},
            withCredentials:true
        }
    )
    return res.data
}
