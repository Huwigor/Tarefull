import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../css/recoveryPasswordStepOne.css'
import HeaderAuth from '../components/headerAuth.jsx'
import { CircleCheck, ShieldAlert, Mail } from 'lucide-react'
import { validarEmail } from '../utils/sanitizeDataAuthUser.js'
import { userRecoveryStepOne } from '../services/userServices.js'

export default function RecoveryPasswordOne() {
     
    
    
    const [email, setEmail] = useState('')
    const [iconEmailValid, setIconEmailValid] = useState(false)
    const [iconEmailInvalid, setIconEmailInvalid] = useState(false)
    const [emailValid, setEmailValid] = useState(null)
    const [emailError, setEmailError] = useState('')



    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const [erroValidate, setErroValidate] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        const emailValidado = validarEmail(email)
        if(!emailValidado.isValid){
          setLoading(false)
          setErroValidate(emailValidado.error)
          return
        }
        const emailLimpo = emailValidado.valor
        setLoading(true)
        
        try {
            await userRecoveryStepOne(emailLimpo)
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
                                onChange={(e) => {
                                  const valor = e.target.value
                                  setEmail(valor)
                                  const resultado = validarEmail(valor)
                                  setEmailValid(resultado.isValid)
                                  setEmailError(resultado.error)
                                  setIconEmailValid(resultado.isValid)
                                  setIconEmailInvalid(!resultado.isValid)
                                }}
                            />
                            {emailError && <p className='errorInputForgot'>{emailError}</p>}
                            {iconEmailValid ? <CircleCheck className='iconCheck' /> : iconEmailInvalid ? <ShieldAlert className='iconInvalid' /> : ''}
                        </div>
                        {erroValidate ? <p className=' mx-auto errorValidateRecoveryOne' >{erroValidate}</p> : ''} 
                        <button className='mx-auto btnEntrar' type="submit">Enviar</button>
                    </form>
                </div>
            </div>
        </>
    )
}
