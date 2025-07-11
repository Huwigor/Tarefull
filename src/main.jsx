import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {RouterProvider} from 'react-router-dom'
import { ThemeProvider } from './components/Theme.jsx'
import router from './routes/loaderRoutes.jsx'

createRoot(document.getElementById('root')).render(

    <ThemeProvider>
      <StrictMode>
        <RouterProvider router={router}/>
      </StrictMode>
    </ThemeProvider>
 
)
