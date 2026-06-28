
import { ToastContainer } from 'react-toastify'
import HomePage from './pages/HomePage'
import { Routes } from 'react-router-dom'
import { Route } from 'lucide-react'

const App = () => {
  return (
    <div className='bg-[#ffffff]'>
      <ToastContainer/>
      <Routes>
        <Route/>
      </Routes>
      <HomePage/>
      
    </div>
  )
} 

export default App
