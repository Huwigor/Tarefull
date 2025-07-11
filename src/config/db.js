import mongoose from 'mongoose'

const mongoDB = ()=>{
    mongoose.connect('mongodb://localhost:27017/tarefull')
    .then(()=> console.log('conectado ao banco de dados'))
    .catch(err => console.error('erro ao se conectar ao banco de dados', err))    
} 

export default mongoDB