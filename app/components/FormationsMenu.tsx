'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FormationImage {
  id: string;
  url: string;
  caption?: string;
}

interface Formation {
  id: string;
  nombre: string;
  tipo: 'techo' | 'suelo' | 'continuacion' | 'reversal' | 'otro';
  descripcion: string;
  fechaCreacion: string;
  imagenes: FormationImage[];
  tags: string[];
  lecciones: string;
}

interface FormationsMenuProps {
  onAddFormation: () => void;
}

export default function FormationsMenu({ onAddFormation }: FormationsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formations, setFormations] = useState<Formation[]>([]);
  const [selectedFormation, setSelectedFormation] = useState<Formation | null>(null);
  const [filterTipo, setFilterTipo] = useState<string>('todos');
  const [searchTerm, setSearchTerm] = useState('');

  // Cargar formaciones guardadas
  useEffect(() => {
    const saved = localStorage.getItem('tradingFormations');
    if (saved) {
      setFormations(JSON.parse(saved));
    } else {
      // Datos de ejemplo para mostrar
      const ejemplos: Formation[] = [
        {
          id: '1',
          nombre: 'Doble Techo BTC - 15m',
          tipo: 'techo',
          descripcion: 'Doble techo perfecto en BTC, con volumen decreciente en el segundo pico. Confirmación con vela bajista.',
          fechaCreacion: '2024-01-15',
          imagenes: [],
          tags: ['BTC', '15m', 'bearish'],
          lecciones: 'Esperar confirmación debajo del cuello. El stop loss va arriba del segundo pico.'
        },
        {
          id: '2',
          nombre: 'Hombro Cabeza Hombro ETH',
          tipo: 'reversal',
          descripcion: 'HCH invertido en ETH, volumen aumentando en la ruptura.',
          fechaCreacion: '2024-01-20',
          imagenes: [],
          tags: ['ETH', '1h', 'bullish'],
          lecciones: 'El volumen es clave para validar la figura.'
        }
      ];
      setFormations(ejemplos);
      localStorage.setItem('tradingFormations', JSON.stringify(ejemplos));
    }
  }, []);

  // Guardar cuando cambien
  useEffect(() => {
    if (formations.length > 0) {
      localStorage.setItem('tradingFormations', JSON.stringify(formations));
    }
  }, [formations]);

  const deleteFormation = (id: string) => {
    if (confirm('¿Eliminar esta formación?')) {
      setFormations(prev => prev.filter(f => f.id !== id));
    }
  };

  const filteredFormations = formations.filter(f => {
    const matchTipo = filterTipo === 'todos' || f.tipo === filterTipo;
    const matchSearch = searchTerm === '' || 
      f.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchTipo && matchSearch;
  });

  const getTipoColor = (tipo: string) => {
    switch(tipo) {
      case 'techo': return 'border-red-500 text-red-400';
      case 'suelo': return 'border-green-500 text-green-400';
      case 'continuacion': return 'border-blue-500 text-blue-400';
      case 'reversal': return 'border-purple-500 text-purple-400';
      default: return 'border-gray-500 text-gray-400';
    }
  };

  const getTipoEmoji = (tipo: string) => {
    switch(tipo) {
      case 'techo': return '🔴';
      case 'suelo': return '🟢';
      case 'continuacion': return '🔵';
      case 'reversal': return '🟣';
      default: return '📊';
    }
  };

  return (
    <>
      {/* Botón del menú */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative bg-gradient-to-r from-purple-600 to-pink-600 px-3 py-1.5 rounded-full font-bold text-sm hover:scale-105 transition-all shadow-[0_0_15px_rgba(168,85,247,0.5)] flex items-center gap-2"
      >
        📚 FORMACIONES 📚
        {formations.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-yellow-500 text-black text-xs rounded-full w-4 h-4 flex items-center justify-center">
            {formations.length}
          </span>
        )}
      </button>

      {/* Menú desplegable */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 w-[450px] max-w-[90vw] bg-gray-900 rounded-xl border border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.3)] z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-900 to-pink-900 p-3">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-white">📚 Banco de Formaciones</h3>
                <button onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white">✕</button>
              </div>
              
              {/* Filtros y búsqueda */}
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  placeholder="🔍 Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 bg-black/50 border border-purple-500 rounded px-2 py-1 text-xs text-white"
                />
                <select
                  value={filterTipo}
                  onChange={(e) => setFilterTipo(e.target.value)}
                  className="bg-black/50 border border-purple-500 rounded px-2 py-1 text-xs text-white"
                >
                  <option value="todos">Todos</option>
                  <option value="techo">🔴 Techos</option>
                  <option value="suelo">🟢 Suelos</option>
                  <option value="continuacion">🔵 Continuación</option>
                  <option value="reversal">🟣 Reversales</option>
                </select>
              </div>
            </div>

            {/* Lista de formaciones */}
            <div className="max-h-[500px] overflow-y-auto p-3 space-y-2">
              {filteredFormations.length === 0 ? (
                <p className="text-gray-400 text-center py-8 text-sm">
                  No hay formaciones guardadas aún.<br/>
                  ¡Añade tu primera!
                </p>
              ) : (
                filteredFormations.map((formation) => (
                  <motion.div
                    key={formation.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`bg-black/50 rounded-lg p-3 border-l-4 ${getTipoColor(formation.tipo)} cursor-pointer hover:bg-black/70 transition-all`}
                    onClick={() => setSelectedFormation(formation)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getTipoEmoji(formation.tipo)}</span>
                          <h4 className="font-bold text-purple-300 text-sm">{formation.nombre}</h4>
                        </div>
                        <p className="text-gray-400 text-xs mt-1 line-clamp-2">{formation.descripcion}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {formation.tags.slice(0, 3).map((tag, i) => (
                            <span key={i} className="text-[10px] bg-gray-800 px-1.5 py-0.5 rounded text-gray-400">
                              #{tag}
                            </span>
                          ))}
                          {formation.imagenes.length > 0 && (
                            <span className="text-[10px] bg-purple-900 px-1.5 py-0.5 rounded text-purple-300">
                              📸 {formation.imagenes.length} img
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteFormation(formation.id);
                        }}
                        className="text-gray-500 hover:text-red-400 text-xs px-2"
                      >
                        🗑️
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Botón añadir */}
            <div className="p-3 border-t border-gray-800">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onAddFormation();
                }}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 py-2 rounded-lg font-bold text-sm hover:opacity-90 transition-all"
              >
                + AÑADIR NUEVA FORMACIÓN
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de detalle */}
      {selectedFormation && (
        <FormationDetailModal
          formation={selectedFormation}
          onClose={() => setSelectedFormation(null)}
        />
      )}
    </>
  );
}

