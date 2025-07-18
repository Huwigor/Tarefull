import { useState } from "react";
import { SendHorizontal } from "lucide-react";
import {validarNome} from '../../utils/sanitizeDataSubTasks.js'
import { addSubTask } from "../../services/subTaskServices.js";

export default function AddSubTask({tarefaId, subTarefas, subTarefaAdicionada}){

    const [subTask, setSubTask] = useState('')
    const maxLength = 500

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
                <div
                    className="char-counter"
                    style={{
                        fontSize: '0.75rem',
                        textAlign: 'right',
                        marginBottom: '5px',
                        color: subTask.length >= maxLength ? 'red' : '#666',
                    }}
                >
                    {subTask.length} / {maxLength}
                </div>
                <input 
                    type="text"
                    name="subtask"
                    value={subTask}
                    onChange={(e)=> { 
                        if (e.target.value.length <= 500){
                            setSubTask(e.target.value)
                        }
                    }}
                    id="subtask"
                    placeholder="Sub-Tarefas.."  
                />
                <button 
                    type="submit"
                    disabled={subTarefas.length >= 5}
                    className={subTarefas.length >= 5 ? 'btn-disabled' : ''}
                >
                    <SendHorizontal className="iconSendSubTask"/>
                </button>
            </div>
        </form>
    )
}