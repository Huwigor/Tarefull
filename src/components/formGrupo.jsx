import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import '../css/makeTask.css';
import axios from 'axios'
import Swal from 'sweetalert2'

export default function FormGrupo({ openFormGrupo, fecharFormGrupo }) {

  const [nomeGrupo, setNomeGrupo] = useState('')
  const [mensagem, setMensagem]= useState('')

  const criarGrupo = async (e) =>{
    e.preventDefault()
    try{
      const response = await axios.post(
        `${import.meta.env.VITE_ROUTE_SERVER}/api/makeGrupo`,
        {nome: nomeGrupo},
        {withCredentials: true},
      )

      Swal.fire({
        title: 'Grupo Adicionado!',
        icon: 'success',
        confirmButtonText: 'OK'
      })
      setNomeGrupo('')
        
    } catch(erro){
      if(erro.response){
        setMensagem(erro.response.data.mensagem || 'erro ao tentar criar grupo')
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
          <form className='formTarefas' onSubmit={criarGrupo}>
            <button 
                style={{height:'40px', fontSize: '24px', marginRight: '30px', marginBottom:'20px'}}
                type="button" 
                className={`btn btn-sm btn-close btn-danger ms-auto`} 
                onClick={fecharFormGrupo}>
            </button>
            <input
              type="text"
              name="nome"
              id="nome"
              value={nomeGrupo}
              onChange={(e)=> setNomeGrupo(e.target.value)}
              placeholder="Nome do Grupo"
            />
             {mensagem && <p className="alert alert-danger" style={{ marginTop: '10px', padding:'10px' }}>{mensagem}</p>}
            <button className={`btn btn-md btn-success mt-3`} type="submit">Criar Grupo</button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
