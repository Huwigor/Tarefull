import CryptoJS from "crypto-js"
import User from '../models/userModel.js'

const authMiddleware = async (req, res, next)=>{
    try{

        const cookie = req.cookies.sessao_usuario

        if(!cookie){
            return res.status(400).json({erro: 'Cookie ausente!'})
        }

        const decryptedCookie = CryptoJS.AES.decrypt(cookie, process.env.COOKIE_SECRET_USER).toString(CryptoJS.enc.Utf8)

        if(!decryptedCookie){
            return res.status(401).json({error: 'Cookie inválido!'})
        }

        const decryptedData = JSON.parse(decryptedCookie)


        const user = await User.findById(decryptedData._id)

        if(!user){
            return res.status(401).json({error: 'Usuario não encontrado!'})
        }
        
        req.user = {
            userId: user._id,
            userEmail: user.email
        }

        next()


    }catch(err){
        console.error('[AuthMiddleware Error]', err)
        return res.status(500).json({error: 'Erro funcional do servidor!'})
    }
}


export default authMiddleware
