import { motion } from 'framer-motion'
import { X, Check } from 'lucide-react'
import { deleteGroup } from '../../services/groupServices'


export default function DeleteGroup({grupoId, nomeGrupo, fecharFormDelete, grupoDeletado}){

    const deleteGrupo = async ()=>{
      try{
        await deleteGroup({id: grupoId})
        setTimeout(()=>{
          fecharFormDelete()
          grupoDeletado()
        }, 500)
      }catch(err){
        console.log(err)
      }    
    }

    return(
        <motion.div
            className="mainDeleteGroup"
            key={grupoId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
                duration: 0.3 
            }}
            >
            <p>Deseja realmente deletar o grupo <b>{nomeGrupo}</b>?</p>
            <div className="boxBtnDelete">
                <button className="btn btn-sm btn-success" onClick={ (e)=> { e.preventDefault(); deleteGrupo();}}><Check size={16} /> Sim</button>
                <button className="btn btn-sm btn-danger" onClick={()=> fecharFormDelete()}><X size={16} /> Cancelar</button>
            </div>
        </motion.div>
    )
}