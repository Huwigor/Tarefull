import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Tasks from "./tasks";
import '../../css/allTasks.css'
import { TaskGet } from '../../services/taskServices';





export default function TodasTarefas({atualizarTarefa}) {


  const [tarefas, setTarefas] = useState([]);
  const [classe, setClasse] = useState('mainAllTasksHidden')
  const [tarefaSelecionada, setTarefaSelecionada] = useState('allgroups')



    const fetchData = async ()=>{
       try{
          const data = await TaskGet()
          setTarefas(Array.isArray(data) ? data : [])
          setClasse('mainAllTasks')
       }catch(err){
        console.log(err)
       }
    }


    useEffect(()=>{
      fetchData()
      setTarefaSelecionada('allgroups')
    }, [TodasTarefas, atualizarTarefa])


    const tarefasOrdenadas = [...tarefas].sort((a, b) => {
      const qtdA = a.subTarefa ? a.subTarefa.length : 0;
      const qtdB = b.subTarefa ? b.subTarefa.length : 0;
      return qtdB - qtdA;
    });

    const tarefasFiltradas = tarefaSelecionada === "allgroups"
    ? tarefasOrdenadas
    : tarefasOrdenadas.filter((t) => t._id === tarefaSelecionada);



    let tituloTarefa = "Todas as Tarefas";
    if (tarefaSelecionada !== "allgroups") {
      const tarefaEscolhida = tarefas.find(t => t._id === tarefaSelecionada);
      if (tarefaEscolhida) {
        tituloTarefa = 'Tarefa ' + tarefaEscolhida.nome;
      }
    }



  return (

    <>
      <div className="mainSelectGroup">
          <select 
              name="grupos" 
              id="grupos"
              disabled={tarefasFiltradas.length === 0}
              value={tarefaSelecionada}
              onChange={(e)=>setTarefaSelecionada(e.target.value)}
          >
              <option value='allgroups'>Todos as Tarefas</option>
              {tarefas.map((tarefa)=>(
                <option key={tarefa._id} value={tarefa._id}>{tarefa.nome}</option>
              ))}
            </select>
        </div>
      <div className={classe}>
        {tarefasFiltradas.length === 0 
          ? (<p style={{marginTop: '20px', marginLeft: '20px'}}>Não há tarefas criadas!</p>)
          : (<>
              <h2 className='titleAllTasks'>{tituloTarefa}</h2>
              <div className='allTasks'>
                {tarefasFiltradas.map((tarefa) => (
                <motion.div
                    key={tarefa._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Tasks
                        tarefa={tarefa}
                        atualizarGrupos={fetchData}
                      />
                  </motion.div>
            
                  ))}
              </div>
            </>)
      }
      </div>
    </>
    
  );
}
