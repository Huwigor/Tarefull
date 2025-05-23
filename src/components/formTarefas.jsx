import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import '../css/makeTask.css';
import axios from 'axios'
import Swal from 'sweetalert2'

export default function FormTarefas({ abrirMenu, fecharMenu }) {
  const [tempo, setTempo] = useState("");
  const [grupos, setGrupos] = useState([]);
  const [grupoSelecionado, setGrupoSelecionado] = useState("");

  const [nome, setNome] = useState('')
  const [detalhes, setDetalhes] = useState('')

  const HandleChange = (e) => {
    setTempo(e.target.value);
  };


  useEffect(() => {
    const buscarGrupos = async () => {
      if(!abrirMenu) return
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_ROUTE_SERVER}/inputGrupos`,
          { withCredentials: true }
        );
        setGrupos(res.data);
      } catch (err) {
        console.error("Erro ao buscar grupos:", err);
      }
    };

    buscarGrupos();
  }, [abrirMenu]);

  const handleSubmit = async (e)=>{
    e.preventDefault()

    try{
      const res = await axios.post(`${import.meta.env.VITE_ROUTE_SERVER}/api/criarTarefa`,{
        nome,
        tempo,
        grupoId: grupoSelecionado,
        detalhes
      }, {withCredentials:true})

      Swal.fire({
        title: 'Tarefa Adicionada!',
        icon: 'success',
        confirmButtonText: 'OK'
      })
      setNome('')
      setDetalhes('')
      setGrupoSelecionado('')
      setTempo('')
      console.log('tarefa criada', res.data)
    }catch(err){
      console.error('erro ao criar tarefa', err)
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
          className={styles.formContainer}
        >
          <form className='formTarefas' onSubmit={handleSubmit}>
            <button 
                style={{height:'40px', fontSize: '24px', marginRight: '30px', marginBottom:'20px'}}
                type="button" 
                className={`btn btn-sm btn-close btn-danger ms-auto`} 
                onClick={fecharMenu}>
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
              <p>Data / Hora</p>
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
              <option value="">Selecione um Grupo</option>
              {grupos.map((grupo) => (
                <option key={grupo._id} value={grupo._id}>
                  {grupo.nome}
                </option>
              ))}
            </select>
            <textarea
              name="detalhes"
              id="detalhes"
              value={detalhes}
              onChange={(e)=>setDetalhes(e.target.value)}
              placeholder="Detalhes"
            >
            </textarea>
            <button className={`btn btn-md btn-success mt-3`} type="submit">Criar Tarefa</button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
