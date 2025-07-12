import '../css/userLogin.css'
import { TriangleAlert, CircleCheck, ShieldAlert, Mail, Eye, EyeOff, Lock } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import HeaderAuth from '../components/headerAuth.jsx'
import { loginUser } from '../services/userServices.js'
import { validarEmail, validarSenha } from '../utils/sanitizeDataAuthUser.js'
import iconGoogle from '../assets/iconGoogle.png'



const UserLogin = ()=> {

  const navigate = useNavigate()
  const [searchParams] = useSearchParams();
  const from = searchParams.get("from") || "/";
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  
  const [email, setEmail] = useState('')
  const [iconEmailValid, setIconEmailValid] = useState(false)
  const [iconEmailInvalid, setIconEmailInvalid] = useState(false)
  const [emailValid, setEmailValid] = useState(null)
  const [emailError, setEmailError] = useState('')
  
  
  const [senha, setSenha] = useState('')
  const [passwordValid, setPasswordValid] = useState(null)
  const [iconPasswordValid, setIconPasswordValid] = useState(false);
  const [passwordError, setPasswordError] = useState('')
  const [iconPasswordInvalid, setIconPasswordInvalid] = useState(false)
  const [showSenha, setShowSenha] = useState(false);

  
  
  const fullText = "Bem-vindo de volta! Acesse sua conta ou cadastre-se para desbloquear sua produtividade.";
  const [typedText, setTypedText] = useState('');
  const [index, setIndex] = useState(0);
  const [showButton, setShowButton] = useState(false);

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

  
  

  const handleSubmit = async (e) => {
    e.preventDefault()
    const emailValidado = validarEmail(email)
    if(!emailValidado.isValid){
      setMsg(emailValidado.error)
      return
    }
    const emailLimpo = emailValidado.valor

    const senhaValidada = validarSenha(senha)
    if(!senhaValidada.isValid){
      setMsg(senhaValidada.error)
      return
    }
    const senhaLimpa = senhaValidada.valor
      
    setLoading(true)
  
    try {

      const res = await loginUser({email:emailLimpo, senha:senhaLimpa})
      
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
          <form  action="" onSubmit={handleSubmit}>

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
                    const valor = e.target.value
                    setEmail(valor);
                    const resultado = validarEmail(valor)
                    setEmailValid(resultado.isValid);
                    setEmailError(resultado.error);
                    setIconEmailValid(resultado.isValid);
                    setIconEmailInvalid(!resultado.isValid);
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
                      const valor = e.target.value
                      setSenha(valor)
                      const resultado = validarSenha(valor)
                      setPasswordValid(resultado.isValid);
                      setPasswordError(resultado.error);
                      setIconPasswordValid(resultado.isValid);
                      setIconPasswordInvalid(!resultado.isValid);
                      
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
                <div className={`row`}></div>
              </div>

              <div className={` mainGoogle`}>
                <button type='button' className={'btnGoogle'} onClick={() => window.location.href = `${import.meta.env.VITE_USER_AUTH_GOOGLE}`}>
                  <img className={'iconGoogle'} src={iconGoogle} alt="" /> <span className='spanTxtGoogle'>Continue com o Google</span>
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