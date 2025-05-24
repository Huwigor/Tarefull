import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import HeaderAuth from '../components/headerAuth.jsx';
import '../css/ResetPassword.css'

export default function ResetPassword() {
    const { token } = useParams();
    const [password, setPassword] = useState('');
    const [msg, setMsg] = useState('');

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_ROUTE_SERVER}/api/auth/resetPassword/${token}`, { password });
            navigate('/')
        } catch (err) {
            setMsg('Aconteceu algum erro inesperado, refaça o processo por favor!');
        }
    };

    const fullText = "Escolha uma nova senha!";
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
            <div className='mainReset'>
                <div className='boxReset'>
                    <h2>{typedText} <span className='cursor'>|</span></h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name='novaSenha'
                            id='novaSenha'
                            placeholder="Nova senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        {msg ? ( <p className='alert alert-danger span-error' style={{padding:'10px', marginBottom:'0px', marginTop:'20px'}}>{msg}</p>) : ''}
                       
                        <button className='mx-auto' type="submit">Redefinir</button>
                    </form>
                </div>
            </div>
        </>
    );
}
