import {useState, useEffect} from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios'
import { EyeOff, Eye, Lock, CircleCheck, ShieldAlert } from 'lucide-react';
import '../css/useRegisterStepThree.css'
import HeaderAuth from '../components/headerAuth.jsx'

export default function UserRegisterThree(){


    const [confirmSenha, setConfirmSenha] = useState('')
    const [showSenha, setShowSenha] = useState(false)
    const [showConfirmSenha, setShowConfirmSenha] = useState(false)
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    
    
    
    
    const [password, setPassword] = useState('')
    const [passwordError, setPasswordError] = useState('');
    const [confirmError, setConfirmError] = useState('');   
    const [passwordValid, setPasswordValid] = useState(null)
    const [confirmPasswordValid, setConfirmPasswordValid] = useState(null)
    const [iconPasswordValid, setIconPasswordValid] = useState(false)
    const [iconPasswordInvalid, setIconPasswordInvalid] = useState(false)


    const validatePassword = (password) => {
        const hasUpperCase = /[A-Z]/.test(password);
        const hasSymbol = /[^A-Za-z0-9]/.test(password);
        const hasPasswordLength = password.length >= 8 && password.length <= 50;    
    
        if (!hasPasswordLength) {
            setIconPasswordValid(false)
            setIconPasswordInvalid(true)
            setPasswordError('A senha deve ter entre 8 a 50 caracteres!');
            setPasswordValid(false)
            return false
        } else if (!hasUpperCase) {
            setIconPasswordValid(false)
            setIconPasswordInvalid(true)
            setPasswordError('A senha deve conter pelo menos uma letra maiúscula.');
            setPasswordValid(false)
            return false
        } else if (!hasSymbol) {
            setIconPasswordValid(false)
            setIconPasswordInvalid(true)
            setPasswordError('A senha deve conter pelo menos um símbolo.');
            setPasswordValid(false)
            return false
        } else {
            setIconPasswordInvalid(false)
            setIconPasswordValid(true)
            setPasswordError('');
            setPasswordValid(true)
            return true
        }
    };



    const [iconConfirmPasswordValid, setIconConfirmPasswordValid] = useState(false)
    const [iconConfirmPasswordInvalid, setIconConfirmPasswordInvalid] = useState(false)

    const validateConfirmPassword = (password, confirm) => {
        if (password !== confirm) {
            setIconConfirmPasswordValid(false)
            setIconConfirmPasswordInvalid(true)
            setConfirmError('As senhas não coincidem.');
            setConfirmPasswordValid(false)
            return false
        } else {
            setIconConfirmPasswordInvalid(false)
            setIconConfirmPasswordValid(true)
            setConfirmError('');
            setConfirmPasswordValid(true)
            return true
        }
    };






    const fullText = "Escolha uma senha forte, com no mínimo 8 caracteres, um símbolo e uma letra maiúscula!";
    const [typedText, setTypedText] = useState('');
    const [index, setIndex] = useState(0);

    useEffect(() => {
    if (index < fullText.length) {
        const timeout = setTimeout(() => {
        setTypedText(prev => prev + fullText.charAt(index));
        setIndex(prev => prev + 1);
        }, 15);
        return () => clearTimeout(timeout);
    } 

    }, [index]);



    
    const navigate = useNavigate()
    const URL_SERVER = import.meta.env.VITE_ROUTE_SERVER
    const {token} = useParams()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        const isPasswordValid = validatePassword(password)
        const isConfirmValid = validateConfirmPassword(password, confirmSenha)

        if (!isPasswordValid || !isConfirmValid) {
            setLoading(false);
            return; 
        }

        const formData = {
            token: token,
            senha: password,      
        }

        try{
            const response = await axios.post(`${URL_SERVER}/api/userRegisterStepThree`, formData, {widthCredentials:true})
            setLoading(false)
            setPassword('')
            setIconConfirmPasswordValid(false)
            setConfirmSenha('')
            navigate('/loginUser')
        } catch(err){
            setLoading(false)
            setMessage(err.response?.data?.message || 'Erro ao criar conta');
        }
    }






    return(
        <>
        <HeaderAuth/>
           <div className='mainRegisterStepThree'>
           {loading && (
                  <div className="loading">
                    <div className="loading-spinner"></div>
                    <p>Finalizando Cadastro..</p>
                </div>
              )}
            <form onSubmit={handleSubmit}>
                <div className='boxInputStepThree'>
                    <Lock className='iconUserStepOne' />
                    <input 
                        type={showSenha ? 'text' : 'password'}
                        id='senha' 
                        name='senha'
                        value={password}
                        className={passwordValid === null ? '' : passwordValid ? 'input-success' : 'input-error'}
                        onChange={(e)=> {setPassword(e.target.value), validatePassword(e.target.value)}} 
                        placeholder='Digite sua senha' 
                    />
                    {showSenha ? (
                        < EyeOff className={'iconEyeStepThree'} onClick={()=> setShowSenha(false)}/>
                    ) : (
                        <Eye className={'iconEyeStepThree'} onClick={()=> setShowSenha(true)}/>
                    )}
                     {passwordError && <p className='errorPassword'>{passwordError}</p>}
                     {iconPasswordValid ? <CircleCheck className='iconCheck' /> : iconPasswordInvalid ? <ShieldAlert className='iconInvalid' /> : ''}
                </div>

                <div className='boxInputStepThree'>
                    <Lock className='iconUserStepOne' />
                    <input 
                        type={showConfirmSenha ? "text" : "password"} 
                        id='confirmSenha' 
                        name='confirmSenha'
                        value={confirmSenha}
                        className={confirmPasswordValid === null ? '' : confirmPasswordValid ? 'input-success' : 'input-error'}
                        onChange={(e)=> {setConfirmSenha(e.target.value), validateConfirmPassword(password, e.target.value)}} 
                        placeholder='Digite seu senha novamente!' 
                    />
                    {showConfirmSenha ? (
                        < EyeOff className={'iconEyeStepThree'} onClick={()=> setShowConfirmSenha(false)}/>
                    ) : (
                        <Eye className={'iconEyeStepThree'} onClick={()=> setShowConfirmSenha(true)}/>
                    )}

                    {iconConfirmPasswordValid ? <CircleCheck className='iconCheck' /> : iconConfirmPasswordInvalid ? <ShieldAlert className='iconInvalid' /> : ''}
                    {confirmError && <p className='errorPassword'>{confirmError}</p>}

                </div>

                {message? <p style={{padding:'7px', marginTop:'20px', marginBottom:'0px'}} className='alert alert-danger'>{message}</p> : ''}

                 <button className='btn btn-md btn-dark' type='submit'>Criar Conta</button>
            </form>
            <div className='mainTxtStepThree'>
                <p className='typingTextStepThree'>{typedText}<span className='cursorStepThree'>|</span></p>
            </div>
        </div>
        </>
    )
}