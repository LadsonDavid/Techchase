import { useEffect } from 'react'
import './App.css'
import AppRoutes from './AppRoutes'
import { useAuth } from './context/AuthContext'

function App() {
  const { user } = useAuth()
  
  useEffect(() => {
    console.log('Current user:', user)
  }, [user])

  return (
    <div className="app">
      <AppRoutes />
    </div>
  )
}

export default App
