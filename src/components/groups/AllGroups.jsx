import { useEffect, useState } from "react"
import axios from "axios"
import '../../css/allGroups.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Trash2, Edit} from "lucide-react"
import Tasks from "../tasks/tasks.jsx"
import EditGroup from "./formEditGroup.jsx"
import DeleteGroup from "./formDeleteGroup.jsx"
import SelectGroup from "./inputSelectGroup.jsx"
import { getGrupo } from "../../services/groupServices.js"

export default function AllGroups(atualizarGrupo, atualizarTarefa) {

  const [grupoRef, setGrupoRef] = useState(null)
  const [classe, setClasse] = useState('allGroupHidden')
  const [reload, setReload] = useState(false)
  const [grupoEditado, setGrupoEditado] = useState(false)
  const [grupoDeletado, setGrupoDeletado] = useState(false)
  const [boxEditGroup, setBoxEditGroup] = useState(false)
  const [boxDeleteGroup, setBoxDeleteGroup] = useState(false)
  const [gruposFiltrados, setGruposFiltrados] = useState([]);
  const [tituloGrupo, setTituloGrupo] = useState("Todos os grupos"); 
  const [grupoSelecionado, setGrupoSelecionado] = useState('allgroups')
  const [grupos, setGrupos] = useState([])
 



  const formatarData = (data) => {
    const date = new Date(data);
    return isNaN(date.getTime()) ? "Data inválida" : date.toLocaleString("pt-BR");
  }



  const fetchData = async () => {
    try {
      const data = await getGrupo()
        setGrupos(Array.isArray(data) ? data : [])
        setClasse('allGroupShow')
    } catch (err) {
      console.error("Erro ao buscar grupos com tarefas:", err);
    }
  }




  useEffect(()=>{
    fetchData()
    setGrupoSelecionado("allgroups")
  },[
      reload, 
      atualizarGrupo, 
      atualizarTarefa, 
      grupoEditado, 
      grupoDeletado
    ]
  )



  return (
    <>
     <SelectGroup 
        onFilterChange={(filtrados, titulo)=>{
          setGruposFiltrados(filtrados)
          setTituloGrupo(titulo)
        }}  
        groupData={grupos}
      />
      <div 
        className={` col-12 ${classe}`}
      >
        {gruposFiltrados.length === 0 
          ? (<p style={{marginTop: '20px', marginLeft: '20px'}}>Não há grupos criados!</p>) 
          : (
            <>
              <h2 className="titleGroups" style={{marginTop:'30px', marginLeft:'20px', marginBottom:'20px'}}>{tituloGrupo}</h2>
                  {gruposFiltrados.map((grupo, index) => (
                    <div
                        key={grupo._id}
                        className={`grupos col-12`}
                      >
                        {grupoRef && (boxDeleteGroup || boxEditGroup ) && grupoRef._id === grupo._id && (<div className="overflowGroup"></div>)} 
                        {boxDeleteGroup && grupoRef && grupoRef._id === grupo._id && (
                          <DeleteGroup
                            grupoId={grupo._id}
                            nomeGrupo={grupo.nome}
                            fecharFormDelete={()=>setBoxDeleteGroup(false)}
                            grupoDeletado={()=>setGrupoDeletado(true)}
                          />
                      
                        )}
                        <div className="d-flex">
                          <div className="mainInfoGroup">
                            <div className="d-flex boxInfoGrupo">
                              <h3 className="tituloGrupo">{grupo.nome}</h3>
                              <button className="btnEditGroup" onClick={()=> {setBoxEditGroup(true); setGrupoRef(grupo);}}><Edit/></button>
                            </div>
                            {boxEditGroup && grupoRef && grupoRef._id === grupo._id && (     
                                <EditGroup 
                                  fecharFormEdit={()=>setBoxEditGroup(false)} 
                                  grupoId={grupo._id}
                                  nomeGrupo={grupo.nome} 
                                  grupoEditado={()=> setGrupoEditado((prev)=>!prev)}
                                />
                            )}
        
                          </div>
                            <button className="ms-auto btn btn-sm btn-danger btnDeleteGroup" onClick={()=> {setBoxDeleteGroup(true); setGrupoRef(grupo);}}><Trash2/></button>
                        </div>
                      {grupo.tarefas.length === 0 ? (
                          <p style={{marginTop: '20px', marginLeft: '20px'}}>O grupo {grupo.nome} não possui tarefas criadas!</p>
                        ) : (
                          <div className="taskGroup">
                            {grupo.tarefas.map((tarefa) => (
                            <Tasks
                              tarefa={tarefa}
                              index={index}
                              atualizarGrupos={fetchData}
                            />
                            ))}
                          </div>
                        )}       
                    </div>
                  ))}
            </>
          )
        }
        </div>
    
    </>
  );
}
