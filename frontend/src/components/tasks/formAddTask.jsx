import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion"
import { validarNome } from "../../utils/sanitizeDataTasks.js"
import '../../css/formGroupTask.css';
import axios from 'axios'
import Swal from 'sweetalert2'
import { addTask } from "../../services/taskServices";

export default function FormTarefas({ abrirMenu, fecharMenu, onTarefaCriada }) {

  const [tempo, setTempo] = useState("");
  const [grupos, setGrupos] = useState([]);
  const [grupoSelecionado, setGrupoSelecionado] = useState("");
  const [nome, setNome] = useState('')
  const [mensagem, setMensagem] = useState('')

  function limparForm(){
    setNome('')
    setTempo('')
    setGrupoSelecionado('')
    setMensagem('')
  }


  const HandleChange = (e) => {
    setTempo(e.target.value);
  };


  const GET_DATA = import.meta.env.VITE_GETDATA_ROUTES
  useEffect(() => {
    const buscarGrupos = async () => {
      if(!abrirMenu) return
      try {
        const res = await axios.get(
          `${GET_DATA}allGroups`,
          { withCredentials: true }
        )
        setGrupos(res.data)
      } catch (err) {
        console.error("Erro ao buscar grupos:", err)
      }
    }

    buscarGrupos()
  }, [abrirMenu])



  const handleSubmit = async (e)=>{
    e.preventDefault()

    const nomeValidado = validarNome(nome)
    if(!nomeValidado.isValid){
      setMensagem(nomeValidado.error)
      return
    }
    const nomeLimpo = nomeValidado.valor
    const dataCadastro = new Date().toISOString()

    try{
      await addTask({nome: nomeLimpo, tempo, dataCadastro:dataCadastro, grupoId:grupoSelecionado})

      Swal.fire({
        title: 'Tarefa Adicionada!',
        icon: 'success',
        confirmButtonText: 'OK'
      })
      
      setNome('')
      setGrupoSelecionado('')
      setTempo('')
      setMensagem('')
      onTarefaCriada()
    
    }catch(err){
        const mensagemErro = err.response?.data?.message || 'Erro ao criar tarefa'
        setMensagem(mensagemErro)
    }
  }


  return (
    <AnimatePresence>
      {abrirMenu && (
        <motion.div
          key="form"
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className={'formContainer'}
        >
          <form className='formAdd' onSubmit={handleSubmit}>
            <button 
                style={{height:'40px', fontSize: '24px', marginRight: '30px', marginBottom:'20px'}}
                type="button" 
                className={`btn btn-sm btn-close btn-danger ms-auto`} 
                onClick={()=> {fecharMenu(); limparForm();}}>
            </button>
            <input
              type="text"
              name="nome"
              value={nome}
              onChange={(e)=>setNome(e.target.value)}
              id="nome"
              placeholder="Nome da Tarefa"
            />
            <div className={` boxInputTime`}>
              <p style={{color: 'rgb(82, 79, 79)'}}>Data / Hora</p>
              <input
                type="datetime-local"
                value={tempo}
                name="tempo"
                id="tempo"
                onChange={HandleChange}
                step="1"
              />
            </div>
            <select
              value={grupoSelecionado}
              onChange={(e) => setGrupoSelecionado(e.target.value)}
              className={`formSelect`}
            >
              <option value="">Grupo Geral</option>
              {grupos.map((grupo) => (
                <option key={grupo._id} value={grupo._id}>
                  {grupo.nome}
                </option>
              ))}
            </select>
            {mensagem && <span className="alert alert-danger msgErro" >{mensagem}</span>}
            <button className={`btn btn-md btn-success mt-3`} type="submit">Criar Tarefa</button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
