import {useState, useEffect} from 'react'
import { useNavigate, Link } from 'react-router-dom';
import '../css/userRegisterStepOne.css'
import HeaderAuth from '../components/headerAuth.jsx'
import { UserLock, Lock, CircleCheck, ShieldAlert } from 'lucide-react';
import { validarNome, validarEmail } from '../utils/sanitizeDataAuthUser.js';
import { userRegisterStepOne } from '../services/userServices.js';

export default function UserRegisterStepOne(){
  
  const [nome, setNome] = useState('')
  const [iconNomeValid, setIconNomeValid] = useState(false)
  const [iconNomeInvalid, setIconNomeInvalid] = useState(false)
  const [nomeError, setNomeError] = useState('');
  const [nomeValid, setNomeValid] = useState(null);

  
  const [email, setEmail] = useState('')
  const [iconEmailValid, setIconEmailValid] = useState(false)
  const [iconEmailInvalid, setIconEmailInvalid] = useState(false)
  const [emailError, setEmailError] = useState('');
  const [emailValid, setEmailValid] = useState(null);




const fullText = "Já possui uma conta? Faça o login e comece a organizar suas tarefas!";
    const [typedText, setTypedText] = useState('');
    const [index, setIndex] = useState(0);

    useEffect(() => {
      if (index < fullText.length) {
        const timeout = setTimeout(() => {
          setTypedText(prev => prev + fullText.charAt(index));
          setIndex(prev => prev + 1);
        }, 15);
        return () => clearTimeout(timeout);
      } else {
        setShowButton(true);
      }

    }, [index]);
    
    const [showButton, setShowButton] = useState(false);


  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)

  const USER_AUTH_GOOGLE = import.meta.env.VITE_USER_AUTH_GOOGLE
  const navigate = useNavigate()

  const handleSubmit = async (e)=>{
    e.preventDefault()
    const nomeValidado = validarNome(nome)
    if(!nomeValidado.isValid){
      setLoading(false)
      setResponse(nomeValidado.error)
      return
    }
    const nomeLimpo = nomeValidado.valor

    const emailValidado = validarEmail(email)
    if(!emailValidado.isValid){
      setLoading(false)
      setResponse(emailValidado.error)
      return
    }
    const emailLimpo = emailValidado.valor
    setLoading(true)

    try{
        await userRegisterStepOne(nomeLimpo, emailLimpo)  
        setIconNomeValid(false)
        setIconEmailValid(false)
        setNomeValid(null)
        setEmailValid(null)
        setLoading(false);
        navigate('/registerUserStepTwo');
    }catch(err){
      setTimeout(()=>{
        setLoading(false)
        if (err.response) {
          setResponse(err.response.data.message)
        } else {
          setResponse('Erro ao conectar com o servidor!')
        }
      }, 500)
    }
  }

  return(
      <>

      <HeaderAuth/>

      <div className='mainRegisterStepOne'>
              {loading && (
                  <div className="loading">
                    <div className="loading-spinner"></div>
                    <p>Enviando email de confirmação..</p>
                </div>
              )}
          <form onSubmit={handleSubmit}>
            <div className='boxInputStepOne'>
              <UserLock className='iconUserStepOne' />
                <input 
                    type="text" 
                    id='nome' 
                    name='nome'
                    value={nome}
                    onChange={(e)=> { 
                      const valor = e.target.value
                      setNome(valor) 
                      const result = validarNome(valor)
                      setNomeValid(result.isValid)
                      setNomeError(result.error);
                      setIconNomeValid(result.isValid)
                      setIconNomeInvalid(!result.isValid)
                    }} 
                    placeholder='Seu Nome' 
                    className={nomeValid === null ? '' : nomeValid ? 'input-success' : 'input-error'}
                />
                {nomeValid !== null && (
                  <p className={nomeValid ? 'msg-success' : 'msg-error'}>
                    {nomeError}
                  </p>
                )}
                {iconNomeValid ? <CircleCheck className='iconCheck' /> : iconNomeInvalid ? <ShieldAlert className='iconInvalid' /> : ''}
            </div>

            <div className='boxInputStepOne'>
              <Lock className='iconUserStepOne' /> 
              <input
                  type="text" 
                  id='email' 
                  name='email'
                  value={email}
                  onChange={(e)=> {
                    const valor = e.target.value
                    setEmail(valor)
                    const result = validarEmail(valor)
                    setEmailValid(result.isValid)
                    setEmailError(result.error)
                    setIconEmailValid(result.isValid)
                    setIconEmailInvalid(!result.isValid)
                    }} 
                  placeholder='Seu Email' 
                  className={emailValid === null ? '' : emailValid ? 'input-success' : 'input-error'}
              />
              {emailValid !== null && (
                  <p className={emailValid ? 'msg-success' : 'msg-error'}>
                    {emailError}
                  </p>
                )}
                {iconEmailValid ? <CircleCheck className='iconCheck' /> : iconEmailInvalid ? <ShieldAlert className='iconInvalid' /> : ''}

            </div>

              {response ? <p  className='alert alert-danger errorValidateRecoveryOne'>{response}</p> : ''}

              <button className='btn btn-md btn-dark btnEntrar' type='submit'>Cadastrar</button>

              <div className={` d-flex mainRowStepOne`} styles={{width:'100%'}}>
                  <div className={`rowStepOne`}></div>
                  <p>Ou</p>
                  <div className={`rowStepOne`}></div>
              </div>

              <div className={` mainGoogleStepOne`}>
                  <button type='button' className={'btnGoogleStepOne'} onClick={() => window.location.href = USER_AUTH_GOOGLE}>
                      <img className={'iconGoogleStepOne'} src="imagens/icon-google.png" alt="" /><span className='spanTxtGoogleStepOne'>Cadastre-se com o Google</span>
                  </button>
              </div>
          </form>
          <div className='mainTxtStepOne'>
              <p className='typingTextStepOne'>{typedText}<span className='cursorStepOne'>|</span></p>
              {showButton && (
                <Link className={'fadeInBtnStepOne'} to="/loginUser">Entrar</Link>
              )}
          </div>
      </div>
          
      </>
  )
}