import { useState, useEffect } from "react";

export default function SelectGroup({groupData, onFilterChange}){
   
  const [grupoSelecionado, setGrupoSelecionado] = useState('allgroups')
  
  const gruposOrdenados = [...groupData].sort((a, b) => {
    if (a.tarefas.length > 0 && b.tarefas.length === 0) return -1;
    if (b.tarefas.length > 0 && a.tarefas.length === 0) return 1;
    return 0;
  })


  const gruposFiltrados = grupoSelecionado === "allgroups"
    ? gruposOrdenados
    : gruposOrdenados.filter(grupo => grupo._id === grupoSelecionado);



  let tituloGrupo = "Todos os grupos";
  if (grupoSelecionado !== "allgroups") {
    const grupoEscolhido = groupData.find(t => t._id === grupoSelecionado);
    if (grupoEscolhido) {
      tituloGrupo = 'Grupo ' + grupoEscolhido.nome;
    }
  } 
  
  

   useEffect(() => {
    onFilterChange(gruposFiltrados, tituloGrupo);
  }, [grupoSelecionado, groupData]);


    return(
        <div className="mainSelectGroup">
            <select 
                name="grupos" 
                id="grupos"
                disabled={gruposFiltrados.length === 0}
                value={grupoSelecionado}
                onChange={(e)=>setGrupoSelecionado(e.target.value)}
            >
                <option value='allgroups'>Todos os Grupos</option>
                {groupData.map((grupo)=>(
                    <option key={grupo._id} value={grupo._id}>{grupo.nome}</option>
                ))}
            </select>
        </div>
    )
}