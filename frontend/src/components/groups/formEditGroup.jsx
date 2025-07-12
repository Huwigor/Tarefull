import { useState } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { editGroup } from '../../services/groupServices.js'
import { validarNome } from '../../utils/sanitizeDataGroups.js'


export default function EditGroup({grupoEditado, grupoId, nomeGrupo, fecharFormEdit}){

    const [mensagem, setMensagem] = useState('')
    const [nome, setNome] = useState( nomeGrupo || '' )


    const editGrupo = async ()=>{
    
        const nomeValidado = validarNome(nome)
        if(!nomeValidado.isValid){
            setMensagem(nomeValidado.error)
        }
        const nomeLimpo = nomeValidado.valor
    
        try{
    
          await editGroup({_id:grupoId, nome:nomeLimpo})
    
          setTimeout(()=>{
            fecharFormEdit()
            grupoEditado()
          }, 500)
    
        }catch(err){
          console.log(err)
        }
    
    }




    return(
        <motion.div 
          className="boxEditGroup"
            key={grupoId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
                duration: 0.3 
            }}
        >
            <button className=" btnCloseEditGroup ms-auto" onClick={()=> {fecharFormEdit(); setMensagem('')}}><X/></button>
            <div style={{width: '100%'}}>
                <p className="titleEditGroup">Nome do grupo</p>
            </div>  
            <input 
                type="text" 
                name="grupo" 
                id="grupo"
                value={nome}
                onChange={(e) => setNome(e.target.value)}  
            /> 

                {mensagem 
                ? (
                    <p 
                        style={{ marginTop: '10px', padding:'10px', marginBottom:'0px' }} 
                        className="alert alert-danger msgErroGrupo"
                    >
                        {mensagem}
                    </p>
                    ) : ''}                 
                <button className="btn btn-sm btn-success m-3 btnSubmitEdit" onClick={(e)=> {e.preventDefault(); editGrupo();}}>Alterar</button>
        </motion.div>  
    )
}