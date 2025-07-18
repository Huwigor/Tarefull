import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import HeaderAuth from '../components/headerAuth.jsx';
import { CircleCheck, ShieldAlert, Lock, Eye, EyeOff } from 'lucide-react';
import '../css/recoveryPasswordStepThree.css'
import { userRecoveryStepThree } from '../services/userServices.js';
import { validarSenha } from '../utils/sanitizeDataAuthUser.js';

export default function ResetPassword() {

    const [loading, setLoading] = useState(false)
    const [showSenha, setShowSenha] = useState(false)
    const navigate = useNavigate()
    const [password, setPassword] = useState('')
    const [passwordValid, setPasswordValid] = useState(null)
    const [passwordError, setPasswordError] = useState('')
    const [msg, setMsg] = useState('')
    const [iconPasswordValid, setIconPasswordValid] = useState(false)
    const [iconPasswordInvalid, setIconPasswordInvalid] = useState(false)
    const {token} = useParams()


    const handleSubmit = async (e) => {
        e.preventDefault();
        const senhaValidada = validarSenha(password)
        if(!senhaValidada.isValid){
          setLoading(false)
          setMsg(senhaValidada.error)
          return
        }
        const senhaLimpa = senhaValidada.valor
        setLoading(true)

        try {
            await userRecoveryStepThree(token, senhaLimpa)
            setTimeout(()=>{
              setPasswordValid(false)
              setIconPasswordValid(false)
              setPassword('')
              setPasswordError('')
              setLoading(false)
              navigate('/loginUser')
            }, 500)
        } catch (err) {
            setTimeout(()=>{
              setLoading(false)
              setMsg(err.response.data.message);
            }, 500)
        }
    }


    const fullText = "Escolha uma nova senha!";
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

    return (
        <>
           <HeaderAuth/>
            <div className='mainReset'>
            {loading && (
                  <div className="loading">
                    <div className="loading-spinner"></div>
                    <p>Alterando Senha..</p>
                </div>
              )}
                <div className='boxReset'>
                    <h2>{typedText} <span className='cursor'>|</span></h2>
                    <form onSubmit={handleSubmit}>
                      <div className='boxInputReset'>
                        <Lock className='iconUserStepOne'/>
                          <input
                              type={showSenha ? 'text' : 'password'}
                              name='password'
                              id='password'
                              placeholder="Nova senha"
                              value={password}
                              className={passwordValid === null ? '' : passwordValid ? 'input-success' : 'input-error'}
                              onChange={(e) => {
                                const valor = e.target.value
                                setPassword(valor)
                                const resultado = validarSenha(valor)
                                setPasswordValid(resultado.isValid);
                                setPasswordError(resultado.error);
                                setIconPasswordValid(resultado.isValid);
                                setIconPasswordInvalid(!resultado.isValid);
                              }}
                          />
                           {showSenha ? (
                                < EyeOff className={'iconEyeStepThree'} onClick={()=> setShowSenha(false)}/>
                            ) : (
                                <Eye className={'iconEyeStepThree'} onClick={()=> setShowSenha(true)}/>
                            )}
                          {passwordError && <p className='errorInputReset'>{passwordError}</p>}
                          {iconPasswordValid ? <CircleCheck className='iconCheck' /> : iconPasswordInvalid ? <ShieldAlert className='iconInvalid' /> : ''}
                      </div>
                        {msg ? <p className=' mx-auto errorValidateRecoveryThree'>{msg}</p> : ''}
                        <button className='mx-auto btnEntrar' type="submit">Redefinir</button>
                    </form>
                </div>
            </div>
        </>
    );
}
