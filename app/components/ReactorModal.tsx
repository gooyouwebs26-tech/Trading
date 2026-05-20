'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ReactorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (trade: any) => void;
}

export default function ReactorModal({ isOpen, onClose, onSave }: ReactorModalProps) {
  const [formData, setFormData] = useState({
    fechaApertura: new Date().toISOString().split('T')[0],
    horaApertura: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
    activo: 'BTC',
    tipo: 'Compra',
    resultado: '',
    comisiones: '',
    estrategia: '',
    estadoEmocional: 'Tranquilo',
    aciertosErrores: ''
  });
  const [pulse, setPulse] = useState(false);
  const [resultadoError, setResultadoError] = useState(false);
  const [comisionesError, setComisionesError] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPulse(true);
      setTimeout(() => setPulse(false), 600);
    }
  }, [isOpen]);

  const handleNumberChange = (value: string, field: 'resultado' | 'comisiones') => {
    // Permitir: vacío, número, número negativo, número decimal
    if (value === '' || value === '-') {
      setFormData({ ...formData, [field]: value });
      if (field === 'resultado') setResultadoError(false);
      if (field === 'comisiones') setComisionesError(false);
      return;
    }
    
    // Validar que sea un número válido (puede tener signo menos y un punto)
    const regex = /^-?\d*\.?\d*$/;
    if (regex.test(value)) {
      setFormData({ ...formData, [field]: value });
      if (field === 'resultado') setResultadoError(false);
      if (field === 'comisiones') setComisionesError(false);
    } else {
      if (field === 'resultado') setResultadoError(true);
      if (field === 'comisiones') setComisionesError(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convertir a número
    const resultadoNum = parseFloat(formData.resultado);
    const comisionesNum = parseFloat(formData.comisiones);
    
    // Validar que sean números válidos
    if (isNaN(resultadoNum)) {
      setResultadoError(true);
      return;
    }
    if (isNaN(comisionesNum)) {
      setComisionesError(true);
      return;
    }
    
    // Guardar con números
    onSave({
      ...formData,
      resultado: resultadoNum,
      comisiones: comisionesNum
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ scale: 0.7, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0.7, rotate: 10 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className={`relative ${pulse ? 'reactor-pulse' : ''}`}
        >
          {/* Círculos del reactor */}
          <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-3xl animate-pulse"></div>
          <div className="absolute inset-0 rounded-full border-4 border-cyan-500/50 shadow-[0_0_50px_rgba(0,255,255,0.5)]"></div>
          <div className="absolute inset-4 rounded-full border-2 border-cyan-400/30"></div>
          <div className="absolute inset-8 rounded-full border border-cyan-300/20"></div>
          
          {/* Contenido del formulario */}
          <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 w-[500px] max-w-[90vw] border border-cyan-500 shadow-[0_0_30px_rgba(0,255,255,0.3)]">
            <div className="absolute top-4 right-4">
              <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center animate-pulse">
                <div className="w-8 h-8 rounded-full bg-cyan-500/40"></div>
              </div>
            </div>
            
            <h2 className="text-3xl font-bold text-cyan-400 mb-6 text-center">
              ⚡ REACTOR DE TRADING ⚡
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-cyan-400">Fecha</label>
                  <input
                    type="date"
                    value={formData.fechaApertura}
                    onChange={(e) => setFormData({ ...formData, fechaApertura: e.target.value })}
                    className="w-full bg-black/50 border border-cyan-500 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-cyan-400">Hora</label>
                  <input
                    type="time"
                    value={formData.horaApertura}
                    onChange={(e) => setFormData({ ...formData, horaApertura: e.target.value })}
                    className="w-full bg-black/50 border border-cyan-500 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-cyan-400">Activo</label>
                  <select
                    value={formData.activo}
                    onChange={(e) => setFormData({ ...formData, activo: e.target.value })}
                    className="w-full bg-black/50 border border-cyan-500 rounded-lg p-2 text-white"
                  >
                    <option>BTC</option>
                    <option>ETH</option>
                    <option>SOL</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-cyan-400">Tipo</label>
                  <select
                    value={formData.tipo}
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                    className="w-full bg-black/50 border border-cyan-500 rounded-lg p-2 text-white"
                  >
                    <option>Compra</option>
                    <option>Venta</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-cyan-400">Resultado (USDT)</label>
                  <input
                    type="text"
                    value={formData.resultado}
                    onChange={(e) => handleNumberChange(e.target.value, 'resultado')}
                    placeholder="Ej: 59.08 o -57.95"
                    className={`w-full bg-black/50 border rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                      resultadoError ? 'border-red-500' : 'border-cyan-500'
                    }`}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    💡 Usa el signo - para pérdidas (ej: -57.95)
                  </p>
                </div>
                <div>
                  <label className="block text-sm text-cyan-400">Comisiones</label>
                  <input
                    type="text"
                    value={formData.comisiones}
                    onChange={(e) => handleNumberChange(e.target.value, 'comisiones')}
                    placeholder="Ej: 1.61 o -0.5"
                    className={`w-full bg-black/50 border rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                      comisionesError ? 'border-red-500' : 'border-cyan-500'
                    }`}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    💡 Negativo si te devolvieron comisiones
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm text-cyan-400">Estrategia</label>
                <input
                  type="text"
                  value={formData.estrategia}
                  onChange={(e) => setFormData({ ...formData, estrategia: e.target.value })}
                  className="w-full bg-black/50 border border-cyan-500 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="block text-sm text-cyan-400">Estado Emocional</label>
                <select
                  value={formData.estadoEmocional}
                  onChange={(e) => setFormData({ ...formData, estadoEmocional: e.target.value })}
                  className="w-full bg-black/50 border border-cyan-500 rounded-lg p-2 text-white"
                >
                  <option>Tranquilo</option>
                  <option>Lúcido</option>
                  <option>Nervioso</option>
                  <option>Desesperado</option>
                  <option>Sobreoperando</option>
                  <option>Cansado</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-cyan-400">Aciertos/Errores</label>
                <textarea
                  rows={2}
                  value={formData.aciertosErrores}
                  onChange={(e) => setFormData({ ...formData, aciertosErrores: e.target.value })}
                  className="w-full bg-black/50 border border-cyan-500 rounded-lg p-2 text-white"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg font-bold hover:from-cyan-500 hover:to-blue-500 transition-all shadow-[0_0_15px_rgba(0,255,255,0.5)]"
                >
                  💾 ACTIVAR REACTOR
                </button>
              </div>
            </form>
            
            {/* Texto de energía */}
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-cyan-500 text-xs whitespace-nowrap">
              ⚡ REACTOR ARC ENERGIZADO ⚡
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}