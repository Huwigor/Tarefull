import '../css/UserRegister.css'
import {useState, useEffect} from 'react'
import {Eye, EyeOff, UserRoundPlus, Lock, Mail, UserRoundCheck} from 'lucide-react'
import {useNavigate, Link} from 'react-router-dom'
import axios from 'axios'
import HeaderAuth from '../components/headerAuth.jsx'


export default function UserRegister(){


      const fullText = "Bem-vindo! Cadastre-se para organizar suas tarefas ou acesse sua conta novamente.";
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
        nome: '',
        email: '',
        senha: '',
        confirmSenha: ''
    })

    const [showSenha, setShowSenha] = useState(false)
    const [showConfirmSenha, setShowConfirmSenha] = useState(false)
    
    const [mensagem, setMensagem] = useState('')

    const navigate = useNavigate()

    const handleChange = (e)=>{
        const {name, value} = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (formData.senha !== formData.confirmSenha) {
            const inputConfirm = document.getElementById('comfirmSenha');
            inputConfirm.setCustomValidity("As senhas não coincidem");
            inputConfirm.reportValidity(); 
            return;
          }

        try {
            const response = await axios.post(`${import.meta.env.VITE_ROUTE_SERVER}/api/registerUser`, {
              nome: formData.nome,
              email: formData.email,
              senha: formData.senha
            },
            {withCredentials:true}             
        )
         
            setFormData({ nome: '', email: '', senha: '', confirmSenha: '' });
           setTimeout( () => navigate('/'), 1000) 
          } catch (error) {
            console.error(error)
            const msg = error.response?.data?.mensagem || "Erro ao redistrar, tente novamente!"
            setMensagem(msg)
          }
    }


    return(    
        <>
          <HeaderAuth/>

          <div className={`d-flex mainRegister`}>
    
              <div className={`mainFormRegister`}>
                <form action="" className={`form`} onSubmit={handleSubmit}>
                <UserRoundPlus className='iconUser' />
                    <div className={`boxInput`}>
                        <div className={'boxInputPassword'}>
                            <UserRoundCheck className={`iconMail`}/>
                            <input 
                                type="text"
                                pattern='.{6,}'
                                onInvalid={e => e.target.setCustomValidity("O nome de usuario deve conter no minino 6 caracteres")}
                                onInput={e => e.target.setCustomValidity('')} 
                                name='nome' 
                                id='nome' 
                                placeholder='Digite seu nome'
                                value={formData.nome}
                                onChange={handleChange} 
                            />
                        </div>
                    </div>
                    <div className={`boxInput`}>
                       <div className='boxInputPassword'>
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
                    <div className={`boxInput`}>
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
                    <div className={`boxInput`}>
                    <div className='boxInputPassword'>
                            <Lock className={`iconMail`}/>
                            <input 
                                type={showConfirmSenha ? "text" : "password"} 
                                id="comfirmSenha" 
                                name="confirmSenha"
                                value={formData.confirmSenha} 
                                onChange={handleChange}
                                placeholder="Digite sua senha novamente"
                                onInvalid={(e) => e.target.setCustomValidity("As senhas não coicidem")}
                                onInput={(e) => e.target.setCustomValidity("")} 
                            />
                            {showConfirmSenha ? (
                                < EyeOff className={'iconEye'} onClick={()=> setShowConfirmSenha(false)}/>
                            ) : (
                                <Eye className={'iconEye'} onClick={()=> setShowConfirmSenha(true)}/>
                            )}
                        </div>
                    </div>
                    {mensagem && <p className='alert alert-danger' style={{padding:'7px', marginTop:'20px', marginBottom:'0px', maxWidth: '70%', textAlign: 'center'}}>{mensagem}</p>}
                    <div className={`boxBtn`}>
                      <button>Registrar</button>
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
                    <p className={'typingText'}>{typedText}<span className='cursor'>|</span></p>
                    {showButton && (
                    <Link className={'fadeInBtn'} to="/loginUser">Entrar</Link>
                    )}
                </div>
          </div>
        </>
    )
}