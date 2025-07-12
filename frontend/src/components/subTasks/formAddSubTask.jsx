import { useState } from "react";
import { SendHorizontal } from "lucide-react";
import {validarNome} from '../../utils/sanitizeDataSubTasks.js'
import { addSubTask } from "../../services/subTaskServices.js";

export default function AddSubTask({tarefaId, subTarefas, subTarefaAdicionada}){

    const [subTask, setSubTask] = useState('')

    const [dataSub, setDataSub] = useState(() => {
        if(tarefaId){
            return{ id: tarefaId }
        }
        return{id:''}
    })

    const handleSubmit = async (e)=>{
        e.preventDefault()
        
       const subTaskValidada = validarNome(subTask)
       if(!subTaskValidada.isValid){
          return
       }
       const nomeLimpo = subTaskValidada.valor
    
        try{
            await addSubTask({task: nomeLimpo, tarefaId: dataSub.id})
            setTimeout(()=>{
                setSubTask('')
                subTarefaAdicionada()
            }, 500)
        }catch(err){
            console.error(err)
        }
    
    }
    
    
    return(
        <form action="" onSubmit={handleSubmit}>
            <div className='boxInputSub mx-auto'>
                <input 
                    type="text"
                    name="subtask"
                    value={subTask}
                    onChange={(e)=> setSubTask(e.target.value)}
                    id="subtask"
                    placeholder="Sub-Tarefas.."  
                />
                <button 
                    type="submit"
                    disabled={subTarefas.length >= 5}
                    className={subTarefas.length >= 5 ? 'btn-disabled' : ''}
                >
                    <SendHorizontal/>
                </button>
            </div>
        </form>
    )
}