import '../css/userLogin.css'
import {Eye, EyeOff, Lock, Mail, UserLock} from 'lucide-react'
import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import HeaderAuth from '../components/headerAuth.jsx'


const UserLogin = ()=> {


  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/';


  function iconHome(){
    navigate("/")
  }
  

  const fullText = "Bem-vindo de volta! Acesse sua conta ou cadastre-se para desbloquear sua produtividade.";
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

  
  const [formData, setFormData] = useState({
      email: '',
      senha: '',
  })


  const [msg, setMsg] = useState('')

  const [showSenha, setShowSenha] = useState(false)



  const handleChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    };
    
  const handleSubmit = async (e) => {
    e.preventDefault();


    try {
      const response = await fetch(`${import.meta.env.VITE_ROUTE_SERVER}/loginUser`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: formData.email,
          senha: formData.senha
        })
      });

      const data = await response.json()
      
      if (response.ok) {
        
        setFormData({ email: '', senha: '' });
        navigate(from, { replace: true });
      } else {
        setMsg(data.mensagem)
      }
    } catch (err) {
      console.error("Erro ao enviar:", err);
      alert("Erro na comunicação com o servidor.");
    }
  };

  return(

    <> 
      <HeaderAuth/>

    <div className={`mainRegistro`}>

        <div className='mainForm'>    
            <form action="" onSubmit={handleSubmit}>
                <UserLock className='iconUser' />
                <div className={'boxInput'}>
                  <div className={'boxInputPassword'}>
                    <Mail className={`iconMail`}/>
                    <input 
                        type="email" 
                        id="email" 
                        name="email"
                        value={formData.email} 
                        onChange={handleChange}
                        placeholder="Digite seu email"
                        required
                        onInvalid={e => e.target.setCustomValidity("Digite um email válido!")}
                        onInput={e=> e.target.setCustomValidity('')} 
                    />
                </div>
                  </div>
                <div className={'boxInput'}>
                    <div className={'boxInputPassword'}>
                        <Lock className={`iconMail`}/>
                        <input 
                            type={showSenha ? "text" : "password"} 
                            id="senha" 
                            name="senha"
                            value={formData.senha} 
                            onChange={handleChange}
                            placeholder="Digite sua senha"
                            onInvalid={(e) => e.target.setCustomValidity("A senha deve ter no mínimo 8 caracteres e conter uma letra maiúscula")}
                            onInput={(e) => e.target.setCustomValidity("")} 
                        />
                        {showSenha ? (
                            < EyeOff className={'iconEye'} onClick={()=> setShowSenha(false)}/>
                        ) : (
                            <Eye className={'iconEye'} onClick={()=> setShowSenha(true)}/>
                        )}
                    </div>
                </div>
                <div className={`mainRecuperar`}>
                  <Link to='/forgotPassword' className={` ms-auto linkRecuperar`}>Esqueceu sua senha?</Link>
                </div>
                {msg && <p className='alert alert-danger' style={{padding:'7px', marginTop:'20px', marginBottom:'0px', maxWidth: '70%', textAlign: 'center'}}>{msg}</p>}
                <div className={'boxBtn'}>
                    <button>Entrar</button>
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
        </div>
        <div className={`mainTxt`} >
        <p className='typingText'>{typedText}<span className={"cursor"}>|</span></p>
        {showButton && (
          <Link className={'fadeInBtn'} to="/registerUser">Criar Conta</Link>
        )}
      </div>
    </div>
    </>

  )


}


export default UserLogin