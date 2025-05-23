import mongoose from 'mongoose'

const TarefaModel = mongoose.Schema({
    nome: { type: String, required: true },
    dataHora: { type: Date, required: true },
    grupoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Grupo', required: true },
    detalhes: { type: String },
    criadoEm: { type: Date, default: Date.now },
    usuarioEmail: { type: String, required: true }
})


const userTarefa = mongoose.model('Tarefa', TarefaModel)

export default userTarefa