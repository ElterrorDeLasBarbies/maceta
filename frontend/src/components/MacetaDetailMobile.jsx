import { useState, useEffect } from 'react'
import { Droplets, Thermometer, Wind, Clock, Activity, RefreshCw } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const API_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? '/api' : 'http://localhost:3000/api')

export default function MacetaDetail({ maceta, onRegar, isModal = true }) {
  const [historial, setHistorial] = useState([])
  const [riegos, setRiegos] = useState([])
  const [loading, setLoading] = useState(true)
  const [periodo, setPeriodo] = useState(24)
  const [duracionRiego, setDuracionRiego] = useState(5)

  useEffect(() => {
    fetchData()
  }, [maceta.id, periodo])

  const fetchData = async () => {
    try {
      setLoading(true)
      const resLecturas = await fetch(`${API_URL}/macetas/${maceta.id}/datos?hours=${periodo}`)
      const dataLecturas = await resLecturas.json()
      
      const resRiegos = await fetch(`${API_URL}/riego/${maceta.id}/historial?limit=5`)
      const dataRiegos = await resRiegos.json()
      
      setHistorial(dataLecturas.data || [])
      setRiegos(dataRiegos.data || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const chartData = historial
    .slice()
    .reverse()
    .map(item => ({
      fecha: new Date(item.timestamp).toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      'Humedad Suelo': parseFloat(item.humedad_suelo.toFixed(1)),
      'Temperatura': parseFloat(item.temperatura.toFixed(1)),
      'H. Ambiente': parseFloat(item.humedad_ambiente.toFixed(1))
    }))

  const estadoActual = maceta.estado || {}
  const humedadSuelo = estadoActual.humedad_suelo || 50
  const temperatura = estadoActual.temperatura || 0
  const humedadAmbiente = estadoActual.humedad_ambiente || 0

  const getHumedadColor = (valor) => {
    if (valor >= 60) return 'text-green-600 bg-green-50'
    if (valor >= 40) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  const getTempColor = (valor) => {
    if (valor < 15) return 'text-blue-600 bg-blue-50'
    if (valor < 25) return 'text-green-600 bg-green-50'
    if (valor < 30) return 'text-orange-600 bg-orange-50'
    return 'text-red-600 bg-red-50'
  }

  return (
    <div className="space-y-4">
      {/* Tarjeta de información principal */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{maceta.nombre}</h2>
            <p className="text-sm text-gray-500">{maceta.ubicacion}</p>
          </div>
          <button
            onClick={fetchData}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <RefreshCw className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Métricas principales - Grid responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Temperatura */}
          <div className={`${getTempColor(temperatura)} rounded-lg p-4`}>
            <div className="flex items-center gap-2 mb-2">
              <Thermometer className="w-5 h-5" />
              <span className="text-sm font-medium">Temperatura</span>
            </div>
            <div className="text-3xl font-bold">{temperatura.toFixed(1)}°C</div>
          </div>

          {/* Humedad Ambiente */}
          <div className="bg-blue-50 text-blue-600 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Wind className="w-5 h-5" />
              <span className="text-sm font-medium">Humedad</span>
            </div>
            <div className="text-3xl font-bold">{humedadAmbiente.toFixed(1)}%</div>
          </div>

          {/* Humedad Suelo */}
          <div className={`${getHumedadColor(humedadSuelo)} rounded-lg p-4`}>
            <div className="flex items-center gap-2 mb-2">
              <Droplets className="w-5 h-5" />
              <span className="text-sm font-medium">H. Suelo</span>
            </div>
            <div className="text-3xl font-bold">{humedadSuelo.toFixed(1)}%</div>
          </div>
        </div>
      </div>

      {/* Control de Riego */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-900 mb-3">💧 Control de Riego</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="block text-sm text-gray-600 mb-2">Duración (segundos)</label>
            <input
              type="number"
              value={duracionRiego}
              onChange={(e) => setDuracionRiego(Math.max(1, parseInt(e.target.value) || 5))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              min="1"
              max="60"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => onRegar(duracionRiego)}
              className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg"
            >
              Regar Ahora
            </button>
          </div>
        </div>
      </div>

      {/* Selector de periodo */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { value: 24, label: '24h' },
          { value: 168, label: '7d' },
          { value: 720, label: '30d' }
        ].map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setPeriodo(value)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              periodo === value
                ? 'bg-green-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      ) : (
        <>
          {/* Gráfica de Temperatura */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Thermometer className="w-5 h-5 text-orange-500" />
              Temperatura
            </h3>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="fecha" 
                    fontSize={11}
                    stroke="#666"
                  />
                  <YAxis 
                    fontSize={11}
                    stroke="#666"
                    domain={[15, 35]}
                  />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="Temperatura" 
                    stroke="#f97316" 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-400 py-8 text-sm">Sin datos</p>
            )}
          </div>

          {/* Gráfica de Humedad Ambiente */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Wind className="w-5 h-5 text-blue-500" />
              Humedad Ambiente
            </h3>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="fecha" 
                    fontSize={11}
                    stroke="#666"
                  />
                  <YAxis 
                    fontSize={11}
                    stroke="#666"
                    domain={[0, 100]}
                  />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="H. Ambiente" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-400 py-8 text-sm">Sin datos</p>
            )}
          </div>

          {/* Historial de Riegos */}
          {riegos.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-500" />
                Últimos Riegos
              </h3>
              <div className="space-y-2">
                {riegos.map((riego, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-600">
                        {new Date(riego.timestamp).toLocaleString('es-ES', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {riego.duracion}s
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
