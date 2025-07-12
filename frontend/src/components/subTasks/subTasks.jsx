import '../../css/subTasks.css'
import { Edit, Trash2 } from "lucide-react"
import { useState, useEffect, useCallback } from 'react'
import FormAddSubTask from './formAddSubTask.jsx'
import EditSubTask from './formEditSubTask.jsx'
import DeleteSubTask from './formDeleteSubTask.jsx'
import StatusSubTask from './btnStatusSubTask.jsx'
import { getSubTask } from '../../services/subTaskServices.js'


export default function SubTasks({tarefaId}){


  const[menuDeleteAberto, setMenuDeleteAberto] = useState(false)
  const [deletandoTarefa, setDeletandoTarefa] = useState(false)
  const [mensagem, setMensagem] = useState('')

  function abrirMenuDeleteTask(sub){
      setOverflowSub(true)
      setMenuDeleteAberto((prev)=> !prev)
      setDeletandoTarefa(sub)
  }

  function fecharMenuDeleteTask(){
      setOverflowSub(false)
      setMenuDeleteAberto(false)
  }


  const [abrirMenuEdit, setAbrirMenuEdit] = useState(false)
  const [subTarefaEditando, setSubTarefaEditando] = useState(null);
  const [overflowSub, setOverflowSub] = useState(false)

  function menuEditOpen(sub){
    setSubTarefaEditando(sub)
    setOverflowSub(true)
    setAbrirMenuEdit(true)
  }
  function fecharMenuEdit(){
    setMensagem('')
    setAbrirMenuEdit(false)
    setOverflowSub(false)
  }
  


  const[subTarefas, setSubTarefas] = useState([])

  const carregarSubTarefas = useCallback(async () => {

        if(!tarefaId){
            console.log('Id da tarefa não encontrado!')
        }

        try {
           const data = await getSubTask({tarefaId:tarefaId})
            setSubTarefas(
              Array.isArray(data) 
              ? data 
              : Array.isArray(data?.subTarefa) 
                ? data.subTarefa 
                : []
            );
        } catch (err) {
            console.error('Erro ao carregar subtarefas:', err.message);
        }
        
    }, [tarefaId]);




    useEffect(() => {
       carregarSubTarefas();
    }, [carregarSubTarefas]);



    return(
        <>
          <div className="mainSubTasks">
            <div className="listSubTasks">
                {overflowSub && <div className='overflowSubTasks'></div>}
                {subTarefas.filter(sub => sub && sub._id).map((sub) => (            
                    <div 
                        key={sub._id} 
                        className="subTaskItem"
                    >
                        <div className='col-1 boxBtnUtils'>
                           <button style={{backgroundColor:'transparent', color: 'lightgray'}} onClick={()=> abrirMenuDeleteTask(sub)}><Trash2/></button>

                           {menuDeleteAberto && deletandoTarefa && deletandoTarefa._id === sub._id && (
                            <DeleteSubTask 
                              tarefaId={tarefaId}
                              subTaskName={sub.descricao}
                              BoxDeleteSubTaskClosed={()=> fecharMenuDeleteTask()}
                              subTaskId={sub._id}
                              subTarefaDeletada={()=> { fecharMenuDeleteTask(); carregarSubTarefas();}}
                            />
                           )}

                           <button style={{backgroundColor:'transparent', color: 'lightgray'}} onClick={()=> menuEditOpen(sub)}><Edit/></button>
                       
                            {abrirMenuEdit && subTarefaEditando && subTarefaEditando._id === sub._id && (
                               <EditSubTask
                                  subTaskEdited={()=>carregarSubTarefas()}
                                  tarefaId={tarefaId}
                                  subTarefaId={sub._id} 
                                  subTarefasDescricao={sub.descricao} 
                                  subTaskEditClosed={()=>fecharMenuEdit()}
                               />
                            )}
                        </div>
                        <div className='boxTxtSub col-12 col-md-8 col-lg-8'>
                            <p className=''>{sub.descricao}</p>
                        </div>
                         <div className='boxBtnStatusSub'>

                           <StatusSubTask
                             subTarefaId={sub._id}
                             subTarefas={sub}
                             atualizarStatus={()=> carregarSubTarefas()}
                           />

                         </div>
                    </div>
                ))}
            </div>
                <FormAddSubTask 
                  tarefaId={tarefaId}
                  subTarefas={subTarefas}
                  subTarefaAdicionada={()=> carregarSubTarefas()}
                />
          </div>
        </>
    )
}