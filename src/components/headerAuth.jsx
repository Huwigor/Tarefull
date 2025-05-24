import ThemeToggle from './themeToggle.jsx'
import { Link } from 'react-router-dom'
import logo from '../assets/icon-logo.png'


export default function HeaderAuth(){
    return(
        <header className='headerAuth'>
            <Link to='/'><img className='iconHeader' src={logo} alt="" /></Link>
             <ThemeToggle className='ms-auto'/>
        </header>
    )
}