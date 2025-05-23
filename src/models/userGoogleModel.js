import mongoose from 'mongoose'

const GoogleUser = new mongoose.Schema({
   
    nome: {
        type:String,
        required:true
    },
    email: {
        type:String,
        required:true
    },
    senha: {
        type:String,
        required:false
    },
    tipo: {
        type:String,
        required:true
    }
})

const usuarioGoogle = mongoose.model("User", GoogleUser)

export default usuarioGoogle