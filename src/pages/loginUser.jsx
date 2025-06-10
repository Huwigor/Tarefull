import '../css/userLogin.css'
import { TriangleAlert, CircleCheck, ShieldAlert, Mail, Eye, Lock } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import HeaderAuth from '../components/headerAuth.jsx'
import axios from 'axios'




const UserLogin = ()=> {


  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/';
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)




  
  const [email, setEmail] = useState('')
  const [iconEmailValid, setIconEmailValid] = useState(false)
  const [iconEmailInvalid, setIconEmailInvalid] = useState(false)
  const [emailValid, setEmailValid] = useState(null)
  const [emailError, setEmailError] = useState('')
  

  const validarEmail = (email) => {
    const trimmedEmail = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    if (trimmedEmail.length === 0) {
      setEmailValid(false)
      setIconEmailValid(false)
      setIconEmailInvalid(true)
      setEmailError('O email é obrigatório!')
      return 
    }
    if (trimmedEmail.length > 254) {
      setEmailValid(false)
      setIconEmailValid(false)
      setIconEmailInvalid(true)
      setEmailError('O email deve ter no máximo 254 caracteres!')
      return 
    }
    if (!emailRegex.test(trimmedEmail)) {
      setEmailValid(false)
      setIconEmailValid(false)
      setIconEmailInvalid(true)
      setEmailError('Formato de email inválido!')
      return 
    }
    
    setEmailValid(true)
    setIconEmailInvalid(false)
    setIconEmailValid(true)
    setEmailError('')
    return 
  }
  
  
  
  
  
  
  const [senha, setSenha] = useState('')
  const [passwordValid, setPasswordValid] = useState(null)
  const [iconPasswordValid, setIconPasswordValid] = useState(false);
  const [passwordError, setPasswordError] = useState('')
  const [iconPasswordInvalid, setIconPasswordInvalid] = useState(false)
  const [showSenha, setShowSenha] = useState(false);

  const validarSenha = (senha) => {
    const hasUpperCase = /[A-Z]/.test(senha);
    const hasSymbol = /[^A-Za-z0-9]/.test(senha);
    const hasLength = senha.length >= 8 && senha.length <= 50;
  
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
  };
  





  
  const fullText = "Bem-vindo de volta! Acesse sua conta ou cadastre-se para desbloquear sua produtividade.";
  const [typedText, setTypedText] = useState('');
  const [index, setIndex] = useState(0);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    if (index < fullText.length) {
      const timeout = setTimeout(() => {
        setTypedText(prev => prev + fullText.charAt(index));
        setIndex(prev => prev + 1);
      }, 1);
      return () => clearTimeout(timeout);
    } else {
      setShowButton(true);
    }
  }, [index]);

  





  const USER_LOGIN_ROUTE = import.meta.env.VITE_ROUTE_USER_LOGIN

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const isEmailValid = emailValid
    const isPasswordValid = passwordValid

    if (!isEmailValid || !isPasswordValid) {
      setLoading(false)
      return
    }
  
    try {
      const response = await axios.post(`${USER_LOGIN_ROUTE}`, { email, senha }, { withCredentials:true })
      
      setTimeout(()=>{
        setEmail('')
        setSenha('')
        setEmailValid(null)
        setPasswordValid(null)
        setLoading(false)
        navigate(from, { replace: true });
      }, 500)
    } catch (err) {
      setTimeout(()=>{
        setEmailValid(null)
        setPasswordValid(null)
        setIconEmailValid(false)
        setIconPasswordValid(false)
        setLoading(false)
        setMsg(err.response.data.mensagem)
      }, 500)
    }
  };







  return(

    <> 
      <HeaderAuth/>
      <div className={`mainRegistro`}>
        {loading && (
              <div className="loadingLogin">
                <div className="loading-spinner"></div>
                <p>Verificando credenciais!</p>
            </div>
          )}
          <form action="" onSubmit={handleSubmit}>

              <div className={'boxInput'}>
                <Mail className={`iconMail`} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  placeholder="Seu email"
                  className={emailValid === null ? '' : emailValid ? 'input-success' : 'input-error'}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    validarEmail(e.target.value);
                  }}
                />
                {emailError && <p className='errorInput'>{emailError}</p>}
                {iconEmailValid ? <CircleCheck className='iconCheck' /> : iconEmailInvalid ? <ShieldAlert className='iconInvalid' /> : ''}
              </div>

                <div className={'boxInput'}>
                  <Lock className={`iconMail`} />
                  <input
                    type={showSenha ? "text" : "password"}
                    id="senha"
                    name="senha"
                    value={senha}
                    placeholder="Sua senha"
                    onChange={(e) => {
                      setSenha(e.target.value);
                      validarSenha(e.target.value);
                    }}
                      className={passwordValid === null ? '' : passwordValid ? 'input-success' : 'input-error'}
                    />
                    {showSenha ? (
                      <EyeOff className={'iconEye'} onClick={() => setShowSenha(false)} />
                    ) : (
                      <Eye className={'iconEye'} onClick={() => setShowSenha(true)} />
                    )}
                    {passwordError && <p className='errorInput'>{passwordError}</p>}
                    {iconPasswordValid ? <CircleCheck className='iconCheck' /> : iconPasswordInvalid ? <ShieldAlert className='iconInvalid' /> : ''}
                </div>

              <div className={`mainRecuperar`}>
                <Link to='/forgotPassword' className={` ms-auto linkRecuperar`}>Esqueceu sua senha?</Link>
              </div>

              {msg && <p className='errorMsg' ><TriangleAlert className='iconAlert'/> {msg}</p>}
              
              <div className={'boxBtn'}>
                  <button className='btn btn-md btn-dark'>Entrar</button>
              </div>

              <div className={` d-flex mainRow`} styles={{width:'100%'}}>
                <div className={`row`}></div>
                <p>Ou</p>
                <div className={`row`}></div>
              </div>

              <div className={` mainGoogle`}>
                <button type='button' className={'btnGoogle'} onClick={() => window.location.href = `${import.meta.env.VITE_ROUTE_SERVER}/auth/google`}>
                  <img className={'iconGoogle'} src="imagens/icon-google.png" alt="" /><span className='spanTxtGoogle'>Continue com o Google</span>
                </button>
              </div>   
          </form>
          <div className={`mainTxt`} >
            <p className='typingText'>{typedText}<span className={"cursor"}>|</span></p>
            {showButton && (
              <Link className={'fadeInBtn'} to="/registerUserStepOne">Criar Conta</Link>
            )}
        </div>
      </div>
    </>

  )


}


export default UserLogin