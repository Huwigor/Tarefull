import axios from "axios";
import { useState } from "react";

export default function StatusSubTask({subTarefaId, subTarefas, atualizarStatus}){

    const [statusUpdateState, setStatusUpdateState] = useState({})
    const SUBTASK_ROUTES = import.meta.env.VITE_SUBTASK_ROUTES
    const statusList = ['pendente', 'concluido']

    const alternarStatus = async () => {
        const now = Date.now()
    
        setStatusUpdateState(prev => {
        const prevEntry = prev[subTarefaId] || {
            count: 0,
            windowReset: now + 10000,
            blocked: false,
            remaining: 0,
            interval: null,
        }
    
        if (now > prevEntry.windowReset) {
        return {
            ...prev,
            [subTarefaId]: {
            ...prevEntry,
            count: 0,
            windowReset: now + 10000,
            }
        }
        }
    
        if (prevEntry.blocked) {
            return prev;
        }
    
        if (prevEntry.count >= 2) {
          const interval = setInterval(() => {
            setStatusUpdateState(current => {
              const currentEntry = current[subTarefaId];
              if (!currentEntry) return current;
    
              if (currentEntry.remaining <= 1) {
                clearInterval(currentEntry.interval);
                return {
                  ...current,
                  [subTarefaId]: {
                    ...currentEntry,
                    blocked: false,
                    count: 0,
                    remaining: 0,
                    interval: null,
                    windowReset: Date.now() + 10000,
                  }
                }
              }
    
              return {
                ...current,
                [subTarefaId]: {
                  ...currentEntry,
                  remaining: currentEntry.remaining - 1
                }
              }
            })
          }, 1000);
    
          return {
            ...prev,
            [subTarefaId]: {
              ...prevEntry,
              blocked: true,
              remaining: 10,
              interval: interval
            }
          };
        }
    
        return {
          ...prev,
          [subTarefaId]: {
            ...prevEntry,
            count: prevEntry.count + 1
          }
        }
      })
    
      const subState = statusUpdateState[subTarefaId];
      if (subState?.blocked) {
        return;
      }
    
      const sub = subTarefas
      if (!sub) return;

      const statusAtualIndex = statusList.indexOf(sub.subTaskStatus);
      const proximoStatus = statusList[(statusAtualIndex + 1) % statusList.length];
    
      try {
        await axios.put(
          `${SUBTASK_ROUTES}status`,
          { 
            status: proximoStatus,
            subTarefaId: subTarefaId
          },
          { withCredentials: true }
        );
    
        atualizarStatus()
    
      } catch (error) {
        console.error('Erro ao atualizar status:', error.response?.data || error.message);
      }
    };
    


    return(

         <button
            disabled={statusUpdateState[subTarefaId]?.blocked}
            onClick={() => alternarStatus(subTarefaId)}
            className={`
                ${subTarefas.subTaskStatus === 'concluido' ? 'btn btn-md btn-success' : 'btn btn-md btn-primary'}
                btnStatusSub
                ${statusUpdateState[subTarefaId]?.blocked ? 'btn-blocked' : ''}
            `}
            >
            {statusUpdateState[subTarefaId]?.blocked 
                ? `Aguarde ${statusUpdateState[subTarefaId]?.remaining}s`
                : subTarefas.subTaskStatus}
        </button>
    )
}