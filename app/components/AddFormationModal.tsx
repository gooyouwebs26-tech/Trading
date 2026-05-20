'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FormationImage {
  id: string;
  url: string;
  caption?: string;
}

interface AddFormationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formation: any) => void;
}

export default function AddFormationModal({ isOpen, onClose, onSave }: AddFormationModalProps) {
  const [formData, setFormData] = useState({
    nombre: '',
    tipo: 'techo',
    descripcion: '',
    tags: '',
    lecciones: ''
  });
  const [imagenes, setImagenes] = useState<FormationImage[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remainingSlots = 5 - imagenes.length;
    const filesToUpload = files.slice(0, remainingSlots);

    filesToUpload.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagenes(prev => [...prev, {
          id: Date.now().toString() + Math.random(),
          url: reader.result as string,
          caption: ''
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const updateImageCaption = (id: string, caption: string) => {
    setImagenes(prev => prev.map(img => 
      img.id === id ? { ...img, caption } : img
    ));
  };

  const removeImage = (id: string) => {
    setImagenes(prev => prev.filter(img => img.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
      imagenes: imagenes,
      fechaCreacion: new Date().toISOString().split('T')[0],
      id: Date.now().toString()
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
        className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[60]"
      >
        <motion.div
          initial={{ scale: 0.7, rotate: -5 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0.7, rotate: 5 }}
          className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 w-[550px] max-w-[90vw] max-h-[85vh] overflow-y-auto border border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.3)]"
        >
          <div className="absolute top-4 right-4">
            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center animate-pulse">
              <div className="w-6 h-6 rounded-full bg-purple-500/40"></div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-purple-400 mb-4 text-center">
            📚 AÑADIR FORMACIÓN
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-purple-400">Nombre *</label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Ej: Doble Techo BTC - 15m"
                className="w-full bg-black/50 border border-purple-500 rounded-lg p-2 text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-purple-400">Tipo *</label>
              <select
                value={formData.tipo}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                className="w-full bg-black/50 border border-purple-500 rounded-lg p-2 text-white"
              >
                <option value="techo">🔴 Techo (Doble Techo, HCH)</option>
                <option value="suelo">🟢 Suelo (Doble Suelo, HCH invertido)</option>
                <option value="continuacion">🔵 Continuación (Bandera, Cuña)</option>
                <option value="reversal">🟣 Reversal (Cuña ascendente/descendente)</option>
                <option value="otro">📊 Otro</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-purple-400">Descripción</label>
              <textarea
                rows={3}
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                placeholder="Describe la formación, contexto, timeframe, etc."
                className="w-full bg-black/50 border border-purple-500 rounded-lg p-2 text-white"
              />
            </div>

            {/* Subida de imágenes */}
            <div>
              <label className="block text-sm text-purple-400">
                📸 Capturas ({imagenes.length}/5)
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                disabled={imagenes.length >= 5}
                className="w-full bg-black/50 border border-purple-500 rounded-lg p-2 text-white text-sm file:mr-2 file:py-1 file:px-2 file:rounded-full file:bg-purple-600 file:text-white file:border-0 hover:file:bg-purple-500"
              />
              
              {/* Preview de imágenes */}
              {imagenes.length > 0 && (
                <div className="mt-2 space-y-2">
                  {imagenes.map((img, idx) => (
                    <div key={img.id} className="flex gap-2 items-center bg-black/30 rounded-lg p-2">
                      <img src={img.url} alt="preview" className="w-12 h-12 object-cover rounded" />
                      <input
                        type="text"
                        placeholder="Descripción de la captura"
                        value={img.caption}
                        onChange={(e) => updateImageCaption(img.id, e.target.value)}
                        className="flex-1 bg-black/50 border border-gray-700 rounded p-1 text-xs text-white"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(img.id)}
                        className="text-red-400 text-xs px-2"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm text-purple-400">
                Tags (separados por comas)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="Ej: BTC, 15m, bearish, volumen"
                className="w-full bg-black/50 border border-purple-500 rounded-lg p-2 text-white"
              />
            </div>

            <div>
              <label className="block text-sm text-purple-400">Lecciones aprendidas</label>
              <textarea
                rows={2}
                value={formData.lecciones}
                onChange={(e) => setFormData({ ...formData, lecciones: e.target.value })}
                placeholder="¿Qué aprendiste de esta formación? ¿Cómo operarla?"
                className="w-full bg-black/50 border border-purple-500 rounded-lg p-2 text-white"
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
                className="flex-1 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-bold hover:opacity-90"
              >
                💾 GUARDAR FORMACIÓN
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}