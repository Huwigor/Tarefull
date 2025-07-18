import { motion } from "framer-motion"
import { useState } from "react"
import { X } from "lucide-react"
import { validarNome } from "../../utils/sanitizeDataSubTasks.js"
import { editSubTask } from "../../services/subTaskServices"

export default function EditSubTask({subTarefasDescricao, tarefaId, subTarefaId, subTaskEditClosed, subTaskEdited}){

    const [mensagem, setMensagem] = useState('')
    const [descricao, setDescricao] = useState(subTarefasDescricao || '')
    const subTaskLength = 500


    const handleEdit = async (e) =>{
        e.preventDefault()
    
        const nomeValidado = validarNome(descricao)
        if(!nomeValidado.isValid){
            setMensagem(nomeValidado.error)
            return
        }
        const nomeLimpo = nomeValidado.valor
    
        try{
            await editSubTask({
                descricao:nomeLimpo, 
                tarefaId:tarefaId, 
                subTarefaId:subTarefaId
            })
            setTimeout(()=>{
                setMensagem('')
                subTaskEditClosed()
                subTaskEdited()
            }, 500)
        }catch(err){
            console.log(err)
        }
        
    }


    return(
        <motion.div
            className={'formContainerEdit'}
            initial={{ opacity: 0, scale: 0.8, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            transition={{ duration: 0.3 }}
        >
            <button className='btnCloseEdit ms-auto' onClick={()=>subTaskEditClosed()}><X/></button>
            <form action="" onSubmit={handleEdit}>
            <p className='titleEditSubTask'>Nome da sub tarefa</p>
            <div
                className="char-counter"
                style={{
                    fontSize: '0.75rem',
                    textAlign: 'right',
                    marginBottom: '5px',
                    color: descricao.length >= subTaskLength ? 'red' : '#666',
                }}
            >
                {descricao.length} / {subTaskLength}
            </div>
            <textarea 
                type="text" 
                id='edit' 
                name='edit' 
                value={descricao} 
                onChange={(e) => { 
                    if(e.target.value.length <= 500){
                        setDescricao(e.target.value)
                    }
                }}
            />
            {mensagem ? <p className='alert alert-danger text-center msgErroSubTask' style={{ marginTop: '10px', padding:'10px', marginBottom:'0px' }}>{mensagem}</p> : ''}
            <button className='mx-auto btn btn-sm btn-success btnEntrar' type='submit'>Alterar</button>
        </form>
        </motion.div>
    )
}