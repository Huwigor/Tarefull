import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

const ROUTES_TASKS = process.env.TASKS_ROUTES
const GET_DATA = process.env.GETDATA_ROUTES


export const TaskGet = async()=>{
    const res = await axios.get(`${GET_DATA}allTasks`, {withCredentials:true})
    return res.data
}


export const addTask = async({nome, tempo, dataCadastro, grupoId})=>{
   const res = await axios.post(`${ROUTES_TASKS}add`, {
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
        `${ROUTES_TASKS}delete`,
        {
            data: {id},
            withCredentials:true
        }
    )
    return res.data
}


export const TaskEdit = async({id, nome, dataHora})=>{
    const res = await axios.put(
        `${ROUTES_TASKS}edit`,
        {id, nome, dataHora},
        {withCredentials:true}
    )
    return res.data
}