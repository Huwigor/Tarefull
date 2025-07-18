import { Edit, Trash2 } from "lucide-react"
import CountdownTimer from "./cronometroTask.jsx"
import '../../css/task.css'
import { useEffect, useState } from "react"
import SubTasks from "../subTasks/subTasks.jsx"
import EditTask from "./formEditTask.jsx"
import DeleteTask from "./formDeleteTask.jsx"



export default function Tasks({tarefa, atualizarGrupos}){

  const [abrirBoxDelete, setAbrirBoxDelete] = useState(false)
  const [taskEdited, setTaskEdited] = useState(false)
  const [taskDelete, setTaskDelete] = useState('')
  const [taskDeleted, setTaskDeleted] = useState(false)
  
    
    
    
    
  useEffect(()=>{
    atualizarGrupos()
  },[taskEdited, taskDeleted])

        
    
    
  const [abrirBoxEdit, setAbrirBoxEdit] = useState(false)
  const [tarefaEdit, setTarefaEdit] = useState(null)

  function boxEditAberta(tarefa){
      setTarefaEdit(tarefa)
      setAbrirBoxEdit(true)
  }

  function boxEditFechada(){
    setAbrirBoxEdit(false)
  }


    

    return(
  
          <div className=' mx-auto maintarefa col-12 col-md-10 col-lg-10'>
            {abrirBoxEdit && tarefaEdit && tarefaEdit._id === tarefa._id &&  <div className="overflowTarefa"></div>}
            {abrirBoxDelete && taskDelete && taskDelete === tarefa._id && <div className="overflowTarefa"></div> }
    
                {abrirBoxDelete && taskDelete && taskDelete === tarefa._id && (
                  <DeleteTask
                    taskData={tarefa}
                    fecharBoxDelete={()=> setAbrirBoxDelete(false)}
                    tarefaDeletada={()=>setTaskDeleted((prev)=>!prev)}
                  />
                )}
             
                <div className="contentTask" style={{width:'100%'}}>
                  <div className="boxInfoTarefa col-12 col-md-4 col-lg-4">
                  <button
                      onClick={() => {setAbrirBoxDelete(true); setTaskDelete(tarefa._id);}}
                      className='ms-auto btnExcluirTarefa'
                  >
                      <Trash2 className="iconTrash" /> 
                  </button>
                    
                   
                      <div className="d-flex boxInfoTask">
                        <button className="btnEditTarefa"  onClick={()=> boxEditAberta(tarefa)}><Edit className="iconEditTask"/></button>
                        <p className="nomeTarefa mx-auto">{tarefa.nome}</p>
                      </div>
            
                  <CountdownTimer dataAtual={tarefa.dataCadastro} targetDate={tarefa.dataHora} />

                  {abrirBoxEdit && tarefaEdit && tarefaEdit._id === tarefa._id && (
                    <EditTask 
                      taskData={tarefa}
                      fecharboxEdit={ () => boxEditFechada() }
                      tarefaEditada={ () => setTaskEdited((prev)=>!prev) }
                    />
                  )}
                  </div>
                  <div className="menuTarefa">
                      <SubTasks 
                        tarefaId={tarefa._id} 
                      />
                  </div>
                </div>
        </div>
        
    
    )
}