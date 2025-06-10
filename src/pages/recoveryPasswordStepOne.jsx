import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import '../css/recoveryPasswordStepOne.css'
import HeaderAuth from '../components/headerAuth.jsx'
import { CircleCheck, ShieldAlert, Mail } from 'lucide-react'

export default function RecoveryPasswordOne() {
     
    
    
    const [email, setEmail] = useState('')
    const [iconEmailValid, setIconEmailValid] = useState(false)
    const [iconEmailInvalid, setIconEmailInvalid] = useState(false)
    const [emailValid, setEmailValid] = useState(null)
    const [emailError, setEmailError] = useState('')


    const validarEmail = (email) => {
        const trimmedEmail = email.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
        if (trimmedEmail.length === 0) {
          setEmailValid(false)
          setIconEmailValid(false)
          setIconEmailInvalid(true)
          setEmailError('O email é obrigatório!')
          return 
        }
        if (trimmedEmail.length > 254) {
          setEmailValid(false)
          setIconEmailValid(false)
          setIconEmailInvalid(true)
          setEmailError('O email deve ter no máximo 254 caracteres!')
          return 
        }
        if (!emailRegex.test(trimmedEmail)) {
          setEmailValid(false)
          setIconEmailValid(false)
          setIconEmailInvalid(true)
          setEmailError('Formato de email inválido!')
          return 
        }
        
        setEmailValid(true)
        setIconEmailInvalid(false)
        setIconEmailValid(true)
        setEmailError('')
        return 
      }
      




    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const [erroValidate, setErroValidate] = useState('')
    const FORGOT_USER_PASSWORD = import.meta.env.VITE_ROUTE_FRONT_FORGOTPASSWORD

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        const isEmailValid = emailValid

        if(!isEmailValid){
          setLoading(false)
          return
        }

        try {
            const response = await axios.post(`${FORGOT_USER_PASSWORD}`, { email })
            setTimeout(()=>{
              setEmailValid(null)
              setIconEmailValid(false)
              setEmailError('')
              setEmail('')
              setLoading(false)
              navigate('/recoveryPasswordTwo')
            }, 500)
        } catch (error) {
            setTimeout(()=>{
                setLoading(false)
                setErroValidate(error.response.data.message)
            }, 500)
        }
    };

      const fullText = "Use o email de cadastro da sua conta!"
      const [typedText, setTypedText] = useState('')
      const [index, setIndex] = useState(0)

      useEffect(() => {
          if (index < fullText.length) {
            const timeout = setTimeout(() => {
              setTypedText(prev => prev + fullText.charAt(index))
              setIndex(prev => prev + 1);
            }, 15);
            return () => clearTimeout(timeout)
          } 
        }, [index])

    return (
        <>
            <HeaderAuth/>
            <div className='mainForgot'>
            {loading && (
                  <div className="loading">
                    <div className="loading-spinner"></div>
                    <p>Enviando email de recuperação..</p>
                </div>
              )}
                <div className='boxForgot'>
                    <h2>{typedText} <span className='cursor'>|</span></h2>
                    <form onSubmit={handleSubmit}>
                        <div className='boxInputsForgot'>
                            <Mail className={`iconMailForgot`} />
                            <input
                                id='email'
                                name='email'
                                type="email"
                                placeholder="Digite seu email"
                                value={email}
                                className={emailValid === null ? '' : emailValid ? 'input-success' : 'input-error'}
                                onChange={(e) => {setEmail(e.target.value), validarEmail(e.target.value)}}
                            />
                            {emailError && <p className='errorInputForgot'>{emailError}</p>}
                            {iconEmailValid ? <CircleCheck className='iconCheck' /> : iconEmailInvalid ? <ShieldAlert className='iconInvalid' /> : ''}
                        </div>
                        {erroValidate ? <p className=' mx-auto errorValidateRecoveryOne' >{erroValidate}</p> : ''} 
                        <button className='mx-auto' type="submit">Enviar</button>
                    </form>
                </div>
            </div>
        </>
    )
}
