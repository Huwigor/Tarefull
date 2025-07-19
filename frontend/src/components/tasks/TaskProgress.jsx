import { useEffect, useState } from 'react';
import Tasks from "./tasks";
import { TaskGet } from '../../services/taskServices';

export default function TarefasEmAndamento(atualizarTarefa) {


  const [tarefas, setTarefas] = useState([]);
  const [tarefaSelecionada, setTarefaSelecionada] = useState('allTaskProgress')
    const [classe, setClasse] = useState('mainAllTasksHidden')


  const fetchData = async ()=>{
    try{
       const data = await TaskGet()
        setTarefas(Array.isArray(data) ? data : [])
        setClasse('mainAllTasks')
    }catch(err){

      console.error(err)
    }
  }



  useEffect(()=>{
    fetchData()
    setTarefaSelecionada('allTaskProgress')
  }, [TarefasEmAndamento, atualizarTarefa])
 


  const tarefasOrdenadas = [...tarefas].sort((a, b) => {
    const qtdA = a.subTarefa ? a.subTarefa.length : 0;
    const qtdB = b.subTarefa ? b.subTarefa.length : 0;
    return qtdB - qtdA;
  });

  const tarefasFiltradas = tarefaSelecionada === "allTaskProgress"
  ? tarefasOrdenadas.filter(t => new Date(t.dataHora) > new Date())
  : tarefasOrdenadas.filter(t => t._id === tarefaSelecionada && new Date(t.dataHora) > new Date());


  let tituloTarefa = "Tarefas em Andamento";
  if (tarefaSelecionada !== "allTaskProgress") {
    const tarefaEscolhida = tarefas.find(t => t._id === tarefaSelecionada);
    if (tarefaEscolhida) {
      tituloTarefa = 'Tarefa ' + tarefaEscolhida.nome + ' em andamento!';
    }
  }

 return (
  <>
    <div className={classe}>
      {tarefasFiltradas.length === 0 
      ? (<p style={{marginTop: '20px', marginLeft: '20px'}}>Não há tarefas em progresso!</p>)
      : (
        <>
          <h2 className='titleAllTasks'>{tituloTarefa}</h2>
          <div className='allTasks'>
            {tarefasFiltradas.map((tarefa, index) => (
              <div key={tarefa._id}>
                <Tasks
                  tarefa={tarefa}
                  atualizarGrupos={fetchData}
                />
              </div>
            ))}
          </div>     
        </>
      )}
    </div>
  </>
);
}
