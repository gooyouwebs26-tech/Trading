'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface OpenTradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (trade: any) => void;
  checklistData?: any;
}

export default function OpenTradeModal({ isOpen, onClose, onSave, checklistData }: OpenTradeModalProps) {
  const [formData, setFormData] = useState({
    fechaApertura: new Date().toISOString().split('T')[0],
    horaApertura: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
    activo: 'BTC',
    tipo: 'Compra',
    precioEntrada: '',
    cantidadUsdt: '',
    apalancamiento: '',
    stopLoss: '',
    takeProfit: '',
    estrategia: '',
    estadoEmocional: 'Tranquilo',
    notas: '',
    estado: 'abierto'
  });

  const [imagenEntrada, setImagenEntrada] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      precioEntrada: parseFloat(formData.precioEntrada),
      cantidadUsdt: parseFloat(formData.cantidadUsdt),
      apalancamiento: parseFloat(formData.apalancamiento),
      stopLoss: formData.stopLoss ? parseFloat(formData.stopLoss) : null,
      takeProfit: formData.takeProfit ? parseFloat(formData.takeProfit) : null,
      imagenEntrada: imagenEntrada || null,
      checklist: checklistData || null
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
        >
          <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 w-[500px] max-w-[90vw] max-h-[85vh] overflow-y-auto border border-cyan-500 shadow-[0_0_30px_rgba(0,255,255,0.3)]">
            <div className="absolute top-4 right-4">
              <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center animate-pulse">
                <div className="w-8 h-8 rounded-full bg-cyan-500/40"></div>
              </div>
            </div>
            
            <h2 className="text-3xl font-bold text-cyan-400 mb-6 text-center">
              ⚡ ABRIR TRADE ⚡
            </h2>
            
            {checklistData && (
              <div className="mb-4 p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/30">
                <p className="text-xs text-cyan-400 mb-1">✅ Checklist: {checklistData.porcentaje}% cumplido</p>
                <p className="text-xs text-gray-400">{checklistData.cumplidas}/{checklistData.total} requisitos</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-cyan-400">Fecha Entrada</label>
                  <input
                    type="date"
                    value={formData.fechaApertura}
                    onChange={(e) => setFormData({ ...formData, fechaApertura: e.target.value })}
                    className="w-full bg-black/50 border border-cyan-500 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-cyan-400">Hora Entrada</label>
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
                  <label className="block text-sm text-cyan-400">Precio Entrada (USDT)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.precioEntrada}
                    onChange={(e) => setFormData({ ...formData, precioEntrada: e.target.value })}
                    className="w-full bg-black/50 border border-cyan-500 rounded-lg p-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-cyan-400">Cantidad (USDT)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.cantidadUsdt}
                    onChange={(e) => setFormData({ ...formData, cantidadUsdt: e.target.value })}
                    className="w-full bg-black/50 border border-cyan-500 rounded-lg p-2 text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-cyan-400">Apalancamiento</label>
                <input
                  type="number"
                  step="1"
                  value={formData.apalancamiento}
                  onChange={(e) => setFormData({ ...formData, apalancamiento: e.target.value })}
                  className="w-full bg-black/50 border border-cyan-500 rounded-lg p-2 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-cyan-400">Stop Loss (USDT) - Opcional</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.stopLoss}
                    onChange={(e) => setFormData({ ...formData, stopLoss: e.target.value })}
                    placeholder="Ej: 68000"
                    className="w-full bg-black/50 border border-cyan-500 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-cyan-400">Take Profit (USDT) - Opcional</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.takeProfit}
                    onChange={(e) => setFormData({ ...formData, takeProfit: e.target.value })}
                    placeholder="Ej: 72000"
                    className="w-full bg-black/50 border border-cyan-500 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              {/* Imagen de entrada - Opcional */}
              <div>
                <label className="block text-sm text-cyan-400">📸 Captura del Gráfico (Entrada) - Opcional</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setImagenEntrada(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="w-full bg-black/50 border border-cyan-500 rounded-lg p-2 text-white text-sm file:mr-2 file:py-1 file:px-2 file:rounded-full file:bg-cyan-600 file:text-white file:border-0 hover:file:bg-cyan-500"
                />
                {imagenEntrada && (
                  <p className="text-xs text-green-400 mt-1">✅ Imagen cargada</p>
                )}
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
                </select>
              </div>

              <div>
                <label className="block text-sm text-cyan-400">Notas</label>
                <textarea
                  rows={2}
                  value={formData.notas}
                  onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                  className="w-full bg-black/50 border border-cyan-500 rounded-lg p-2 text-white"
                  placeholder="Razón de entrada, análisis, etc."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2 bg-gray-700 rounded-lg hover:bg-gray-600"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg font-bold hover:from-cyan-500 hover:to-blue-500 transition-all shadow-[0_0_15px_rgba(0,255,255,0.5)]"
                >
                  ⚡ ABRIR TRADE
                </button>
              </div>
            </form>
            
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-cyan-500 text-xs whitespace-nowrap">
              ⚡ TRADE ABIERTO - PENDIENTE DE CIERRE ⚡
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}