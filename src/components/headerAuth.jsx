import ThemeToggle from './themeToggle.jsx'
import { Link } from 'react-router-dom'


export default function HeaderAuth(){
    return(
        <header className='headerAuth'>
            <Link to='/'><img className='iconHeader' src="imagens/icon-logo.png" alt="" /></Link>
             <ThemeToggle className='ms-auto'/>
        </header>
    )
}