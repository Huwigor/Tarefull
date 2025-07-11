import axios from 'axios'
const taskRoutes = import.meta.env.VITE_TASKS_ROUTES
const GET_DATA = import.meta.env.VITE_GETDATA_ROUTES


export const TaskGet = async()=>{
    const res = await axios.get(`${GET_DATA}allTasks`, {withCredentials:true})
    return res.data
}


export const addTask = async({nome, tempo, dataCadastro, grupoId})=>{
   const res = await axios.post(`${taskRoutes}add`, {
        nome: nome,
        tempo: tempo,
        dataCadastro: dataCadastro,
        grupoId: grupoId
    }, {withCredentials:true} 
   )
   return res.data
}


export const deleteTask = async(id)=>{
    const res =  await axios.delete(
        `${taskRoutes}delete`,
        {
            data: {id},
            withCredentials:true
        }
    )
    return res.data
}


export const TaskEdit = async({id, nome, dataHora})=>{
    const res = await axios.put(
        `${taskRoutes}edit`,
        {id, nome, dataHora},
        {withCredentials:true}
    )
    return res.data
}