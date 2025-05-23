import express from 'express'
import Grupo from '../models/modelGrupo.js'
import CryptoJS from 'crypto-js'

const router = express.Router()

router.post('/', async (req, res) => {

    try{

        const cookiecriptografado = req.cookies.sessao_usuario

        if(!cookiecriptografado){
            return res.status(401).json({
                mensagem: 'não autorizado'
            })
        }

        const bytes = CryptoJS.AES.decrypt(cookiecriptografado, process.env.COOKIE_SECRET_USER)
        const dadosUsuarios = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))

        const {nome}= req.body

        const novoGrupo = new Grupo({
            nome,
            emailUser:dadosUsuarios.email
        })

        await novoGrupo.save()

        res.status(200).json({mensagem: 'grupo criado com sucesso!'})
    } catch (err){
        console.error("erro ao criar grupo", err.message)
        return res.status(500).json({mensagem: 'erro interno ao criar grupo!'})
    }
})

export default router