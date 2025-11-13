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
  const [retryCount, setRetryCount] = useState(0)
  const [pollInterval, setPollInterval] = useState(300000) // 5 minutos (300000 ms)

  // Cargar datos al iniciar con intervalo dinámico
  useEffect(() => {
    fetchMaceta()
    
    // Intervalo que se ajusta según los errores
    const interval = setInterval(fetchMaceta, pollInterval)
    return () => clearInterval(interval)
  }, [pollInterval])

  const fetchMaceta = async () => {
    try {
      // Obtener info básica de la maceta
      const response = await fetch(`${API_URL}/macetas/${MACETA_ID}`)
      
      // Manejar rate limiting (429)
      if (response.status === 429) {
        const newRetryCount = retryCount + 1
        setRetryCount(newRetryCount)
        
        // Aumentar intervalo exponencialmente: 5min -> 10min -> 15min
        const newInterval = Math.min(300000 * Math.pow(2, newRetryCount), 900000) // máximo 15 min
        setPollInterval(newInterval)
        
        console.warn(`Rate limit alcanzado. Aumentando intervalo a ${newInterval/60000} minutos`)
        throw new Error('Demasiadas peticiones. Reduciendo frecuencia...')
      }
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }
      
      const result = await response.json()
      
      // Obtener estado actual
      const estadoRes = await fetch(`${API_URL}/macetas/${MACETA_ID}/estado`)
      
      if (estadoRes.status === 429) {
        const newRetryCount = retryCount + 1
        setRetryCount(newRetryCount)
        
        const newInterval = Math.min(300000 * Math.pow(2, newRetryCount), 900000) // máximo 15 min
        setPollInterval(newInterval)
        
        console.warn(`Rate limit alcanzado. Aumentando intervalo a ${newInterval/60000} minutos`)
        throw new Error('Demasiadas peticiones. Reduciendo frecuencia...')
      }
      
      if (!estadoRes.ok) {
        console.warn('Error obteniendo estado, usando datos básicos')
      }
      
      const estadoData = estadoRes.ok ? await estadoRes.json() : { data: {} }
      
      // Extraer datos de la última lectura
      const ultimaLectura = estadoData.data?.ultima_lectura || {}
      
      setMaceta({
        ...result.data,
        estado: ultimaLectura
      })
      setError(null)
      
      // Éxito: resetear contador y volver al intervalo normal
      if (retryCount > 0) {
        setRetryCount(0)
        setPollInterval(300000) // Volver a 5 minutos
        console.log('Conexión restablecida. Intervalo normalizado a 5 minutos')
      }
    } catch (err) {
      console.error('Error fetching maceta:', err)
      setError(err.message)
      
      // Si hay demasiados errores consecutivos, aumentar aún más el intervalo
      if (retryCount >= 3) {
        setPollInterval(900000) // 15 minutos si hay muchos errores
        console.warn('Múltiples errores consecutivos. Intervalo aumentado a 15 minutos')
      }
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
