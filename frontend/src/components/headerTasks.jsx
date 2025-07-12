import { useEffect, useState, useRef } from 'react'
import {Link, useNavigate} from 'react-router-dom'
import '../css/makeTask.css'
import axios from 'axios'
import ThemeToggle from './themeToggle.jsx'
import { UserRoundMinus, ChevronDown, House, UserRound, AlignJustify } from 'lucide-react'
import logo from '../assets/icon-logo.png'



export default function HeaderTasks(){

  const navigate = useNavigate()
 

    const [menuAberto, setMenuAberto] = useState(false)
    
        function abrirMenu(e){
            e.stopPropagation()
            setMenuAberto( prev => !prev)
        }
    
        const btnRef = useRef(null)
        const menuRef = useRef(null)

  


  const [menuMobileAberto, setMenuMobileAberto] = useState(false)    

  function abrirMenuMobile(e){
    e.preventDefault()
   setMenuMobileAberto((prev)=>!prev)

  }
        


        const [usuario, setUsuario] = useState(null)
        
        const COOKIE_USER = import.meta.env.VITE_ROUTE_COOKIE_USER
    
        useEffect(()=>{
            async function buscarSessao(){
                try{
                    const cookieUser = await axios.get(`${COOKIE_USER}`, {withCredentials:true})
                    setUsuario(cookieUser.data)
                }catch(err){
                   console.error('usuario não autenticado', err)
                }
            }
            buscarSessao()


            setMenuAberto(false)
            function handleClickFora(event) {    
              if (menuRef.current && btnRef.current && !menuRef.current.contains(event.target) && !btnRef.current.contains(event.target)) {
                setMenuAberto(false);
              }
            }
          
            document.addEventListener('click', handleClickFora);
          
            return () => {
              document.removeEventListener('click', handleClickFora);
            }

        }, [])

    
    
        const USER_SESSION_ROUTES = import.meta.env.VITE_USER_SESSION_ROUTES
    
        function handleLogout() {
            fetch(`${USER_SESSION_ROUTES}logout`, {
              method: "POST",
              credentials: "include",
            })
              .then(() => {
                navigate('/')
              })
              .catch(err => console.error("Erro ao fazer logout:", err));
          }



    return(
        <div className={` d-flex header`}>
                <img src={logo} alt="" />
                <div className='mainBtnMenuHeader mx-auto'>
                   <button className='btnMenuHeader' onClick={abrirMenuMobile}><AlignJustify size={40}/></button>
                   <div className={`menuUser ${menuMobileAberto ? 'menuUserAberto' : ''}`}>
                    <Link className={`linkUser`} style={{marginTop:'10px'}} to='/' > <House style={{height:'20px', marginRight:'5px', marginTop:'3px'}}/> Home</Link>
                    <Link className={`linkUser`} onClick={handleLogout} style={{marginBottom:'10px', marginTop:'10px'}}> <UserRoundMinus style={{height:'20px', marginRight:'5px', marginTop:'3px'}}/> Sair </Link>
                </div>
                </div>
                <nav className={` mx-auto navLinks`}>
                <Link className={`linkNav`} to='/' > <House style={{height:'20px', marginRight:'5px', marginTop:'3px'}}/> Home</Link>
                <div className={`mainUser`}>
                   <button ref={btnRef} id='btnUser' className={`btnUser`} onClick={abrirMenu}> <UserRound style={{height:'20px', marginRight:'5px', marginTop:'3px'}}/> {usuario ? (usuario.user || usuario.nome) : 'visitante'} <ChevronDown className={`chevron-icon ${menuAberto ? 'rotated' : ''}`} /></button>
                   <div ref={menuRef} id='menuUser' className={`menuUser ${menuAberto ? 'menuUserAberto' : ''}`}>
                      <button className={`linkUser`} onClick={handleLogout} style={{marginBottom:'10px'}}> <UserRoundMinus style={{height:'20px', marginRight:'5px', marginTop:'3px'}}/> Sair</button>
                   </div>
                </div>
            </nav>
            <ThemeToggle className='ms-auto'/>
        </div>
    )
}