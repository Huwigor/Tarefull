import { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/ForgotPassword.css'
import HeaderAuth from '../components/headerAuth.jsx'
import { MailCheck } from 'lucide-react';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [msgSucesso, setMsgSucesso] = useState('');
    const [msgErro, setMsgErro] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsgSucesso(''); 
        setMsgErro('');     
        try {
            const response = await axios.post(`${import.meta.env.VITE_ROUTE_SERVER}/api/auth/forgotPassword`, { email });
            setMsgSucesso(response.data.message); 
        } catch (error) {
            console.error('Erro completo:', error);
            if (error.response) {
                if (error.response.status === 404) {
                    setMsgErro(error.response.data.message || 'Usuário não encontrado.');
                } else if (error.response.status === 400) {
                    setMsgErro(error.response.data.message || 'Um email de recuperação já foi enviado, verifique sua caixa de mensagem.');
                } else {
                    setMsgErro('Ocorreu um erro ao processar sua solicitação.');
                }
            } else if (error.request) {
                setMsgErro('Não foi possível conectar ao servidor.');
            } else {
                setMsgErro('Ocorreu um erro inesperado.');
            }
        }
    };

      const fullText = "Use o email de cadastro da sua conta!";
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

    return (
        <>
            <HeaderAuth/>
            <div className='mainForgot'>
                <div className='boxForgot'>
                    <h2>{typedText} <span className='cursor'>|</span></h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="email"
                            placeholder="Digite seu email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <p>{
                            msgSucesso ? (<p className='alert alert-success span-success' > <MailCheck style={{color:'green', marginRight:'5px'}}/> {msgSucesso}</p>) 
                            : msgErro ? (<p className='alert alert-danger span-error' >{msgErro}</p>)
                            : null}
                        </p>
                        <button className='mx-auto' type="submit">Enviar</button>
                    </form>
                </div>
            </div>
        </>
    );
}
