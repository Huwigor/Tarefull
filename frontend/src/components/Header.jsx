import {Link} from 'react-router-dom'
import {useEffect, useState, useRef} from 'react'
import axios from 'axios'
import '../css/Home.css'
import ThemeToggle from './themeToggle.jsx'
import { useTheme } from './Theme.jsx'
import { ChevronDown, UserRoundMinus, AlignJustify, CopyPlus} from 'lucide-react'
import logo from '../assets/icon-logo.png'



export default function MainHeader(){

    const {theme} = useTheme()
    const btnRef = useRef(null)
    const menuRef = useRef(null)
    const [menuAberto, setMenuAberto] = useState(false)
    const [usuario, setUsuario] = useState(null)

    function abrirMenu(e){
        e.stopPropagation()
        setMenuAberto( prev => !prev)
    }



     const [menuMobileAberto, setMenuMobileAberto] = useState(false)    

    function abrirMenuMobile(e){
        e.preventDefault()
        setMenuMobileAberto((prev)=>!prev)

    }



    const COOKIE_USER = import.meta.env.VITE_ROUTE_COOKIE_USER
    useEffect(() => {

        async function buscarSessao(){
            try{
                const cookieUser = await axios.get(`${COOKIE_USER}`, {withCredentials:true})
                setUsuario(cookieUser.data)
            }catch(err){
                console.error('usuario não autenticado', err)
            }
        }
        
        buscarSessao()
        
        function handleClickFora(event) {    
          if (menuRef.current && btnRef.current && !menuRef.current.contains(event.target) && !btnRef.current.contains(event.target)) {
            setMenuAberto(false);
          }
        }
      
        document.addEventListener('click', handleClickFora);
      
        return () => {
          document.removeEventListener('click', handleClickFora);
        };
      
    }, [location.pathname]);







    function NavLogged() {
        return(
            <>
              <div className='mainBtnMenuHeader mx-auto'>
                <button className='btnMenuHeader' onClick={abrirMenuMobile}><AlignJustify size={40}/></button>
                <div className={`menuUser ${menuMobileAberto ? 'menuUserAberto' : ''}`}>
                    <Link className={`linkUser`} style={{marginTop:'10px', marginLeft:'10px'}} to='/makeTask' > <CopyPlus style={{height:'20px', marginRight:'5px', marginTop:'3px'}}/> Criar Tarefas</Link>
                    <Link className={`linkUser`} onClick={handleLogout} style={{marginBottom:'10px', marginTop:'10px'}}> <UserRoundMinus style={{height:'20px', marginRight:'5px', marginTop:'3px'}}/> Sair </Link>
                </div>
            </div>
            <nav className={` mx-auto ${theme} navLinks `}>
                <Link className='linkNav' to='/makeTask' > Criar Tarefas</Link>
                <div className={`mainUser`}>
                   <button ref={btnRef} id='btnUser' className={`btnUser`} onClick={abrirMenu}> {usuario?.user || usuario.nome} <ChevronDown className={`chevron-icon ${menuAberto ? 'rotated' : ''}`} /></button>
                   <div ref={menuRef} id='menuUser' className={` menuUser ${menuAberto ? 'menuUserAberto' : ''}`}>
                      <button className={`linkUser`} onClick={handleLogout} ><UserRoundMinus style={{height:'20px', marginRight:'5px', marginTop:'3px'}}/> Sair</button>
                   </div>
                </div>
            </nav>
            </>
        )
    }

    
    function NavNotLogged() {
        return(
            <>
              <div className='mainBtnMenuHeader mx-auto'>
                    <button className='btnMenuHeader' onClick={abrirMenuMobile}><AlignJustify size={40}/></button>
                    <div className={`menuUser ${menuMobileAberto ? 'menuUserAberto' : ''}`}>
                       <Link className='linkUser' style={{marginTop:'10px'}} to='/makeTask' > Criar Tarefas</Link>
                       <Link className='linkUser' to='/loginUser' >Entrar</Link>
                       <Link className='linkUser' style={{marginBottom:'10px'}} to='/registerUserStepOne' > Cadastrar</Link>
                    </div>
               </div>
                <nav className={` mx-auto ${theme} navLinks`}>
                    <Link className='linkNav' to='/makeTask' > Criar Tarefas</Link>
                    <Link className='linkNav' to='/loginUser' >Entrar</Link>
                    <Link className='linkNav' to='/registerUserStepOne' > Cadastrar</Link>
                </nav>
            </>
        )
    }



   const SESSION_USER_ROUTES = import.meta.env.VITE_USER_SESSION_ROUTES

    function handleLogout() {
        fetch(`${SESSION_USER_ROUTES}logout`, {
          method: "POST",
          credentials: "include",
        })
          .then(() => {
            setUsuario(null);
            setMenuAberto(false);
          })
          .catch(err => console.error("Erro ao fazer logout:", err));
    }


    return(
        <header className={`d-flex header`}>
            <img src={logo} alt="" />
            {usuario ? (
                    <NavLogged/>
                ) : (
                    <NavNotLogged/>
                )
            }
            <ThemeToggle/>
        </header>
    )
}