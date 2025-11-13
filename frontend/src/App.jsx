import { useState, useEffect } from 'react'
import MacetaDetailMobile from './components/MacetaDetailMobile'
import './index.css'

// En producción usa rutas relativas, en desarrollo usa localhost
const API_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? '/api' : 'http://localhost:3000/api')
const MACETA_ID = 'e74bd846-59e4-4f7b-aa4d-5478dd8c31fd'

function App() {
  const [maceta, setMaceta] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Cargar datos al iniciar
  useEffect(() => {
    fetchMaceta()
    // Actualizar cada 10 segundos
    const interval = setInterval(fetchMaceta, 10000)
    return () => clearInterval(interval)
  }, [])

  const fetchMaceta = async () => {
    try {
      // Obtener info básica de la maceta
      const response = await fetch(`${API_URL}/macetas/${MACETA_ID}`)
      if (!response.ok) throw new Error('Error al cargar maceta')
      const result = await response.json()
      
      // Obtener estado actual
      const estadoRes = await fetch(`${API_URL}/macetas/${MACETA_ID}/estado`)
      const estadoData = await estadoRes.json()
      
      // Extraer datos de la última lectura
      const ultimaLectura = estadoData.data?.ultima_lectura || {}
      
      setMaceta({
        ...result.data,
        estado: ultimaLectura
      })
      setError(null)
    } catch (err) {
      console.error('Error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleRegar = async (duracion = 5) => {
    try {
      const response = await fetch(`${API_URL}/riego/activar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ maceta_id: MACETA_ID, duracion }),
      })
      
      if (!response.ok) throw new Error('Error al activar riego')
      
      await fetchMaceta()
      alert('✓ Riego activado exitosamente')
    } catch (err) {
      console.error('Error:', err)
      alert('✗ Error al activar riego: ' + err.message)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header Mobile-First */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🌱</span>
              </div>
              <div>
                <h1 className="text-lg md:text-xl font-bold text-gray-900">Mi Planta</h1>
                <p className="text-xs text-gray-500 hidden sm:block">Riego Inteligente</p>
              </div>
            </div>
            <button
              onClick={fetchMaceta}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Actualizar"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6 max-w-2xl">
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            <p className="font-medium text-sm">⚠️ Error de conexión</p>
            <p className="text-xs mt-1">{error}</p>
          </div>
        )}
        
        {!loading && !error && maceta && (
          <MacetaDetailMobile 
            maceta={maceta}
            onRegar={handleRegar}
            isModal={false}
          />
        )}
      </main>
    </div>
  )
}

export default App
