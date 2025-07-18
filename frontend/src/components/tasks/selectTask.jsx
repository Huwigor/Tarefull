import Select from 'react-select'
import {useTheme} from '../Theme.jsx'

export default function SelectAll({tarefasOrdenadas, tarefaSelecionada, setTarefaSelecionada}){
    
    const { theme } = useTheme();

    const opcoes = [
      { value: 'allgroups', label: 'Todas as Tarefas' },
      ...tarefasOrdenadas.map(t => ({ value: t._id, label: t.nome }))
    ];


    const customStyles = {
        control: (base) => ({
            ...base,
            width: '100%',
            backgroundColor: theme === 'dark' ? '#242425 ' : 'lightgray',
            borderColor: theme === 'dark' ? '#474849 ' : 'darkgray',
            padding: '0px',
            boxShadow: 'none',
            '&:hover': {
               borderColor: 'black',
            },
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isFocused
            ? theme === 'dark' ? '#3a3a3c' : '#9c9ea4'
            : state.isSelected
            ? theme === 'dark' ? 'darkgray' : 'black'
            : theme === 'dark' ? '#242425 ' : 'lightgray',
            color: theme === 'dark' ? '#a0a3ac' : '#2f3030',
            padding: 10,
            fontFamily: "'Acme', sans-serif",
            fontSize: '14px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
    }),
        menu: (base) => ({
            ...base,
            width: '100%',
            zIndex: 99,
        }),
        singleValue: (base) => ({
            ...base,
            color: theme === 'dark' ? '#a0a3ac' : '#2f3030',
            fontFamily: "'Acme', sans-serif",
            fontSize: '14px',
  }),
    };

    return(
        <Select
            className='selectGroup'
            options={opcoes}
            styles={customStyles}
            value={opcoes.find(o => o.value === tarefaSelecionada)}
            onChange={op => setTarefaSelecionada(op.value)}
            isDisabled={tarefasOrdenadas.length === 0}
        />
    )
}