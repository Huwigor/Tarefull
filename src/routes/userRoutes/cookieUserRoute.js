import CryptoJS from "crypto-js";
import express from 'express'

const router = express.Router()

router.get("/", (req, res) => {
    const cookie = req.cookies.sessao_usuario
    
    if(!cookie){
        return res.status(401).json({ error: "Cookie não encontrado" });
    }
    
    try{
        const decrypted = CryptoJS.AES.decrypt(cookie, process.env.COOKIE_SECRET_USER).toString(CryptoJS.enc.Utf8)
        const userData = JSON.parse(decrypted);
        return res.status(200).json(userData)
    } catch(err){
       return res.status(400).json({ error: "Cookie inválido" });
    }
})

export default router