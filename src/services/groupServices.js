import axios from 'axios'
const GET_DATA = import.meta.env.VITE_GETDATA_ROUTES
const GROUP_ROUTES = import.meta.env.VITE_GROUP_ROUTES

export const getGrupo = async()=>{
    const res = await axios.get(`${GET_DATA}allGroups`, {withCredentials:true})
    return res.data
}

export const addGroup = async ({nome}) =>{
    const res = await axios.post(`${GROUP_ROUTES}add`, {nome}, {withCredentials:true})
    return res.data
}

export const editGroup = async ({_id, nome}) =>{
    const res = await axios.put(`${GROUP_ROUTES}edit`, {_id, nome}, {withCredentials:true})
    return res.data
}

export const deleteGroup = async ({id}) =>{
   const res = await axios.delete(`${GROUP_ROUTES}delete`, 
    {
       data: {id},
       withCredentials:true
    }
   )
   return res.data
}