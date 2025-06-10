import express from 'express'
import EmailQueue from '../../models/emailQueueModel.js'; 
import Usuario from '../../models/userModel.js'
import mongoDB from '../../config/db.js';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import validator from 'validator'

mongoDB()
const router = express.Router()

router.post('/', async (req, res) =>{

    const {senha, token} = req.body
    
    try {

        const decoded = jwt.decode(token);

        if (!decoded || !decoded.email) {
            return res.status(400).json({ message: 'Token inválido!' });
        }

        const isValidPassword = validator.isStrongPassword(senha, {
            minLength: 8,
            maxLength: 50,
            minLowercase: 0,  
            minUppercase: 1,   
            minNumbers: 0,     
            minSymbols: 1      
        });

        if (!isValidPassword) {
            return res.status(400).json({
                message: 'A senha deve ter entre 8 a 50 caracteres, uma letra maiúscula e um símbolo!'
            });
        }

        const { nome, email } = decoded;

        const tokenEmail = await EmailQueue.findOne({ email });

        if (!tokenEmail) {
            return res.status(404).json({ message: 'Token não encontrado para este email!' });
        }

        if (token !== tokenEmail.tokenJwt) {
            return res.status(401).json({ message: 'Token não corresponde ao salvo no servidor!' });
        }

        try {
            jwt.verify(token, process.env.JWT_SECRET);
            console.log('Token válido.');
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                console.log('Token expirado, gerando novo token...');

                const novoToken = jwt.sign(
                    { nome, email },
                    process.env.JWT_SECRET,
                    { expiresIn: '1h' }
                );

                await EmailQueue.updateOne(
                    { email },
                    { $set: { tokenJwt: novoToken } }
                );

                console.log('Novo token gerado e atualizado no banco.');
            } else {
                return res.status(401).json({ message: 'Token inválido!' });
            }
        }


        const hashedPassword = await bcrypt.hash(senha, 10);

        const novoUsuario = await Usuario.create({
            nome,
            email,
            senha: hashedPassword,
            tipo:'usuarioComum',
            googleId: null,
        });
        
        const authToken = jwt.sign(
            { nome: novoUsuario.nome, email: novoUsuario.email },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );
        
        const tokenExpiry = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
        novoUsuario.authToken = authToken;
        novoUsuario.authTokenExpiry = tokenExpiry;
        await novoUsuario.save();

        await EmailQueue.deleteOne({email})
        

        res.status(201).json({ message: 'Usuário criado com sucesso!', usuario: novoUsuario });

    } catch (error) {
        console.error('Erro no cadastro de usuário:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
  
})

export default router