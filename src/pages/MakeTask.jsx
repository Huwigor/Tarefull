import '../css/makeTask.css'
import { useState, useEffect } from 'react';
import HeaderTasks from '../components/headerTasks'
import AllGroups from '../components/AllGroups'
import FormTarefas from '../components/formTarefas'
import FormGrupo from '../components/formGrupo'
import AllTasks from '../components/AllTasks'
import TaskProgress from '../components/TaskProgress'
import TaskEnd from '../components/TaskEnd'




export default function MakeTask(){

  const [componenteAtivo, setComponenteAtivo] = useState(false)

  const [abrirMenu, setAbrirMenu] = useState(false)

  const abrirFormTarefas = (e)=> {
     e.stopPropagation()
     if (!abrirMenu) {
      setFormGrupo(false);
      setAbrirMenu(true);
    } else {
      setAbrirMenu(false);
    }
  }

  const [menuTarefa, setMenuTarefa] = useState()

  const abrirMenuTarefa = (e)=>{
     e.stopPropagation()
     setMenuTarefa((prev)=>!prev)
  }

  const [menuGrupo, setMenuGrupo] = useState(false)

  const abrirMenuGrupo = (e)=>{
     e.preventDefault()
     setMenuGrupo( (prev) => !prev)
  }

  const [formGrupo, setFormGrupo] = useState(false)

  const abrirFormGrupo = (e)=>{
     e.preventDefault()
     if (!formGrupo) {
      setAbrirMenu(false);
      setFormGrupo(true);
    } else {
      setFormGrupo(false);
    }
  }


  const renderComponente = () => {
    switch (componenteAtivo) {
      case 'AllTasks':
        return <AllTasks />;
      case 'Grupos':
        return <AllGroups />;
      case 'EmAndamento':
        return <TaskProgress />;
      case 'Finalizadas':
      return <TaskEnd />;
      default:
        return <div>Escolha uma opção</div>;
    }}

    
    return(
        <>
          <HeaderTasks/>
          <FormTarefas 
            abrirMenu={abrirMenu} 
            fecharMenu={
              ()=>setAbrirMenu(false)
            }
          />
          <FormGrupo 
              openFormGrupo={formGrupo}
              fecharFormGrupo={
                ()=>setFormGrupo(false)
              }
          />
          <main style={{width:'100%', marginTop:'300px', display:'flex'}}>
              <div className={`menuOptions`}>
                <button className={`btnMenu`} onClick={abrirMenuTarefa}>Tarefa</button>
                <div className={menuTarefa ? 'menuGrupoOpen' : 'menuGrupo'}>
                   <button style={{marginTop:'15px', marginBottom:'10px'}} onClick={abrirFormTarefas}>Criar Tarefa</button>
                   <button style={{marginBottom:'15px'}} onClick={()=>setComponenteAtivo('AllTasks')}>Todas as Tarefas</button>
                </div>
                <div>
                 <button className='btnMenu' onClick={abrirMenuGrupo}>Grupos de Tarefas</button>
                 <div className={menuGrupo? 'menuGrupoOpen' : 'menuGrupo'}>
                    <button style={{marginTop:'15px', marginBottom:'10px'}} onClick={abrirFormGrupo}>Criar Grupo</button>
                    <button style={{marginBottom:'15px'}} onClick={()=>setComponenteAtivo('Grupos')}>Todos os Grupos</button>
                 </div>
                </div>
                <button className={`btnMenu`} onClick={()=>setComponenteAtivo('EmAndamento')}>Em andamento</button>
                <button className={`btnMenu`} onClick={()=>setComponenteAtivo('Finalizadas')}>Finalizadas</button>
              </div>
              <div className={`mainComponents`}>
                {renderComponente()}
              </div>
          </main>
        </>
    )
}