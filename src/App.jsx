
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import {Routes, Route} from 'react-router-dom'
import PrivateRoute from './routes/privateRoutes.jsx'
import Home from './pages/Home.jsx'
import Register from './pages/UserRegister.jsx'
import LoginUser from './pages/loginUser.jsx'
import MakeTask from './pages/MakeTask.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import ResetPassword from './pages/ResetPassword.jsx'

function App() {

  return (
    <>
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/registerUser' element={<Register/>} />
      <Route path='/loginUser' element={<LoginUser/>}></Route>
      <Route path="/makeTask" element={<PrivateRoute><MakeTask/></PrivateRoute>}></Route>
      <Route path="/forgotPassword" element={<ForgotPassword />} />
      <Route path="/resetPassword/:token" element={<ResetPassword />} />
    </Routes>
      
    </>
  )
}

export default App
