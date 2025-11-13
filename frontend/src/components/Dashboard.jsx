import { useState } from 'react'
import MacetaCard from './MacetaCard'
import MacetaDetail from './MacetaDetail'
import { RefreshCw, Plus } from 'lucide-react'

export default function Dashboard({ macetas, onRegar, onRefresh }) {
  const [selectedMaceta, setSelectedMaceta] = useState(null)

  if (macetas.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
          <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No hay macetas registradas
          </h3>
          <p className="text-gray-600 mb-4">
            Crea tu primera maceta usando la API o Supabase
          </p>
          <code className="text-sm bg-gray-100 px-3 py-2 rounded block">
            POST /api/macetas
          </code>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Mis Macetas</h2>
          <p className="text-gray-600">
            {macetas.length} {macetas.length === 1 ? 'maceta activa' : 'macetas activas'}
          </p>
        </div>
        
        <button
          onClick={onRefresh}
          className="flex items-center gap-2 btn-secondary"
        >
          <RefreshCw className="w-4 h-4" />
          Actualizar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {macetas.map((maceta) => (
          <MacetaCard
            key={maceta.id}
            maceta={maceta}
            onRegar={() => onRegar(maceta.id)}
            onViewDetails={() => setSelectedMaceta(maceta)}
          />
        ))}
      </div>

      {selectedMaceta && (
        <MacetaDetail
          maceta={selectedMaceta}
          onClose={() => setSelectedMaceta(null)}
          onRegar={() => onRegar(selectedMaceta.id)}
        />
      )}
    </>
  )
}
