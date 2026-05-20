'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CloseTradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (trade: any) => void;
  trade: any;
}

export default function CloseTradeModal({ isOpen, onClose, onSave, trade }: CloseTradeModalProps) {
  const [formData, setFormData] = useState({
    precioSalida: '',
    resultado: '',
    comisiones: '',
    aciertosErrores: ''
  });

  const [imagenSalida, setImagenSalida] = useState<string | null>(null);

  // Calcular porcentaje de ganancia/pérdida
  const calcularPorcentaje = () => {
    if (!trade?.precioEntrada || !formData.precioSalida) return 0;
    const entrada = parseFloat(trade.precioEntrada);
    const salida = parseFloat(formData.precioSalida);
    if (isNaN(entrada) || isNaN(salida)) return 0;
    
    const diferencia = ((salida - entrada) / entrada) * 100;
    return trade.tipo === 'Compra' ? diferencia : -diferencia;
  };

  // Calcular ratio riesgo/beneficio
  const calcularRatio = () => {
    if (!trade?.stopLoss || !formData.precioSalida) return null;
    const entrada = parseFloat(trade.precioEntrada);
    const sl = parseFloat(trade.stopLoss);
    const salida = parseFloat(formData.precioSalida);
    if (isNaN(entrada) || isNaN(sl) || isNaN(salida)) return null;
    
    const riesgo = Math.abs(entrada - sl);
    const beneficio = Math.abs(salida - entrada);
    if (riesgo === 0) return null;
    return (beneficio / riesgo).toFixed(2);
  };

  // Mostrar información de Stop Loss y Take Profit si existen
  const mostrarSLTP = () => {
    if (!trade?.stopLoss && !trade?.takeProfit) return null;
    return (
      <div className="mb-4 p-3 bg-gray-800/50 rounded-lg text-xs">
        {trade?.stopLoss && (
          <p className="text-gray-400">Stop Loss: <span className="text-red-400">${trade.stopLoss}</span></p>
        )}
        {trade?.takeProfit && (
          <p className="text-gray-400">Take Profit: <span className="text-green-400">${trade.takeProfit}</span></p>
        )}
      </div>
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const porcentaje = calcularPorcentaje();
    const ratio = calcularRatio();
    
    onSave({
      ...trade,
      ...formData,
      precioSalida: parseFloat(formData.precioSalida),
      resultado: parseFloat(formData.resultado),
      comisiones: parseFloat(formData.comisiones) || 0,
      porcentajeGanancia: porcentaje,
      riesgoBeneficio: ratio,
      imagenSalida: imagenSalida || trade.imagenSalida || null,
      estado: 'cerrado',
      fechaCierre: new Date().toISOString().split('T')[0],
      horaCierre: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
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
          initial={{ scale: 0.7 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.7 }}
          className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 w-[500px] max-w-[90vw] border border-cyan-500 shadow-[0_0_30px_rgba(0,255,255,0.3)]"
        >
          <h2 className="text-3xl font-bold text-cyan-400 mb-6 text-center">
            ✅ CERRAR TRADE
          </h2>
          
          <div className="mb-4 p-3 bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-400">Trade abierto:</p>
            <p className="text-cyan-400">{trade?.activo} - {trade?.tipo}</p>
            <p className="text-xs text-gray-500">Entrada: ${trade?.precioEntrada} | Cantidad: ${trade?.cantidadUsdt} | Apalancamiento: {trade?.apalancamiento}x</p>
          </div>

          {mostrarSLTP()}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-cyan-400">Precio Salida (USDT)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.precioSalida}
                  onChange={(e) => setFormData({ ...formData, precioSalida: e.target.value })}
                  className="w-full bg-black/50 border border-cyan-500 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-cyan-400">Resultado (USDT)</label>
                <input
                  type="text"
                  value={formData.resultado}
                  onChange={(e) => setFormData({ ...formData, resultado: e.target.value })}
                  placeholder="Ej: 59.08 o -57.95"
                  className="w-full bg-black/50 border border-cyan-500 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>
            </div>

            {/* Mostrar cálculos en tiempo real */}
            {formData.precioSalida && (
              <div className="p-2 bg-gray-800/50 rounded-lg text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-gray-400">% Ganancia:</span>
                  <span className={calcularPorcentaje() >= 0 ? 'text-green-400' : 'text-red-400'}>
                    {calcularPorcentaje() >= 0 ? '+' : ''}{calcularPorcentaje().toFixed(2)}%
                  </span>
                  
                  {calcularRatio() && (
                    <>
                      <span className="text-gray-400">Riesgo/Beneficio:</span>
                      <span className="text-cyan-400">1:{calcularRatio()}</span>
                    </>
                  )}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm text-cyan-400">Comisiones</label>
              <input
                type="text"
                value={formData.comisiones}
                onChange={(e) => setFormData({ ...formData, comisiones: e.target.value })}
                placeholder="Ej: 1.61 o -0.5"
                className="w-full bg-black/50 border border-cyan-500 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            {/* Imagen de salida - Opcional */}
            <div>
              <label className="block text-sm text-cyan-400">📸 Captura del Gráfico (Salida) - Opcional</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setImagenSalida(reader.result as string);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="w-full bg-black/50 border border-cyan-500 rounded-lg p-2 text-white text-sm file:mr-2 file:py-1 file:px-2 file:rounded-full file:bg-cyan-600 file:text-white file:border-0 hover:file:bg-cyan-500"
              />
              {imagenSalida && (
                <p className="text-xs text-green-400 mt-1">✅ Imagen cargada</p>
              )}
              {trade?.imagenEntrada && !imagenSalida && (
                <p className="text-xs text-gray-400 mt-1">💡 Ya tienes imagen de entrada. Puedes añadir imagen de salida opcionalmente.</p>
              )}
            </div>

            <div>
              <label className="block text-sm text-cyan-400">Lecciones Aprendidas</label>
              <textarea
                rows={3}
                value={formData.aciertosErrores}
                onChange={(e) => setFormData({ ...formData, aciertosErrores: e.target.value })}
                className="w-full bg-black/50 border border-cyan-500 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="¿Qué salió bien? ¿Qué salió mal? ¿Qué aprender?"
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
                ✅ CERRAR TRADE
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}