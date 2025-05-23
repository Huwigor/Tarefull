import mongoose from 'mongoose'

const MakeGrupo = mongoose.Schema({
    nome:{
        type:String,
        unique:true,
        required:true
    },
    criadoEm: {
       type:Date,
       default:Date.now
    }
})


const Grupo = mongoose.model('Grupo', MakeGrupo)

export default Grupo