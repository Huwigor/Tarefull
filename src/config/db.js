import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const URL_MONGO = process.env.MONGO_URL

const mongoDB = ()=>{
    mongoose.connect(URL_MONGO)
    .then(()=> console.log('conectado ao banco de dados'))
    .catch(err => console.error('erro ao se conectar ao banco de dados', err))    
} 

export default mongoDB