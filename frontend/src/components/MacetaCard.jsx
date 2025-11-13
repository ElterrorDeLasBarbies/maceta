import { Droplets, Thermometer, Cloud, MapPin, TrendingDown, TrendingUp, AlertTriangle } from 'lucide-react'

export default function MacetaCard({ maceta, onRegar, onViewDetails }) {
  const { nombre, ubicacion, umbral_humedad, estado } = maceta
  const lectura = estado?.ultima_lectura
  const ultimoRiego = estado?.ultimo_riego

  // Calcular estado de humedad
  const getHumedadStatus = (humedad) => {
    if (!humedad) return 'sin-datos'
    if (humedad < umbral_humedad - 10) return 'critico'
    if (humedad < umbral_humedad) return 'bajo'
    if (humedad > 80) return 'alto'
    return 'optimo'
  }

  const humedadStatus = getHumedadStatus(lectura?.humedad_suelo)

  const statusConfig = {
    'critico': {
      color: 'red',
      icon: AlertTriangle,
      text: 'Crítico',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-300',
      textColor: 'text-red-700'
    },
    'bajo': {
      color: 'orange',
      icon: TrendingDown,
      text: 'Bajo',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-300',
      textColor: 'text-orange-700'
    },
    'optimo': {
      color: 'green',
      icon: TrendingUp,
      text: 'Óptimo',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-300',
      textColor: 'text-green-700'
    },
    'alto': {
      color: 'blue',
      icon: Droplets,
      text: 'Alto',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-300',
      textColor: 'text-blue-700'
    },
    'sin-datos': {
      color: 'gray',
      icon: AlertTriangle,
      text: 'Sin datos',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-300',
      textColor: 'text-gray-700'
    }
  }

  const status = statusConfig[humedadStatus]
  const StatusIcon = status.icon

  const formatFecha = (timestamp) => {
    if (!timestamp) return 'N/A'
    const fecha = new Date(timestamp)
    const ahora = new Date()
    const diff = Math.floor((ahora - fecha) / 1000 / 60) // minutos
    
    if (diff < 1) return 'Ahora'
    if (diff < 60) return `Hace ${diff}m`
    if (diff < 1440) return `Hace ${Math.floor(diff / 60)}h`
    return fecha.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })
  }

  return (
    <div className="card hover:scale-105 transition-transform">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{nombre}</h3>
          <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
            <MapPin className="w-3 h-3" />
            {ubicacion || 'Sin ubicación'}
          </div>
        </div>
        
        <div className={`badge ${status.bgColor} ${status.textColor} border ${status.borderColor}`}>
          <StatusIcon className="w-3 h-3 mr-1" />
          {status.text}
        </div>
      </div>

      {/* Datos principales */}
      {lectura ? (
        <>
          {/* Humedad del suelo - Grande */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Droplets className="w-4 h-4" />
                Humedad del Suelo
              </span>
              <span className="text-sm text-gray-500">
                Umbral: {umbral_humedad}%
              </span>
            </div>
            
            <div className="relative">
              <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    humedadStatus === 'critico' ? 'bg-red-500' :
                    humedadStatus === 'bajo' ? 'bg-orange-500' :
                    humedadStatus === 'optimo' ? 'bg-green-500' :
                    'bg-blue-500'
                  }`}
                  style={{ width: `${lectura.humedad_suelo}%` }}
                ></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-gray-800">
                  {lectura.humedad_suelo.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* Temperatura y Humedad ambiente */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-orange-700 mb-1">
                <Thermometer className="w-4 h-4" />
                <span className="text-xs font-medium">Temperatura</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {lectura.temperatura.toFixed(1)}°C
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-blue-700 mb-1">
                <Cloud className="w-4 h-4" />
                <span className="text-xs font-medium">H. Ambiente</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {lectura.humedad_ambiente.toFixed(1)}%
              </p>
            </div>
          </div>

          {/* Última actualización */}
          <div className="text-xs text-gray-500 mb-4">
            Actualizado: {formatFecha(lectura.timestamp)}
          </div>
        </>
      ) : (
        <div className="text-center py-6 text-gray-500">
          <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Sin datos de sensores</p>
        </div>
      )}

      {/* Botones */}
      <div className="flex gap-2">
        <button
          onClick={onRegar}
          className="flex-1 btn-primary flex items-center justify-center gap-2"
          disabled={!lectura}
        >
          <Droplets className="w-4 h-4" />
          Regar Ahora
        </button>
        <button
          onClick={onViewDetails}
          className="btn-secondary px-4"
        >
          Ver Más
        </button>
      </div>
    </div>
  )
}
