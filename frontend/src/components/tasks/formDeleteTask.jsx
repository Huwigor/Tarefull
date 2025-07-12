import { motion } from "framer-motion"
import { useState } from "react"
import { Check, X } from "lucide-react"
import { deleteTask } from "../../services/taskServices"

export default function DeleteTask({taskData, fecharBoxDelete, tarefaDeletada}){


    const [dataTask, setDataTask] = useState({
        id: taskData._id,
        nome:taskData.nome
    })

    const deletarTarefa = async (id) => {
        try {
            await deleteTask(id)
    
            setTimeout(()=>{
                tarefaDeletada()
    
            }, 500)
        } catch (error) {
          console.error('Erro ao apagar tarefa:', error.response?.data);
        }
      };


    return(
        <motion.div
            key={dataTask.id}
            className="boxConfirmDelete"
            initial={{ opacity: 0, scale: 0.8, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{
            position: 'absolute',
            top: '10%',
            left: '3%',
            background: 'white',
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '10px',
            zIndex: 999,
            boxShadow: '0px 4px 12px rgba(0,0,0,0.15)',
            minWidth: '300px'
            }}
        >
            <p className="text-center mb-2" style={{color:'black', width:'100%'}}>Deseja realmente excluir a tarefa <br /> <b>{dataTask.nome}</b> ?</p>
            <div className="d-flex boxBtnDelete">
            <button
                onClick={()=> deletarTarefa(dataTask.id)}
                className="btn btn-sm btn-success"
                style={{padding:'7px'}}
            >
                <Check size={16} /> Sim
            </button>
            <button
                onClick={()=>fecharBoxDelete()}
                className="btn btn-sm btn-danger"
                style={{padding:'7px', margin:'20px'}}
            >
                <X size={16} /> Cancelar
            </button>
            </div>
        </motion.div>
    )
}