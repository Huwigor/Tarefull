import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Tasks from "./tasks";
import '../../css/allTasks.css'
import { TaskGet } from '../../services/taskServices'
import SelectAll from './selectTask';


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

    const tituloTarefa = tarefaSelecionada === 'allgroups'
      ? 'Todas as Tarefas'
      : 'Tarefa: ' + tarefasFiltradas[0]?.nome || '';



  return (

      <div className={classe}>
        <div className="mainSelectGroup">
            <SelectAll 
              tarefasOrdenadas={tarefasOrdenadas}
              tarefaSelecionada={tarefaSelecionada}
              setTarefaSelecionada={setTarefaSelecionada}
            />
          </div>
        {tarefasFiltradas.length === 0 
          ? (<p style={{marginTop: '20px', marginLeft: '20px'}}>Não há tarefas criadas!</p>)
          : (<>
          
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
    
  );
}
