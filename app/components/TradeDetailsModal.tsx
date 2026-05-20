'use client';

import { useState } from 'react';

interface TradeDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  trade: any;
}

export default function TradeDetailsModal({ isOpen, onClose, trade }: TradeDetailsModalProps) {
  const [imagenAmpliada, setImagenAmpliada] = useState<string | null>(null);

  if (!isOpen || !trade) return null;

  return (
    <>
      {/* Modal principal de detalles */}
      <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50">
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 w-[700px] max-w-[90vw] max-h-[95vh] overflow-y-auto border border-cyan-500 shadow-[0_0_30px_rgba(0,255,255,0.3)]">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4 text-center">
            📋 Detalles del Trade
          </h2>
          
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4 p-4 bg-black/30 rounded-lg">
              <span className="text-gray-400">Activo:</span>
              <span className="text-cyan-400 font-bold">{trade.activo}</span>
              
              <span className="text-gray-400">Tipo:</span>
              <span className={trade.tipo === 'Compra' ? 'text-green-400' : 'text-red-400'}>{trade.tipo}</span>
              
              <span className="text-gray-400">Fecha Entrada:</span>
              <span>{trade.fechaApertura} {trade.horaApertura}</span>
              
              {trade.fechaCierre && (
                <>
                  <span className="text-gray-400">Fecha Cierre:</span>
                  <span>{trade.fechaCierre} {trade.horaCierre}</span>
                </>
              )}
              
              {trade.precioEntrada && (
                <>
                  <span className="text-gray-400">Precio Entrada:</span>
                  <span>${trade.precioEntrada}</span>
                </>
              )}
              
              {trade.precioSalida && (
                <>
                  <span className="text-gray-400">Precio Salida:</span>
                  <span>${trade.precioSalida}</span>
                </>
              )}
              
              {trade.cantidadUsdt && (
                <>
                  <span className="text-gray-400">Cantidad:</span>
                  <span>${trade.cantidadUsdt} USDT</span>
                </>
              )}
              
              {trade.apalancamiento && (
                <>
                  <span className="text-gray-400">Apalancamiento:</span>
                  <span>{trade.apalancamiento}x</span>
                </>
              )}
              
              {trade.stopLoss && (
                <>
                  <span className="text-gray-400">Stop Loss:</span>
                  <span className="text-red-400">${trade.stopLoss}</span>
                </>
              )}
              
              {trade.takeProfit && (
                <>
                  <span className="text-gray-400">Take Profit:</span>
                  <span className="text-green-400">${trade.takeProfit}</span>
                </>
              )}
              
              {trade.resultado !== undefined && (
                <>
                  <span className="text-gray-400">Resultado:</span>
                  <span className={trade.resultado >= 0 ? 'text-green-400' : 'text-red-400'}>
                    {trade.resultado >= 0 ? '+' : ''}{trade.resultado} USDT
                  </span>
                </>
              )}
              
              {trade.porcentajeGanancia !== undefined && (
                <>
                  <span className="text-gray-400">% Ganancia:</span>
                  <span className={trade.porcentajeGanancia >= 0 ? 'text-green-400' : 'text-red-400'}>
                    {trade.porcentajeGanancia >= 0 ? '+' : ''}{trade.porcentajeGanancia.toFixed(2)}%
                  </span>
                </>
              )}
              
              {trade.riesgoBeneficio && (
                <>
                  <span className="text-gray-400">Riesgo/Beneficio:</span>
                  <span className="text-cyan-400">1:{trade.riesgoBeneficio}</span>
                </>
              )}
              
              {trade.comisiones !== undefined && (
                <>
                  <span className="text-gray-400">Comisiones:</span>
                  <span>${Math.abs(trade.comisiones)} USDT</span>
                </>
              )}
              
              <span className="text-gray-400">Estrategia:</span>
              <span className="text-gray-300">{trade.estrategia || '-'}</span>
              
              <span className="text-gray-400">Estado Emocional:</span>
              <span className={`px-2 py-0.5 rounded text-xs inline-block w-fit ${
                trade.estadoEmocional === 'Tranquilo' ? 'bg-green-900 text-green-300' :
                trade.estadoEmocional === 'Lúcido' ? 'bg-cyan-900 text-cyan-300' :
                trade.estadoEmocional === 'Nervioso' ? 'bg-yellow-900 text-yellow-300' :
                'bg-red-900 text-red-300'
              }`}>
                {trade.estadoEmocional || '-'}
              </span>
              
              {trade.aciertosErrores && (
                <>
                  <span className="text-gray-400">Lecciones:</span>
                  <span className="text-gray-400 text-sm col-span-2">{trade.aciertosErrores}</span>
                </>
              )}
            </div>

            {/* Sección de Checklist */}
            {trade.checklist && (
              <div className="mt-3 p-3 bg-black/30 rounded-lg border border-cyan-500/30">
                <p className="text-gray-400 text-xs mb-2 flex items-center gap-1">
                  <span>📋</span> Checklist Pre-Trade:
                </p>
                <div className="mb-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">Cumplimiento:</span>
                    <span className="text-cyan-400 font-bold">{trade.checklist.porcentaje}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1.5">
                    <div 
                      className="bg-cyan-500 h-1.5 rounded-full transition-all"
                      style={{ width: `${trade.checklist.porcentaje}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{trade.checklist.cumplidas}/{trade.checklist.total} requisitos cumplidos</p>
                </div>
                {trade.checklist.notas && (
                  <div className="mt-2 pt-2 border-t border-gray-700">
                    <p className="text-xs text-gray-400">📝 Notas:</p>
                    <p className="text-xs text-gray-300 mt-1">{trade.checklist.notas}</p>
                  </div>
                )}
              </div>
            )}

            {/* Sección de Imágenes */}
            {(trade.imagenEntrada || trade.imagenSalida) && (
              <div className="mt-3 p-3 bg-black/30 rounded-lg border border-cyan-500/30">
                <p className="text-gray-400 text-xs mb-2 flex items-center gap-1">
                  <span>📸</span> Capturas del Trade:
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {trade.imagenEntrada && (
                    <div 
                      className="bg-black/50 rounded-lg p-2 cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => setImagenAmpliada(trade.imagenEntrada)}
                    >
                      <p className="text-xs text-cyan-400 mb-1">📈 Entrada</p>
                      <img 
                        src={trade.imagenEntrada} 
                        alt="Entrada" 
                        className="rounded-lg border border-cyan-500 w-full max-h-32 object-contain"
                      />
                    </div>
                  )}
                  {trade.imagenSalida && (
                    <div 
                      className="bg-black/50 rounded-lg p-2 cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => setImagenAmpliada(trade.imagenSalida)}
                    >
                      <p className="text-xs text-cyan-400 mb-1">📉 Salida</p>
                      <img 
                        src={trade.imagenSalida} 
                        alt="Salida" 
                        className="rounded-lg border border-cyan-500 w-full max-h-32 object-contain"
                      />
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">💡 Haz clic en la imagen para ampliar</p>
              </div>
            )}
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg font-bold hover:from-cyan-500 hover:to-blue-500 transition-all"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>

      {/* Modal de imagen ampliada */}
      {imagenAmpliada && (
        <div 
          className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-[60] cursor-pointer"
          onClick={() => setImagenAmpliada(null)}
        >
          <div className="relative max-w-[90vw] max-h-[90vh]">
            <img 
              src={imagenAmpliada} 
              alt="Ampliada" 
              className="max-w-full max-h-[90vh] object-contain rounded-lg border-2 border-cyan-500"
            />
            <button
              onClick={() => setImagenAmpliada(null)}
              className="absolute top-4 right-4 bg-black/50 rounded-full p-2 text-white hover:bg-black/70 transition-all"
            >
              ✕ Cerrar
            </button>
            <p className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-gray-400 text-xs bg-black/50 px-3 py-1 rounded-full">
              Haz clic en cualquier lugar para cerrar
            </p>
          </div>
        </div>
      )}
    </>
  );
}