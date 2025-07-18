import logo from '../assets/icon-logo.png'
import { Github, Linkedin } from 'lucide-react'

export default function Footer(){

    const hrefGithub='https://github.com/Huwigor'
    const hrefLinkedin='https://www.linkedin.com/in/huwigor-neterio-483092292/'

    return(
        <div 
            className='footer'
            style={{
                marginTop:'200px', 
                borderRadius:'10px'
            }}
            
        >
            <div 
                style={{
                    width:'100%', 
                    display:'flex', 
                    alignItems:'center', 
                    justifyContent:'center',
                    marginBottom:'20px'
                }}
            >
                <img src={logo} style={{height: '70px'}} alt="" />
            </div>
            <div className='d-flex'>
                <p 
                  style={{
                    fontSize:'10px',
                    marginLeft:'5px'
                  }}>
                  Desenvolvido por Huwigor Neterio
                </p>
                <div 
                    style={{
                        position:'relative', 
                        bottom:'10px',
                        marginLeft:'5px'
                    }}
                >
                    <a 
                        href={hrefGithub}
                        target='_blank'
                        style={{
                            backgroundColor:'transparent', 
                            border:'none', 
                            color:'white',
                            marginLeft:'5px'
                        }}
                    >
                        <Github size={20}/>
                    </a>
                    <a 
                       href={hrefLinkedin}
                       target='_blank'
                       style={{
                            backgroundColor:'transparent', 
                            border:'none', 
                            color:'white',
                            marginLeft:'10px'
                        }}
                    >
                        <Linkedin size={20}/>
                    </a>
                </div>
            </div>
        </div>
    )
}