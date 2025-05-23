import {Link} from 'react-router-dom'
import {useEffect, useState, useRef} from 'react'
import axios from 'axios'
import '../css/Home.css'
import ThemeToggle from './themeToggle.jsx'
import { useTheme } from './Theme.jsx'
import { ChevronDown, UserRoundMinus, UserRound } from 'lucide-react'



export default function MainHeader(){

    const {theme} = useTheme()

    const [menuAberto, setMenuAberto] = useState(false)
    const [usuario, setUsuario] = useState(null)

    function abrirMenu(e){
        e.stopPropagation()
        setMenuAberto( prev => !prev)
    }

    const btnRef = useRef(null)
    const menuRef = useRef(null)

    
    useEffect(() => {

        function handleClickFora(event) {    
          if (menuRef.current && btnRef.current && !menuRef.current.contains(event.target) && !btnRef.current.contains(event.target)) {
            setMenuAberto(false);
          }
        }
      
        document.addEventListener('click', handleClickFora);
      
        async function buscarSessao(){
            try{
                const cookieUser = await axios.get(`${import.meta.env.VITE_ROUTE_SERVER}/api/cookieUser`, {withCredentials:true})
                  setUsuario(cookieUser.data)
            }catch(err){
             console.error('usuario não autenticado', err)
            }
        }
        
        buscarSessao()

        return () => {
          document.removeEventListener('click', handleClickFora);
        };
      
    }, []);
    


    function NavLogged() {
        return(
            <nav className={` mx-auto ${theme} navLinks `}>
                <Link className='linkNav' to='/makeTask' > Criar Tarefas</Link>
                <div className={`mainUser`}>
                   <button ref={btnRef} id='btnUser' className={`btnUser`} onClick={abrirMenu}> Olá!, {usuario?.user || usuario.nome} <ChevronDown className={`chevron-icon ${menuAberto ? 'rotated' : ''}`} /></button>
                   <div ref={menuRef} id='menuUser' className={` menuUser ${menuAberto ? 'menuUserAberto' : ''}`}>
                      <button className={`linkUser`} onClick={handleLogout} ><UserRoundMinus style={{height:'20px', marginRight:'5px', marginTop:'3px'}}/> Sair</button>
                   </div>
                </div>
            </nav>
        )
    }

    
    function NavNotLogged() {
        return(
            <nav className={` mx-auto ${theme} navLinks`}>
                <Link className='linkNav' to='/makeTask' > Criar Tarefas</Link>
                <Link className='linkNav' to='/loginUser' >Entrar</Link>
                <Link className='linkNav' to='/registerUser' > Cadastrar</Link>
            </nav>
        )
    }





    function handleLogout() {
        fetch(`${import.meta.env.VITE_ROUTE_SERVER}/api/logoutUser`, {
          method: "POST",
          credentials: "include",
        })
          .then(() => {
            setUsuario(null);
            setMenuAberto(false);
            window.location.href = "/";
          })
          .catch(err => console.error("Erro ao fazer logout:", err));
      }


    return(
        <header className={`d-flex header`}>
            <img src="imagens/icon-logo.png" alt="" />
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