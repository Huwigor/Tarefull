import mongoose from 'mongoose'
import { Types } from 'mongoose'

const TarefaModel = mongoose.Schema({
    nome: { type: String, required: true },
    dataHora: { type: Date, required: true },
    dataCadastro: { type: Date, required: true},
    grupoId: { type: String, required: true },
    subTarefa: [
        {
            _id: { type: mongoose.Schema.Types.ObjectId, default: () => new Types.ObjectId() },
            descricao: String,
            subTaskStatus: { type: String, enum: ['pendente', 'concluido'], default: 'pendente' },
        }
    ],
    usuarioEmail:{type:String, required:true},
    criadoEm: { type: Date, default: Date.now },
})


const userTarefa = mongoose.model('Tarefa', TarefaModel)

export default userTarefa