import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import HeaderAuth from '../components/headerAuth.jsx';
import { CircleCheck, ShieldAlert, Lock, Eye, EyeOff } from 'lucide-react';
import '../css/recoveryPasswordStepThree.css'

export default function ResetPassword() {
    const { token } = useParams();
    const [loading, setLoading] = useState(false)
    const [showSenha, setShowSenha] = useState(false)
    const navigate = useNavigate()
    const RESET_USER_PASSWORD = import.meta.env.VITE_ROUTE_FRONT_RESETPASSWORD


    
    
    const [password, setPassword] = useState('')
    const [passwordValid, setPasswordValid] = useState(null)
    const [passwordError, setPasswordError] = useState('')
    const [iconPasswordValid, setIconPasswordValid] = useState(false)
    const [iconPasswordInvalid, setIconPasswordInvalid] = useState(false)

    const validarSenha = (password) => {
      const hasUpperCase = /[A-Z]/.test(password);
      const hasSymbol = /[^A-Za-z0-9]/.test(password);
      const hasLength = password.length >= 8 && password.length <= 50;
    
      if (!hasLength) {
        setPasswordValid(false)
        setIconPasswordValid(false)
        setIconPasswordInvalid(true) 
        setPasswordError('A senha deve ter entre 8 a 50 caracteres! ')
        return 
      }
      if (!hasUpperCase) {
        setPasswordValid(false)
        setIconPasswordValid(false)
        setIconPasswordInvalid(true)
        setPasswordError('A senha deve ter pelo menos uma letra maiúscula! ')
        return 
      }
      if (!hasSymbol) {
        setPasswordValid(false)
        setIconPasswordValid(false)
        setIconPasswordInvalid(true)
        setPasswordError('A senha deve ter ao menos um símbolo! ')
        return 
      }

      setPasswordValid(true)
      setIconPasswordInvalid(false)
      setIconPasswordValid(true)
      setPasswordError('')
      return

    }





    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)

        const isPasswordValid = passwordValid

        if(!isPasswordValid){
          setLoading(false)
          return
        }

        try {
            const response = await axios.post(`${RESET_USER_PASSWORD}/${token}`, { password });
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
              setPasswordError(err.response.data.message);
            }, 500)
        }
    };

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
                              onChange={(e) => {setPassword(e.target.value), validarSenha(password)}}
                          />
                           {showSenha ? (
                                < EyeOff className={'iconEyeStepThree'} onClick={()=> setShowSenha(false)}/>
                            ) : (
                                <Eye className={'iconEyeStepThree'} onClick={()=> setShowSenha(true)}/>
                            )}
                          {passwordError && <p className='errorInputReset'>{passwordError}</p>}
                          {iconPasswordValid ? <CircleCheck className='iconCheck' /> : iconPasswordInvalid ? <ShieldAlert className='iconInvalid' /> : ''}
                      </div>
                       
                        <button className='mx-auto' type="submit">Redefinir</button>
                    </form>
                </div>
            </div>
        </>
    );
}
