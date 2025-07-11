import { useEffect, useState } from 'react';
import Tasks from "./tasks";
import { TaskGet } from '../../services/taskServices';



export default function TarefasFinalizadas(atualizarTarefa) {


  const [tarefas, setTarefas] = useState([]);
  const [classe, setClasse] = useState('mainAllTasksHidden')


  const fetchData = async()=>{
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
    setTarefaSelecionada('allTasksEnd')
  },[TarefasFinalizadas, atualizarTarefa])




  const tarefasOrdenadas = [...tarefas].sort((a, b) => {
    const qtdA = a.subTarefa ? a.subTarefa.length : 0;
    const qtdB = b.subTarefa ? b.subTarefa.length : 0;
    return qtdB - qtdA;
  });

  const [tarefaSelecionada, setTarefaSelecionada] = useState('allTasksEnd')
  
  const tarefasFiltradas = tarefaSelecionada === "allTasksEnd"
  ? tarefasOrdenadas
  : tarefasOrdenadas.filter((t) => t._id === tarefaSelecionada);


  let tituloTarefa = "Tarefas Finalizadas";
  if (tarefaSelecionada !== "allTasksEnd") {
    const tarefaEscolhida = tarefas.find(t => t._id === tarefaSelecionada);
    if (tarefaEscolhida) {
      tituloTarefa = 'Tarefa ' + tarefaEscolhida.nome + ' finalizada!';
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
            <option value='allTasksEnd'>Todos as Tarefas</option>
            {tarefas.map((tarefa)=>(
              <option key={tarefa._id} value={tarefa._id}>{tarefa.nome}</option>
            ))}
        </select>
      </div>
      <div className={classe}>
        <div className='allTasks'>
          {tarefasFiltradas.length > 0 ? 
            tarefasFiltradas.map((tarefa, index) => (
              <div
                className='mainGrupos' 
                key={tarefa._id}
              >
              <h2 className='titleAllTasks'>{tituloTarefa}</h2>
                <Tasks
                  key={tarefa._id}
                  tarefa={tarefa}
                  atualizarGrupos={fetchData}
                />
              </div>
              ))  : <p style={{marginTop: '20px', marginLeft: '20px'}}>Não há tarefas finalizadas!</p> }
        </div>
      </div>
    </>
  );
}
