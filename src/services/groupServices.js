import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

const GROUP_SERVICES = process.env.GROUP_ROUTES

export const getGrupo = async()=>{
    const res = await axios.get(`${GROUP_SERVICES}allGroups`, {withCredentials:true})
    return res.data
}

export const addGroup = async ({nome}) =>{
    const res = await axios.post(`${GROUP_SERVICES}add`, {nome}, {withCredentials:true})
    return res.data
}

export const editGroup = async ({_id, nome}) =>{
    const res = await axios.put(`${GROUP_SERVICES}edit`, {_id, nome}, {withCredentials:true})
    return res.data
}

export const deleteGroup = async ({id}) =>{
   const res = await axios.delete(`${GROUP_SERVICES}delete`, 
    {
       data: {id},
       withCredentials:true
    }
   )
   return res.data
}