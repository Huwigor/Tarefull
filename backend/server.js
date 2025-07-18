import express from 'express'
import http from 'http';
import session from 'express-session'
import passport from 'passport'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import mongoDB from './src/config/db.js'
import './src/config/passportConfig.js'
import MongoStore from "connect-mongo";

import KeepAlive from './src/routes/pingKeepAlive.js'
import cookieUser from './src/routes/userRoutes/cookieUserRoute.js'
import authGoogleRoutes from './src/routes/userRoutes/googleRegisterRoute.js'

import UserSession from './src/routes/userRoutes/userSessionRoutes.js'
import UserRecovery from './src/routes/userRoutes/userRecoveryRoutes.js'
import UserRegister from './src/routes/userRoutes/userRegisterRoutes.js'

import GetData from './src/routes/getDataRoutes.js';
import GroupRoutes from './src/routes/groupRoutes.js';
import TasksRoutes from './src/routes/tasksRoutes.js';
import SubTaskRoutes from './src/routes/subTasksRoutes.js';


dotenv.config()
mongoDB()

const app = express()
const server = http.createServer(app);


const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URL
  }),
  cookie: {
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 24 * 30
  }
});

app.use(cors({
    origin: "https://tarefull.netlify.app", 
    credentials: true
}))


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.use(sessionMiddleware)
app.use(passport.initialize())
app.use(passport.session())

app.use('/api/keepAlive', KeepAlive)

app.use('/api/getData/', GetData)
app.use('/api/group/', GroupRoutes)
app.use('/api/subTask/', SubTaskRoutes)
app.use('/api/task/', TasksRoutes )

app.use('/api/userSession/', UserSession)
app.use('/api/userRecovery/', UserRecovery)
app.use('/api/userRegister/', UserRegister)

app.use("/auth", authGoogleRoutes);
app.use('/api/cookieUser', cookieUser)


const PORT = process.env.PORT || 5000
server.listen(PORT, ()=> {
    console.log('servidor rodando!')
})


