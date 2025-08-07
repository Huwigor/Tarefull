import logo from '../assets/icon-logo.png'
import { Github, Linkedin, Mail, Phone } from 'lucide-react'
import '../css/footer.css'

export default function Footer(){
    const hrefGithub='https://github.com/Huwigor'
    const hrefLinkedin='https://www.linkedin.com/in/huwigor-neterio-483092292/'

    return(
        <footer className="site-footer col-12">
            <div className="footer-container">
                <div className="footer-logo">
                    <img src={logo} alt="Tarefull Logo" />
                    <p className="tagline">Organize. Planeje. Conquiste.</p>
                </div>
                
                <div className="footer-links">
                    <div className="footer-section">
                        <h4>Navegação</h4>
                        <ul>
                            <li><a href="#">Início</a></li>
                            <li><a href="#">Recursos</a></li>
                            <li><a href="#">Planos</a></li>
                            <li><a href="#">Contato</a></li>
                        </ul>
                    </div>
                    
                    <div className="footer-section">
                        <h4>Contato</h4>
                        <ul className="contact-info">
                            <li><Mail size={16} /> <span>tarefullsuporte@gmail.com</span></li>
                            <li><Phone size={16} /> <span>(22) 98137-0167</span></li>
                        </ul>
                    </div>
                    
                    <div className="footer-section">
                        <h4>Redes Sociais</h4>
                        <div className="social-links">
                            <a href={hrefGithub} target="_blank" className="social-link">
                                <Github size={20} />
                            </a>
                            <a href={hrefLinkedin} target="_blank" className="social-link">
                                <Linkedin size={20} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="footer-bottom">
                <p>© {new Date().getFullYear()} Tarefull. Todos os direitos reservados.</p>
                <p>Desenvolvido por Huwigor Neterio</p>
            </div>
        </footer>
    )
}