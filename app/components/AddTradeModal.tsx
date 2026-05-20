'use client';

import { useState } from 'react';

interface AddTradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (trade: any) => void;
}

export default function AddTradeModal({ isOpen, onClose, onSave }: AddTradeModalProps) {
  const [formData, setFormData] = useState({
    fechaApertura: new Date().toISOString().split('T')[0],
    horaApertura: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
    activo: 'BTC',
    tipo: 'Compra',
    resultado: 0,
    comisiones: 0,
    estrategia: '',
    estadoEmocional: 'Tranquilo',
    aciertosErrores: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-cyan-500 rounded-xl p-6 w-full max-w-md shadow-[0_0_30px_rgba(0,255,255,0.3)]">
        <h2 className="text-2xl font-bold text-cyan-400 mb-4">➕ Nuevo Trade</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-400">Fecha</label>
              <input
                type="date"
                value={formData.fechaApertura}
                onChange={(e) => setFormData({ ...formData, fechaApertura: e.target.value })}
                className="w-full bg-black border border-gray-700 rounded p-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400">Hora</label>
              <input
                type="time"
                value={formData.horaApertura}
                onChange={(e) => setFormData({ ...formData, horaApertura: e.target.value })}
                className="w-full bg-black border border-gray-700 rounded p-2 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-400">Activo</label>
              <select
                value={formData.activo}
                onChange={(e) => setFormData({ ...formData, activo: e.target.value })}
                className="w-full bg-black border border-gray-700 rounded p-2 text-white"
              >
                <option>BTC</option>
                <option>ETH</option>
                <option>SOL</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400">Tipo</label>
              <select
                value={formData.tipo}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                className="w-full bg-black border border-gray-700 rounded p-2 text-white"
              >
                <option>Compra</option>
                <option>Venta</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-400">Resultado (USDT)</label>
              <input
                type="number"
                step="0.01"
                value={formData.resultado}
                onChange={(e) => setFormData({ ...formData, resultado: parseFloat(e.target.value) })}
                className="w-full bg-black border border-gray-700 rounded p-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400">Comisiones</label>
              <input
                type="number"
                step="0.01"
                value={formData.comisiones}
                onChange={(e) => setFormData({ ...formData, comisiones: parseFloat(e.target.value) })}
                className="w-full bg-black border border-gray-700 rounded p-2 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400">Estrategia</label>
            <input
              type="text"
              value={formData.estrategia}
              onChange={(e) => setFormData({ ...formData, estrategia: e.target.value })}
              className="w-full bg-black border border-gray-700 rounded p-2 text-white"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400">Estado Emocional</label>
            <select
              value={formData.estadoEmocional}
              onChange={(e) => setFormData({ ...formData, estadoEmocional: e.target.value })}
              className="w-full bg-black border border-gray-700 rounded p-2 text-white"
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
            <label className="block text-sm text-gray-400">Aciertos/Errores</label>
            <textarea
              rows={2}
              value={formData.aciertosErrores}
              onChange={(e) => setFormData({ ...formData, aciertosErrores: e.target.value })}
              className="w-full bg-black border border-gray-700 rounded p-2 text-white"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 bg-gray-700 rounded hover:bg-gray-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded font-bold hover:opacity-90"
            >
              💾 Guardar Trade
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}