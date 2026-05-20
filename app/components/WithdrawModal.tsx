'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWithdraw: (amount: number) => void;
  currentBalance: number;
}

export default function WithdrawModal({ isOpen, onClose, onWithdraw, currentBalance }: WithdrawModalProps) {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const withdrawAmount = parseFloat(amount);

    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      setError('Por favor, ingresa una cantidad válida');
      return;
    }

    if (withdrawAmount > currentBalance) {
      setError(`No puedes retirar más de tu balance actual (${currentBalance} USDT)`);
      return;
    }

    onWithdraw(withdrawAmount);
    setAmount('');
    setError('');
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
          initial={{ scale: 0.7, rotate: -5 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0.7, rotate: 5 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 w-[450px] max-w-[90vw] border border-cyan-500 shadow-[0_0_30px_rgba(0,255,255,0.3)]"
        >
          <div className="absolute top-4 right-4">
            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center animate-pulse">
              <div className="w-6 h-6 rounded-full bg-red-500/40"></div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-red-400 mb-2 text-center">
            💸 RETIRAR FONDOS
          </h2>
          
          <p className="text-center text-gray-400 mb-6 text-sm">
            Balance disponible: <span className="text-cyan-400 font-bold">{currentBalance} USDT</span>
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-cyan-400 mb-2">Cantidad a retirar (USDT)</label>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setError('');
                }}
                placeholder="Ej: 100.50"
                className="w-full bg-black/50 border border-cyan-500 rounded-lg p-3 text-white text-xl text-center focus:outline-none focus:ring-2 focus:ring-cyan-500"
                autoFocus
              />
              {error && (
                <p className="text-red-400 text-xs mt-2">{error}</p>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setAmount((currentBalance / 2).toString());
                  setError('');
                }}
                className="flex-1 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 text-sm transition-all"
              >
                50%
              </button>
              <button
                type="button"
                onClick={() => {
                  setAmount(currentBalance.toString());
                  setError('');
                }}
                className="flex-1 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 text-sm transition-all"
              >
                100%
              </button>
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
                className="flex-1 py-2 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg font-bold hover:from-red-500 hover:to-orange-500 transition-all shadow-[0_0_15px_rgba(255,0,0,0.5)]"
              >
                💸 CONFIRMAR RETIRO
              </button>
            </div>
          </form>

          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-red-500 text-xs whitespace-nowrap">
            💰 RETIRO DE FONDOS - VERIFICA LA CANTIDAD 💰
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}