import {useState, useEffect} from 'react'
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios'
import '../css/userRegisterStepOne.css'
import HeaderAuth from '../components/headerAuth.jsx'
import { UserLock, Lock, CircleCheck, ShieldAlert } from 'lucide-react';

export default function UserRegisterStepOne(){


  
  
  const [nome, setNome] = useState('')
  const [iconNomeValid, setIconNomeValid] = useState(false)
  const [iconNomeInvalid, setIconNomeInvalid] = useState(false)
  const [nomeError, setNomeError] = useState('');
  const [nomeValid, setNomeValid] = useState(null);

  const validateNome = (value) => {
    const trimmed = value.trim();
    if (trimmed.length === 0) {
        setIconNomeValid(false)
        setIconNomeInvalid(true)
        setNomeError('O nome é obrigatório.');
        setNomeValid(false);
    } else if (trimmed.length < 8) {
        setIconNomeValid(false)
        setIconNomeInvalid(true)
        setNomeError('O nome deve ter no mínimo 8 caracteres.');
        setNomeValid(false);
    } else if (trimmed.length > 30) {
        setIconNomeValid(false)
        setIconNomeInvalid(true)
        setNomeError('O nome deve ter no máximo 30 caracteres.');
        setNomeValid(false);
    } else {
        setIconNomeInvalid(false)
        setIconNomeValid(true)
        setNomeError('');
        setNomeValid(true);
    }
  }; 


 
  
  const [email, setEmail] = useState('')
  const [iconEmailValid, setIconEmailValid] = useState(false)
  const [iconEmailInvalid, setIconEmailInvalid] = useState(false)
  const [emailError, setEmailError] = useState('');
  const [emailValid, setEmailValid] = useState(null);

  const validateEmail = (value) => {
    const trimmedEmail = value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (trimmedEmail.length === 0) {
        setIconEmailValid(false)
        setIconEmailInvalid(true)
        setEmailError('O email é obrigatório!');
        setEmailValid(false);
    } else if(trimmedEmail.length > 254) {
        setIconEmailValid(false)
        setIconEmailInvalid(true)
         setEmailError('O email deve ter no máximo 254 caracteres!')
         setEmailValid(false)
    } else if (!emailRegex.test(trimmedEmail)) {
        setIconEmailValid(false)
        setIconEmailInvalid(true)
        setEmailError('Formato de email inválido!');
        setEmailValid(false);
    } else {
        setIconEmailInvalid(false)
        setIconEmailValid(true)
        setEmailError('');
        setEmailValid(true);
    }
  };





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
  const [loading, setLoading] = useState(false);

  const URL_SERVER = import.meta.env.VITE_ROUTE_SERVER
  const navigate = useNavigate()

  const handleSubmit = async (e)=>{
    e.preventDefault()
    setLoading(true);

    validateNome(nome)
    validateEmail(email)

    const isNomeValid = nomeValid
    const isEmailValid = emailValid

    if(!isNomeValid && !isEmailValid){
      setLoading(false);
      return
    }

    try{
      const response = await axios.put(`${URL_SERVER}/api/userRegisterStepOne`, {nome, email}, { withCredentials: true })
      setTimeout(() => {
        setIconNomeValid(false)
        setIconEmailValid(false)
        nomeValid(null)
        emailValid(null)
        setLoading(false);
        navigate('/registerUserStepTwo');
    }, 500)
    }catch(err){
      setTimeout(()=>{
        setLoading(false);
        if (err.response) {
          setResponse(err.response.data.message);
        } else {
          setResponse('Erro ao conectar com o servidor!');
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
                    onChange={(e)=> { setNome(e.target.value), validateNome(e.target.value) }} 
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
                  onChange={(e)=> {setEmail(e.target.value), validateEmail(e.target.value)}} 
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

              {response ? <p style={{padding:'7px', marginTop:'28px', marginBottom:'0px'}} className='alert alert-danger'>{response}</p> : ''}

              <button className='btn btn-md btn-dark' type='submit'>Cadastrar</button>

              <div className={` d-flex mainRowStepOne`} styles={{width:'100%'}}>
                  <div className={`rowStepOne`}></div>
                  <p>Ou</p>
                  <div className={`rowStepOne`}></div>
              </div>

              <div className={` mainGoogleStepOne`}>
                  <button type='button' className={'btnGoogleStepOne'} onClick={() => window.location.href = `${import.meta.env.VITE_ROUTE_SERVER}/auth/google`}>
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