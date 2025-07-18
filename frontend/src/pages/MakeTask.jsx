import '../css/makeTask.css'
import { useState } from 'react';
import { ArrowRightFromLine, ArrowLeftToLine, ChevronDown } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css'
import HeaderTasks from '../components/headerTasks'
import AllGroups from '../components/groups/AllGroups'
import FormTarefas from '../components/tasks/formAddTask'
import FormGrupo from '../components/groups/formAddGroup'
import AllTasks from '../components/tasks/AllTasks'
import TaskProgress from '../components/tasks/TaskProgress'
import TaskEnd from '../components/tasks/TaskEnd'




export default function MakeTask(){

  const [componenteAtivo, setComponenteAtivo] = useState(false)
  const [atualizarGrupo, setAtualizarGrupo] = useState(false)
  const [atualizarTarefa, setAtualizarTarefa] = useState(false)



  const [overflowMain, setOverflowMain] = useState(false)
  const [mainMenuOpen, setMainMenuOpen] = useState(false)
  function abrirMainMenu(e){
  e.preventDefault()
  setMainMenuOpen((prev)=>{
    const novoEstado = !prev
    setOverflowMain(novoEstado)
    setMenuTarefa(false)
    setMenuGrupo(false) 
    return novoEstado
  })
}



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
        return <AllTasks atualizarTarefa={atualizarTarefa} />;
      case 'Grupos':
        return <AllGroups atualizarTarefa={atualizarTarefa} atualizarGrupo={atualizarGrupo}/>;
      case 'EmAndamento':
        return <TaskProgress atualizarTarefa={atualizarTarefa} />;
      case 'Finalizadas':
      return <TaskEnd atualizarTarefa={atualizarTarefa} />;
      default:
        return <AllTasks atualizarTarefa={atualizarTarefa} />;
    }}

    
    return(
        <>
          <HeaderTasks/>
          <FormTarefas 
            abrirMenu={abrirMenu} 
            fecharMenu={
              ()=>setAbrirMenu(false)
            }
            onTarefaCriada = {()=> setAtualizarTarefa(prev=>!prev)}
          />
          <FormGrupo 
              openFormGrupo={formGrupo}
              fecharFormGrupo={
                ()=>setFormGrupo(false)
              }
              onGrupoCriado = {()=> setAtualizarGrupo(prev => !prev)}
          />
          <div className='mainMenu'>
          {mainMenuOpen 
            ? 
              (<button className={mainMenuOpen ? 'btnMenuOpen' : 'btnMenuAll'} onClick={abrirMainMenu}><ArrowLeftToLine className='arrowMenu' /></button>) 
            : 
              (<button className={mainMenuOpen ? 'btnMenuOpen' : 'btnMenuAll'} onClick={abrirMainMenu}><ArrowRightFromLine className='arrowMenu' /></button>)
          }
          
          <main className={mainMenuOpen ? 'mainMenuOptionShow' : 'mainMenuOptionHidden'}>
              <div className={`menuOptions`}>
                <button className={`btnMenu`} onClick={abrirMenuTarefa}>Tarefa <ChevronDown style={{color:'rgb(49, 46, 46)'}} className={`chevron-icon ${menuTarefa ? 'rotated' : ''}`} /></button>

                <div className={menuTarefa ? 'menuGrupoOpen' : 'menuGrupo'}>
                   <button style={{marginTop:'15px', marginBottom:'10px'}} onClick={abrirFormTarefas}>Criar Tarefa</button>
                   <button style={{marginBottom:'15px'}} onClick={()=>{setComponenteAtivo('AllTasks'); setMainMenuOpen(false); setOverflowMain(false);}}>Todas as Tarefas</button>
                </div>

                <div>
                 <button className='btnMenu' onClick={abrirMenuGrupo}>Grupos de Tarefas <ChevronDown style={{color:'rgb(49, 46, 46)'}} className={`chevron-icon ${menuGrupo ? 'rotated' : ''}`} /></button>
                 <div className={menuGrupo? 'menuGrupoOpen' : 'menuGrupo'}>
                    <button style={{marginTop:'15px', marginBottom:'10px'}} onClick={abrirFormGrupo}>Criar Grupo</button>
                    <button style={{marginBottom:'15px'}} onClick={()=>{setComponenteAtivo('Grupos'); setMainMenuOpen(false); setOverflowMain(false);}}>Todos os Grupos</button>
                 </div>
                </div>

                <button className={`btnMenu`} onClick={()=>{setComponenteAtivo('EmAndamento'); setMainMenuOpen(false); setOverflowMain(false);}}>Em andamento</button>
                <button className={`btnMenu`} onClick={()=>{setComponenteAtivo('Finalizadas'); setMainMenuOpen(false); setOverflowMain(false);}}>Finalizadas</button>
              </div>
          </main>
          </div>
          <div className={`mainComponents`}>
            <div className={overflowMain ? 'showOverflowMain' : 'closeOverflowMain'}></div>
            {renderComponente()}
          </div>
        </>
    )
}