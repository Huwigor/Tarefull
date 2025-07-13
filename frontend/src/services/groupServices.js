import axios from 'axios'


const DATA_GROUP = import.meta.env.VITE_GETDATA_ROUTES
const GROUP_SERVICES = import.meta.env.VITE_GROUP_ROUTES

export const getGrupo = async()=>{
    const res = await axios.get(`${DATA_GROUP}allGroups`, {withCredentials:true})
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