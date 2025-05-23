import { useEffect, useState } from "react";
import axios from "axios";
import '../css/allGroups.css'
import { motion, AnimatePresence } from "framer-motion";
import CountdownTimer from "./cronometroData";

export default function AllGroups() {
  const [grupos, setGrupos] = useState([]);

  const formatarData = (data) => {
    const date = new Date(data);
    return isNaN(date.getTime()) ? "Data inválida" : date.toLocaleString("pt-BR");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_ROUTE_SERVER}/allGroups`, {
          withCredentials: true
        });
        setGrupos(res.data);
      } catch (err) {
        console.error("Erro ao buscar grupos com tarefas:", err);
      }
    };

    fetchData();
  }, []);

  const gruposOrdenados = [...grupos].sort((a, b) => {
    if (a.tarefas.length > 0 && b.tarefas.length === 0) return -1;
    if (b.tarefas.length > 0 && a.tarefas.length === 0) return 1;
    return 0;
  });

  return (
    <div className={` col-12 mainGrupos`}>
    <AnimatePresence>
      {gruposOrdenados.map((grupo, index) => (
        <motion.div
          key={grupo._id}
          className={`grupos`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: index * 0.1, 
            duration: 0.3 
          }}
        >
          <h3>{grupo.nome}</h3>
          {grupo.tarefas.length === 0 ? (
              <p>Sem tarefas</p>
            ) : (
              <div className="row">
                {grupo.tarefas.map((tarefa) => (
                  <div key={tarefa._id} className={`col-12 col-md-4 col-lg-4 tarefa`}>
                    <p>{tarefa.nome}</p>
                    <CountdownTimer targetDate={tarefa.dataHora} />
                  </div>
                ))}
              </div>
            )}
                
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
  );
}
