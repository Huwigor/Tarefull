import { motion } from "framer-motion"
import { useState } from "react"
import { validarNome } from '../../utils/sanitizeDataTasks.js'
import { X } from "lucide-react"
import { TaskEdit } from "../../services/taskServices.js"

export default function EditTask({taskData, fecharboxEdit, tarefaEditada}){


    const[mensagem, setMensagem] = useState('')
    const [taskEdit, setTaskEdit] = useState({
        id: taskData._id,
        nome: taskData.nome,
        time: taskData.dataHora
    })


    function formatDateToInput(dateStr) {
        const date = new Date(dateStr)
        const offset = date.getTimezoneOffset()
        const localDate = new Date(date.getTime() - offset * 60000)
        return localDate.toISOString().slice(0, 16) 
  }


  const editarTarefa = async ()=>{

    const nomeValidado = validarNome(taskEdit.nome)
    if(!nomeValidado.isValid){
      setMensagem(nomeValidado.error)
      return
    }
    const nomeLimpo = nomeValidado.valor
      
    try{ 
      await TaskEdit({id: taskEdit.id, nome: nomeLimpo, dataHora: taskEdit.time })

      setTimeout(()=>{
          fecharboxEdit()
          tarefaEditada()
      }, 500)
      
    }catch(err){
      console.log(err)
    }
  }
    

    return(
        <motion.div
            className="boxEditTarefa"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
                duration: 0.3 
            }}
        >
            <button onClick={()=> {fecharboxEdit(); setMensagem('');}} className="btnFecharEdit ms-auto"><X/></button>
            <p>Nome da Tarefa</p>
            <input 
                type="text" 
                id="nome" 
                name="nome" 
                value={taskEdit.nome}
                onChange={(e)=> setTaskEdit({
                ...taskEdit,
                nome: e.target.value,
                })}
            />
            <p>Encerramento da Tarefa</p>
            <input 
                type="datetime-local"
                id="dataHora"
                name="dataHora"
                value={formatDateToInput(taskEdit.time)}
                onChange={(e)=>setTaskEdit({
                    ...taskEdit,
                    time: e.target.value
                })} 
            />
            {mensagem 
                ? (
                
                    <span
                        style={{ marginTop: '20px'}} 
                        className="alert alert-danger msgErroEditTask mx-auto"
                    >
                        {mensagem}
                    </span>
                
                ) : ''}
            <button className="btnSubmitEdit mx-auto btn btn-md btn-success" onClick={()=> editarTarefa()}>Editar</button>
        </motion.div>
    )
}