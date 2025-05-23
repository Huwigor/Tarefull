import { useState } from 'react';
import axios from 'axios';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [msg, setMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_ROUTE_SERVER}/api/auth/forgotPassword`, { email });
            setMsg('Email de recuperação enviado!');
        } catch (err) {
            console.error('Erro completo:', err);
        }
    };

    return (
        <div>
            <h2>Recuperar senha</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Digite seu email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit">Enviar</button>
            </form>
            <p>{msg}</p>
        </div>
    );
}
