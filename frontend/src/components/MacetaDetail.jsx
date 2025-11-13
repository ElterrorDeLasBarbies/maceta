import { useState, useEffect } from 'react'
import { Droplets, TrendingUp, Clock, Activity, Wind } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export default function MacetaDetail({ maceta, onClose, onRegar, isModal = true }) {
  const [historial, setHistorial] = useState([])
  const [riegos, setRiegos] = useState([])
  const [loading, setLoading] = useState(true)
  const [periodo, setPeriodo] = useState(24) // horas
  const [duracionRiego, setDuracionRiego] = useState(5)

  useEffect(() => {
    fetchData()
  }, [maceta.id, periodo])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Obtener historial de lecturas
      const resLecturas = await fetch(`${API_URL}/macetas/${maceta.id}/datos?hours=${periodo}`)
      const dataLecturas = await resLecturas.json()
      
      // Obtener historial de riegos
      const resRiegos = await fetch(`${API_URL}/riego/${maceta.id}/historial?limit=10`)
      const dataRiegos = await resRiegos.json()
      
      setHistorial(dataLecturas.data || [])
      setRiegos(dataRiegos.data || [])
    } catch (error) {
      console.error('Error cargando datos:', error)
    } finally {
      setLoading(false)
    }
  }

  // Preparar datos para gráfica
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

  const formatFecha = (timestamp) => {
    return new Date(timestamp).toLocaleString('es-ES', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{maceta.nombre}</h2>
            <p className="text-sm text-gray-600">{maceta.ubicacion}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <>
              {/* Controles de periodo */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setPeriodo(24)}
                  className={`px-4 py-2 rounded-lg ${
                    periodo === 24 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  24 horas
                </button>
                <button
                  onClick={() => setPeriodo(168)}
                  className={`px-4 py-2 rounded-lg ${
                    periodo === 168 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  7 días
                </button>
                <button
                  onClick={() => setPeriodo(720)}
                  className={`px-4 py-2 rounded-lg ${
                    periodo === 720 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  30 días
                </button>
              </div>

              {/* Gráfica de Humedad del Suelo */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-primary-600" />
                  Humedad del Suelo
                </h3>
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="fecha" 
                        fontSize={12}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis 
                        fontSize={12}
                        domain={[0, 100]}
                        label={{ value: '%', position: 'insideLeft' }}
                      />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="Humedad Suelo" 
                        stroke="#22c55e" 
                        strokeWidth={2}
                        dot={{ r: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-center text-gray-500 py-8">No hay datos disponibles</p>
                )}
              </div>

              {/* Gráfica de Temperatura y Humedad Ambiente */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-orange-600" />
                  Temperatura y Humedad Ambiente
                </h3>
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="fecha" 
                        fontSize={12}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis 
                        fontSize={12}
                        yAxisId="left"
                        label={{ value: '°C', position: 'insideLeft' }}
                      />
                      <YAxis 
                        fontSize={12}
                        yAxisId="right"
                        orientation="right"
                        label={{ value: '%', position: 'insideRight' }}
                      />
                      <Tooltip />
                      <Legend />
                      <Line 
                        yAxisId="left"
                        type="monotone" 
                        dataKey="Temperatura" 
                        stroke="#f97316" 
                        strokeWidth={2}
                        dot={{ r: 3 }}
                      />
                      <Line 
                        yAxisId="right"
                        type="monotone" 
                        dataKey="H. Ambiente" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        dot={{ r: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-center text-gray-500 py-8">No hay datos disponibles</p>
                )}
              </div>

              {/* Historial de Riegos */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  Historial de Riegos Recientes
                </h3>
                {riegos.length > 0 ? (
                  <div className="space-y-2">
                    {riegos.map((riego) => (
                      <div 
                        key={riego.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            riego.tipo === 'manual' ? 'bg-blue-100' : 'bg-green-100'
                          }`}>
                            <Droplets className={`w-4 h-4 ${
                              riego.tipo === 'manual' ? 'text-blue-600' : 'text-green-600'
                            }`} />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              Riego {riego.tipo === 'manual' ? 'Manual' : 'Automático'}
                            </p>
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatFecha(riego.timestamp)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">{riego.duracion}s</p>
                          <p className="text-xs text-gray-500">duración</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8">No hay riegos registrados</p>
                )}
              </div>

              {/* Botón de acción */}
              <button
                onClick={onRegar}
                className="w-full btn-primary flex items-center justify-center gap-2 text-lg py-3"
              >
                <Droplets className="w-5 h-5" />
                Activar Riego Manual
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
