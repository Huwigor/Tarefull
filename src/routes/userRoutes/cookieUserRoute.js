import CryptoJS from "crypto-js";
import express from 'express'

const router = express.Router()

router.get("/", (req, res) => {
    const cookie = req.cookies.sessao_usuario
    
    if(!cookie){
        return 
    }
    
    try{
        const decrypted = CryptoJS.AES.decrypt(cookie, process.env.COOKIE_SECRET_USER).toString(CryptoJS.enc.Utf8)
        const userData = JSON.parse(decrypted);
        res.json(userData);
    } catch(err){
        res.status(400).json({mensagen: 'erro ao decodificar cookie'})
    }
})

export default router