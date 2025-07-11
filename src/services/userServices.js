import axios from 'axios'
const USER_SESSION_ROUTES = import.meta.env.VITE_USER_SESSION_ROUTES
const USER_RECOVERY_ROUTES = import.meta.env.VITE_USER_RECOVERY_ROUTES
const USER_REGISTER_ROUTES = import.meta.env.VITE_USER_REGISTER_ROUTES


export const loginUser = async({email, senha})=>{
    const res = await axios.post(
        `${USER_SESSION_ROUTES}login`,
        {email, senha},
        {withCredentials:true}
    )
    return res.data
}

export const userRegisterStepOne = async(nome, email)=>{
    const res = await axios.post(
        `${USER_REGISTER_ROUTES}registerStepOne`, 
        {nome, email}, 
        {withCredentials:true}
    )
    return res.data
}

export const userRegisterStepThree = async(token, senha)=>{
    const res = await axios.post(
        `${USER_REGISTER_ROUTES}registerStepThree`, 
        {token, senha}, 
        {withCredentials:true}
    )
    return res.data
}

export const userRecoveryStepOne = async(email)=>{
    const res = await axios.post(
        `${USER_RECOVERY_ROUTES}recoveryStepOne`, 
        {email}, 
        {withCredentials:true}
    )
    return res.data
}

export const userRecoveryStepThree = async(token, password)=>{
    const res = await axios.post(
        `${USER_RECOVERY_ROUTES}recoveryStepThree/${token}`, 
        {token, password}
    )
    return res.data
}