// Componente interno para el detalle (lo pongo aquí pero puedes separarlo)
function FormationDetailModal({ formation, onClose }: { formation: Formation; onClose: () => void }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-[60]">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 w-[600px] max-w-[90vw] max-h-[85vh] overflow-y-auto border border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.3)]"
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-purple-400">{formation.nombre}</h2>
            <p className="text-xs text-gray-500 mt-1">📅 {formation.fechaCreacion}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">✕</button>
        </div>

        <div className="space-y-4">
          {/* Tipo */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Tipo:</span>
            <span className={`px-2 py-0.5 rounded text-xs ${formation.tipo === 'techo' ? 'bg-red-900 text-red-300' : formation.tipo === 'suelo' ? 'bg-green-900 text-green-300' : 'bg-purple-900 text-purple-300'}`}>
              {formation.tipo === 'techo' ? '🔴 Techo' : formation.tipo === 'suelo' ? '🟢 Suelo' : formation.tipo === 'continuacion' ? '🔵 Continuación' : '🟣 Reversal'}
            </span>
          </div>

          {/* Descripción */}
          <div className="bg-black/50 rounded-lg p-3">
            <p className="text-sm text-gray-300">{formation.descripcion}</p>
          </div>

          {/* Imágenes (hasta 5) */}
          {formation.imagenes.length > 0 && (
            <div>
              <p className="text-sm text-cyan-400 mb-2">📸 Capturas ({formation.imagenes.length})</p>
              <div className="grid grid-cols-2 gap-2">
                {formation.imagenes.map((img, idx) => (
                  <div
                    key={img.id}
                    className="bg-black/50 rounded-lg p-1 cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => setSelectedImage(img.url)}
                  >
                    <img src={img.url} alt={`Captura ${idx + 1}`} className="rounded w-full h-32 object-cover" />
                    {img.caption && <p className="text-[10px] text-gray-400 mt-1 truncate">{img.caption}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {formation.tags.length > 0 && (
            <div>
              <p className="text-sm text-cyan-400 mb-1">🏷️ Tags</p>
              <div className="flex flex-wrap gap-1">
                {formation.tags.map((tag, i) => (
                  <span key={i} className="bg-gray-800 px-2 py-0.5 rounded text-xs text-gray-300">#{tag}</span>
                ))}
              </div>
            </div>
          )}

          {/* Lecciones */}
          {formation.lecciones && (
            <div className="bg-purple-900/20 rounded-lg p-3 border border-purple-500/30">
              <p className="text-sm text-purple-400 mb-1">📝 Lecciones aprendidas</p>
              <p className="text-xs text-gray-300">{formation.lecciones}</p>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-5 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-bold hover:opacity-90"
        >
          Cerrar
        </button>
      </motion.div>

      {/* Modal de imagen ampliada */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/95 z-[70] flex items-center justify-center cursor-pointer" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="Ampliada" className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg border-2 border-purple-500" />
        </div>
      )}
    </div>
  );
}