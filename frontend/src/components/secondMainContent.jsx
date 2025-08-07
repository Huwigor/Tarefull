import { Users, CheckCircle, Target } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import '../css/secondMainContent.css'

export default function SecondMain(){
    const parallaxRef = useRef(null);
    const imageRef = useRef(null);
    const [scrollPosition, setScrollPosition] = useState(0);
    
    useEffect(() => {
        const handleScroll = () => {
            if (parallaxRef.current && imageRef.current) {
                const element = parallaxRef.current;
                const rect = element.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                
                if (rect.top < windowHeight && rect.bottom > 0) {
                    const visiblePercentage = 1 - (Math.max(0, rect.top) / windowHeight);
    
                    const clampedPosition = Math.max(0, Math.min(1, visiblePercentage * 1.5));
                    
                    setScrollPosition(clampedPosition);
                }
            }
        };
        
        window.addEventListener('scroll', handleScroll);
        handleScroll();
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    
    return(
        <section className='features-section'>
            <div className='section-header' data-aos='fade-in'>
                <h2 className='section-title'>Como podemos ajudar você</h2>
                <p className='section-subtitle'>Ferramentas poderosas para organizar seu trabalho</p>
            </div>
            
            <div className='features-container'>
                <div className='feature-card' data-aos='fade-up'>
                    <Users className='feature-icon' />
                    <h3 className='feature-title'>Trabalho em equipe</h3>
                    <p className='feature-description'>Organize-se em grupos e colabore de forma eficiente com sua equipe</p>
                </div>
                
                <div className='feature-card' data-aos='fade-up' data-aos-delay='100'>
                    <Target className='feature-icon' />
                    <h3 className='feature-title'>Metas claras</h3>
                    <p className='feature-description'>Transforme grandes metas em tarefas gerenciáveis e alcançáveis</p>
                </div>
                
                <div className='feature-card' data-aos='fade-up' data-aos-delay='200'>
                    <CheckCircle className='feature-icon' />
                    <h3 className='feature-title'>Acompanhamento</h3>
                    <p className='feature-description'>Acompanhe o progresso e celebre cada conquista no caminho</p>
                </div>
            </div>
            
        </section>
    )
}