import { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function ResetPassword() {
    const { token } = useParams();
    const [password, setPassword] = useState('');
    const [msg, setMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_ROUTE_SERVER}/api/auth/resetPassword/${token}`, { password });
            setMsg('Senha redefinida com sucesso!');
        } catch (err) {
            setMsg('Erro ao redefinir senha.');
        }
    };

    return (
        <div>
            <h2>Redefinir Senha</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Nova senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Redefinir</button>
            </form>
            <p>{msg}</p>
        </div>
    );
}
