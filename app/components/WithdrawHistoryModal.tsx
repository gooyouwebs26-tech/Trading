'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface WithdrawRecord {
  id: string;
  amount: number;
  date: string;
  time: string;
  balanceAfter: number;
}

interface WithdrawHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  withdrawals: WithdrawRecord[];
}

export default function WithdrawHistoryModal({ isOpen, onClose, withdrawals }: WithdrawHistoryModalProps) {
  if (!isOpen) return null;

  const totalWithdrawn = withdrawals.reduce((sum, w) => sum + w.amount, 0);

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
          className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 w-[550px] max-w-[90vw] max-h-[80vh] overflow-y-auto border border-cyan-500 shadow-[0_0_30px_rgba(0,255,255,0.3)]"
        >
          <h2 className="text-2xl font-bold text-cyan-400 mb-2 text-center">
            📜 HISTORIAL DE RETIROS
          </h2>
          
          <div className="text-center mb-5">
            <p className="text-gray-400 text-sm">
              Total retirado: <span className="text-red-400 font-bold text-lg">{totalWithdrawn.toFixed(2)} USDT</span>
            </p>
          </div>

          {withdrawals.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <p className="text-4xl mb-3">💸</p>
              <p>No hay retiros registrados</p>
              <p className="text-xs mt-2">Los retiros que realices aparecerán aquí</p>
            </div>
          ) : (
            <div className="space-y-2">
              {withdrawals.map((withdraw) => (
                <motion.div
                  key={withdraw.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-black/50 rounded-lg p-3 border border-gray-700 hover:border-red-500/50 transition-all"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-red-400 font-bold text-lg">-{withdraw.amount.toFixed(2)} USDT</p>
                      <p className="text-xs text-gray-500">
                        {withdraw.date} - {withdraw.time}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Balance después</p>
                      <p className="text-cyan-400 font-bold">{withdraw.balanceAfter.toFixed(2)} USDT</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <div className="flex gap-3 pt-5 mt-3 border-t border-gray-800">
            <button
              onClick={onClose}
              className="flex-1 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg font-bold hover:from-cyan-500 hover:to-blue-500 transition-all"
            >
              Cerrar
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}