import Select from 'react-select'
import { useState, useEffect } from "react";
import { useTheme } from '../Theme.jsx';

export default function SelectGroup({ groupData, onFilterChange }) {

  const { theme } = useTheme();
  const [grupoSelecionado, setGrupoSelecionado] = useState('allgroups');

  const gruposOrdenados = [...groupData].sort((a, b) => {
    if (a.tarefas.length > 0 && b.tarefas.length === 0) return -1;
    if (b.tarefas.length > 0 && a.tarefas.length === 0) return 1;
    return 0;
  });

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

  const opcoes = [
    { value: 'allgroups', label: 'Todos os Grupos' },
    ...groupData.map(grupo => ({
      value: grupo._id,
      label: grupo.nome
    }))
  ];

  const customStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: theme === 'dark' ? '#2f3030' : 'lightgray',
      borderColor: theme === 'dark' ? '#474849' : 'darkgray',
      boxShadow: 'none',
      fontFamily: "'Acme', sans-serif",
      fontSize: '14px',
      width: '100%',
      padding: '0px',
      '&:hover': {
        borderColor: '#888',
      },
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused
        ? theme === 'dark' ? '#424244' : '#9c9ea4'
        : state.isSelected
          ? theme === 'dark' ? 'darkgray' : 'black'
          : theme === 'dark' ? '#2f3030' : 'lightgray',
      color: theme === 'dark' ? '#a0a3ac' : '#2f3030',
      fontFamily: "'Acme', sans-serif",
      fontSize: '14px',
      padding: 10,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    }),
    menu: (base) => ({
      ...base,
      zIndex: 99,
      width: '100%',
    }),
    singleValue: (base) => ({
      ...base,
      color: theme === 'dark' ? '#a0a3ac' : '#2f3030',
      fontFamily: "'Acme', sans-serif",
      fontSize: '14px',
    }), 
};

  return (
    <div className="mainSelectGroup">
      <Select
        className='selectGroup'
        options={opcoes}
        styles={customStyles}
        value={opcoes.find(o => o.value === grupoSelecionado)}
        onChange={op => setGrupoSelecionado(op.value)}
        isDisabled={groupData.length === 0}
      />
    </div>
  );
}
