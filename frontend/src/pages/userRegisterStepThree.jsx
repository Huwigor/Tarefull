import {useState, useEffect} from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { EyeOff, Eye, Lock, CircleCheck, ShieldAlert } from 'lucide-react';
import '../css/useRegisterStepThree.css'
import HeaderAuth from '../components/headerAuth.jsx'
import { validarSenha } from '../utils/sanitizeDataAuthUser.js'
import { userRegisterStepThree } from '../services/userServices.js';

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
    const {token} = useParams()
    const senha = password

    const handleSubmit = async () => {
        const senhaValidada = validarSenha(senha)
        if(!senhaValidada.isValid){
            setLoading(false)
            setMessage(senhaValidada.error)
            return
        }
        const senhaLimpa = senhaValidada.valor
        setLoading(true)

        try{
            await userRegisterStepThree(token, senhaLimpa)
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
            <div className='mainForm'>
                <div className='boxInputStepThree'>
                    <Lock className='iconUserStepOne' />
                    <input 
                        type={showSenha ? 'text' : 'password'}
                        id='senha' 
                        name='senha'
                        value={password}
                        className={passwordValid === null ? '' : passwordValid ? 'input-success' : 'input-error'}
                        onChange={(e)=> {
                            const valor = e.target.value
                            setPassword(valor) 
                            const result = validarSenha(valor)
                            setPasswordValid(result.isValid)
                            setPasswordError(result.error)
                            setIconPasswordValid(result.isValid)
                            setIconPasswordInvalid(!result.isValid)
                        }} 
                        placeholder='Senha' 
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
                        placeholder='Confirmar Senha!' 
                    />
                    {showConfirmSenha ? (
                        < EyeOff className={'iconEyeStepThree'} onClick={()=> setShowConfirmSenha(false)}/>
                    ) : (
                        <Eye className={'iconEyeStepThree'} onClick={()=> setShowConfirmSenha(true)}/>
                    )}

                    {iconConfirmPasswordValid ? <CircleCheck className='iconCheck' /> : iconConfirmPasswordInvalid ? <ShieldAlert className='iconInvalid' /> : ''}
                    {confirmError && <p className='errorPassword'>{confirmError}</p>}

                </div>

                {message? <p className='alert alert-danger errorValidateRecoveryOne'>{message}</p> : ''}

                 <button onClick={(e)=> {e.preventDefault(); handleSubmit();}} className='btn btn-md btn-dark btnEntrar' type='submit'>Criar Conta</button>
            </div>
            <div className='mainTxtStepThree'>
                <p className='typingTextStepThree'>{typedText}<span className='cursorStepThree'>|</span></p>
            </div>
        </div>
        </>
    )
}