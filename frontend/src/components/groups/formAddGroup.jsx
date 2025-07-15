import { useState } from "react"
import { validarNome } from "../../utils/sanitizeDataGroups.js";
import { motion, AnimatePresence } from "framer-motion"
import '../../css/formGroupTask.css';
import { addGroup } from "../../services/groupServices";
import Swal from 'sweetalert2'

export default function FormGrupo({ openFormGrupo, fecharFormGrupo, onGrupoCriado }) {

  const [nomeGrupo, setNomeGrupo] = useState('')
  const [mensagem, setMensagem]= useState('')

  function limparForm(){
    setNomeGrupo('')
    setMensagem('')
  }

  const criarGrupo = async (e) =>{
    e.preventDefault()

    const nomeValidado = validarNome(nomeGrupo)
    if(!nomeValidado.isValid){
      setMensagem(nomeValidado.error)
      return
    }
    const nomeLimpo = nomeValidado.valor

    try{
      await addGroup({nome: nomeLimpo})

      Swal.fire({
        title: 'Grupo Adicionado!',
        icon: 'success',
        confirmButtonText: 'OK'
      })

      setNomeGrupo('')
      setMensagem('')
      onGrupoCriado()
      fecharFormGrupo()
        
    } catch(erro){
      if(erro.response){
        setMensagem(erro.response.data.mensagem || erro.response.data.error)
      } else {
        setMensagem('erro de conexão ao servidor')
      }
      
    }

  }

  return (
    <AnimatePresence>
      {openFormGrupo && (
        <motion.div
          key="form"
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className='formContainer'
        >
          <form className='formAdd' onSubmit={criarGrupo}>
            <button 
                style={{height:'40px', fontSize: '24px', marginRight: '30px', marginBottom:'20px'}}
                type="button" 
                className={`btn btn-sm btn-close ms-auto`} 
                onClick={()=> {fecharFormGrupo(); limparForm();}}>
            </button>
            <p className="titleForm">Nome do Grupo</p>
            <input
              type="text"
              name="nome"
              id="nome"
              value={nomeGrupo}
              onChange={(e)=> setNomeGrupo(e.target.value)}
            />
             {mensagem && <span className="alert alert-danger mx-auto msgErro" >{mensagem}</span>}
            <button 
              className={`btn btn-md btn-success mt-3`}
           
              type="submit"
            > 
              Criar Grupo
            </button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
