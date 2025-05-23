import { useEffect, useState } from 'react';
import axios from 'axios';

export default function TarefasFinalizadas() {
  const [tarefas, setTarefas] = useState([]);

  useEffect(() => {
       axios.get(`${import.meta.env.VITE_ROUTE_SERVER}/api/tasksEnd`, { 
            withCredentials:true
        })
      .then(res => setTarefas(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Tarefas Finalizadas</h2>
      {tarefas.map(tarefa => (
        <div key={tarefa._id}>
          <strong>{tarefa.nome}</strong> - {tarefa.detalhes}
        </div>
      ))}
    </div>
  );
}
