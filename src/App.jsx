import { Routes, Route } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import Dashboard from './pages/Dashboard'
import Clientes from './pages/Clientes'
import Ventas from './pages/Ventas'
import HistorialVentas from './pages/HistorialVentas'

function App() {
  return (
    <div className="app">
      <div className="page-wrapper">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/ventas" element={<Ventas />} />
          <Route path="/historial/:clienteId" element={<HistorialVentas />} />
        </Routes>
      </div>
      <BottomNav />
    </div>
  )
}

export default App