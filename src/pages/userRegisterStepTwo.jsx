import {useState, useEffect} from 'react'
import '../css/UserRegisterStepTwo.css'
import HeaderAuth from '../components/headerAuth.jsx'


export default function UserRegisterTwo(){

  const fullText = "Uma mensagem de confirmação de cadastro foi enviado para seu email, clique no link para continuar o cadastro! ";
      const [typedText, setTypedText] = useState('');
      const [index, setIndex] = useState(0);
  
      useEffect(() => {
        if (index < fullText.length) {
          const timeout = setTimeout(() => {
            setTypedText(prev => prev + fullText.charAt(index));
            setIndex(prev => prev + 1);
          }, 15);
          return () => clearTimeout(timeout);
        } 

      }, [index]);

  return(
        <>
        <HeaderAuth/>
        <div className='mainTxtStepTwo'>
          <div className='boxTxt'>
              <p className='typingTextStepTwo'>{typedText}<span className='cursorTwo'>|</span></p>
          </div>
        </div>
        </>
    )
}