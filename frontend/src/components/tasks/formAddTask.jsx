import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion"
import { validarNome } from "../../utils/sanitizeDataTasks.js"
import '../../css/formGroupTask.css';
import axios from 'axios'
import Swal from 'sweetalert2'
import { addTask } from "../../services/taskServices";
import Select from 'react-select';

export default function FormTarefas({ abrirMenu, fecharMenu, onTarefaCriada }) {


  const [tempo, setTempo] = useState("");
  const [grupos, setGrupos] = useState([]);
  const [grupoSelecionado, setGrupoSelecionado] = useState("");
  const [nome, setNome] = useState('')
  const [mensagem, setMensagem] = useState('')
  const maxLength = 100

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
        confirmButtonText: 'OK',
        customClass: {
          popup: 'swalBox'
        }
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
                style={{height:'40px', fontSize: '20px', marginRight: '30px', marginBottom:'20px'}}
                type="button" 
                className={`btn btn-sm btn-close btn-danger ms-auto`} 
                onClick={()=> {fecharMenu(); limparForm();}}>
            </button>
            <textarea
              type="text"
              name="nome"
              value={nome}
              onChange={(e)=> {
                  if(e.target.value.length <= maxLength){
                      setNome(e.target.value)
                  }
              }}
              id="nome"
              placeholder="Nome da Tarefa"
            />
            <div
                className="char-counter ms-auto"
                style={{
                    fontSize: '0.75rem',
                    textAlign: 'right',
                    marginRight: '10%',
                    color: nome.length >= 100 ? 'red' : '#666',
                }}
            >
                {nome.length} / {maxLength}
            </div>
            <div className={`boxInputTime`}>
              <p style={{color: 'rgb(82, 79, 79)'}}>Data para Conclusão</p>
              <input
                type="datetime-local"
                value={tempo}
                className="mx-auto"
                name="tempo"
                id="tempo"
                onChange={HandleChange}
                step="1"
              />
            </div>
            <div 
              style={{width: '80%', marginTop:'20px'}}
            >
                <Select
                  options={[
                    { value: "", label: "Grupo Geral" },
                    ...grupos.map(grupo => ({
                      value: grupo._id,
                      label: grupo.nome
                    }))
                  ]}
                  value={[{ value: "", label: "Grupo Geral" }, ...grupos.map(grupo => ({
                    value: grupo._id,
                    label: grupo.nome
                  }))].find(option => option.value === grupoSelecionado)}
                  onChange={(option) => setGrupoSelecionado(option.value)}
                  classNamePrefix="react-select"
                  styles={{
                    control: (base) => ({
                      ...base,
                      minHeight: '36px',
                      fontSize: '14px',
                      borderRadius: '5px',
                      maxWidth: '100%'
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isFocused ? '#f0f0f0' : 'white',
                      color: '#333',
                      maxWidth: '100%',
                      overflowWrap:'break-word'
                    }),
                    menu: (base) => ({
                      ...base,
                      zIndex: 100,
                      width: '100%',
                    }),
                  }}
                  isDisabled={grupos.length === 0}
                />
            </div>
            {mensagem && <span className="alert alert-danger msgErro" >{mensagem}</span>}
            <button className={`btn btn-md btn-success mt-3 btnEntrar`} type="submit">Criar Tarefa</button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
