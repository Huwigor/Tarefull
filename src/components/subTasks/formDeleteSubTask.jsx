import { motion } from "framer-motion"
import { Check, X } from "lucide-react"
import { deleteSubTask } from "../../services/subTaskServices"

export default function DeleteSubTask({subTaskId, tarefaId, subTaskName, BoxDeleteSubTaskClosed, subTarefaDeletada}){

      const deleteTaskForm = async ()=>{
    
        try{
            await deleteSubTask({tarefaId:tarefaId, subTarefaId:subTaskId})
            subTarefaDeletada()
        }catch(err){
            console.error(err)
        }

    }


    return(
        <motion.div
            key={subTaskId}
            className='boxDeleteSubTask'
            initial={{ opacity: 0, scale: 0.8, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            transition={{ duration: 0.3 }}
        >
            <p>Deseja realmente excluir a sub tarefa <b>{subTaskName}</b>?</p>
            <div className='boxBtnDelSubTask'>
                <button className='btn btn-sm btn-success' onClick={() => deleteTaskForm()}><Check size={16} /> Sim</button>
                <button className='btn btn-sm btn-danger' onClick={BoxDeleteSubTaskClosed}><X size={16} /> Cancelar</button>
            </div>


        </motion.div>
    )
}