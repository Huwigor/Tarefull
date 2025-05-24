import { useEffect, useState, useRef } from 'react'
import {Link, useNavigate} from 'react-router-dom'
import '../css/makeTask.css'
import axios from 'axios'
import ThemeToggle from './themeToggle.jsx'
import { UserRoundMinus, ChevronDown, House, UserRound } from 'lucide-react'
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
        


        const [usuario, setUsuario] = useState(null)
    
        useEffect(()=>{
            async function buscarSessao(){
                try{
                    const cookieUser = await axios.get(`${import.meta.env.VITE_ROUTE_SERVER}/api/cookieUser`, {withCredentials:true})
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

    
    
    
        function handleLogout() {
            fetch(`${import.meta.env.VITE_ROUTE_SERVER}/api/logoutUser`, {
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