'use client';

import { useState, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import OpenTradeModal from './components/OpenTradeModal';
import CloseTradeModal from './components/CloseTradeModal';
import TradeDetailsModal from './components/TradeDetailsModal';
import WithdrawModal from './components/WithdrawModal';
import WithdrawHistoryModal from './components/WithdrawHistoryModal';
import FormationsMenu from './components/FormationsMenu';
import AddFormationModal from './components/AddFormationModal';

// Interfaz para los retiros
interface WithdrawRecord {
  id: string;
  amount: number;
  date: string;
  time: string;
  balanceAfter: number;
}

export default function Home() {
  const [trades, setTrades] = useState<any[]>([]);
  const [isOpenTradeModalOpen, setIsOpenTradeModalOpen] = useState(false);
  const [isCloseTradeModalOpen, setIsCloseTradeModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedTradeToClose, setSelectedTradeToClose] = useState<any>(null);
  const [selectedTrade, setSelectedTrade] = useState<any>(null);
  const [showOpenTradesList, setShowOpenTradesList] = useState(false);
  const [loading, setLoading] = useState(true);
  const [startBalance, setStartBalance] = useState(1000);
  const [editingBalance, setEditingBalance] = useState(false);
  const [tempBalance, setTempBalance] = useState('1000');
  const [selectedChart1, setSelectedChart1] = useState('hour');
  const [selectedChart2, setSelectedChart2] = useState('asset');

  // Estados para retiros
  const [withdrawals, setWithdrawals] = useState<WithdrawRecord[]>([]);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isWithdrawHistoryModalOpen, setIsWithdrawHistoryModalOpen] = useState(false);
  const [totalWithdrawn, setTotalWithdrawn] = useState(0);

  // Estado para el modal de añadir formación
  const [isAddFormationModalOpen, setIsAddFormationModalOpen] = useState(false);
  
  // Estado para confirmación de reset
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // 🔥 NUEVO: Estado para formaciones
  const [formations, setFormations] = useState<any[]>([]);

  // Cargar trades al iniciar
  useEffect(() => {
    fetchTrades();
  }, []);

  // Cargar balance guardado
  useEffect(() => {
    const savedBalance = localStorage.getItem('startBalance');
    if (savedBalance) {
      setStartBalance(parseFloat(savedBalance));
      setTempBalance(savedBalance);
    }
  }, []);

  // Cargar historial de retiros
  useEffect(() => {
    const savedWithdrawals = localStorage.getItem('withdrawHistory');
    if (savedWithdrawals) {
      const parsed = JSON.parse(savedWithdrawals);
      setWithdrawals(parsed);
      const total = parsed.reduce((sum: number, w: WithdrawRecord) => sum + w.amount, 0);
      setTotalWithdrawn(total);
    }
  }, []);

  // 🔥 NUEVO: Cargar formaciones guardadas
  useEffect(() => {
    const saved = localStorage.getItem('tradingFormations');
    if (saved) {
      setFormations(JSON.parse(saved));
    } else {
      // Datos de ejemplo para mostrar la primera vez
      const ejemplos = [
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

  // Guardar historial de retiros cuando cambie
  useEffect(() => {
    localStorage.setItem('withdrawHistory', JSON.stringify(withdrawals));
    const total = withdrawals.reduce((sum, w) => sum + w.amount, 0);
    setTotalWithdrawn(total);
  }, [withdrawals]);

  const fetchTrades = async () => {
    try {
      const res = await fetch('/api/trades');
      const data = await res.json();
      setTrades(data.reverse());
    } catch (error) {
      console.error('Error cargando trades:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveTrade = async (newTrade: any) => {
    try {
      const res = await fetch('/api/trades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTrade)
      });
      const saved = await res.json();
      setTrades([saved, ...trades]);
    } catch (error) {
      console.error('Error guardando trade:', error);
    }
  };

  const updateTrade = async (updatedTrade: any) => {
    try {
      const res = await fetch('/api/trades');
      const allTrades = await res.json();
      
      const filteredTrades = allTrades.filter((t: any) => t.id !== updatedTrade.id);
      const newTrades = [updatedTrade, ...filteredTrades];
      
      const saveRes = await fetch('/api/trades/update-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTrades)
      });
      
      if (saveRes.ok) {
        setTrades(newTrades);
        console.log('✅ Trade cerrado correctamente');
      } else {
        console.error('Error al guardar');
      }
    } catch (error) {
      console.error('Error actualizando trade:', error);
    }
  };

  const updateBalance = (newBalance: number) => {
    setStartBalance(newBalance);
    localStorage.setItem('startBalance', newBalance.toString());
    setTempBalance(newBalance.toString());
    setEditingBalance(false);
  };

  const handleWithdraw = (amount: number) => {
    const totalPnL = closedTrades.reduce((sum, t) => sum + t.resultado - (t.comisiones || 0), 0);
    const currentBalance = startBalance + totalPnL - totalWithdrawn;
    const newBalance = currentBalance - amount;
    
    const newWithdraw: WithdrawRecord = {
      id: Date.now().toString(),
      amount: amount,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      balanceAfter: newBalance
    };
    
    setWithdrawals(prev => [newWithdraw, ...prev]);
  };

  // 🔥 NUEVO: Función para añadir formación (guardar en localStorage y actualizar estado)
  const addFormation = (newFormation: any) => {
    const currentFormations = [...formations];
    const updatedFormations = [...currentFormations, newFormation];
    localStorage.setItem('tradingFormations', JSON.stringify(updatedFormations));
    setFormations(updatedFormations);
    console.log('📚 Formación guardada:', newFormation.nombre);
  };

  // FUNCIÓN DE RESET TOTAL - Borra todos los datos
  const resetAllData = async () => {
    try {
      localStorage.removeItem('startBalance');
      localStorage.removeItem('withdrawHistory');
      localStorage.removeItem('tradingFormations');
      
      const res = await fetch('/api/trades', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (res.ok) {
        console.log('✅ Todos los datos han sido reseteados');
      } else {
        console.error('Error al resetear trades');
      }
      
      window.location.reload();
      
    } catch (error) {
      console.error('Error al resetear:', error);
      window.location.reload();
    }
  };

  // Filtrar trades abiertos y cerrados
  const openTrades = trades.filter(t => t.estado === 'abierto');
  const closedTrades = trades.filter(t => t.estado === 'cerrado' || t.resultado !== undefined);

  // Calcular estadísticas
  const totalTrades = closedTrades.length;
  const winningTrades = closedTrades.filter(t => t.resultado > 0).length;
  const winRate = totalTrades > 0 ? ((winningTrades / totalTrades) * 100).toFixed(1) : 0;
  const totalPnL = closedTrades.reduce((sum, t) => sum + t.resultado - (t.comisiones || 0), 0);
  const currentBalance = startBalance + totalPnL - totalWithdrawn;
  
  const avgWin = closedTrades.filter(t => t.resultado > 0).reduce((sum, t) => sum + t.resultado, 0) / (winningTrades || 1);
  const avgLoss = closedTrades.filter(t => t.resultado < 0).reduce((sum, t) => sum + t.resultado, 0) / (closedTrades.filter(t => t.resultado < 0).length || 1);
  const maxGain = closedTrades.length > 0 ? Math.max(...closedTrades.map(t => t.resultado)) : 0;
  const maxLoss = closedTrades.length > 0 ? Math.min(...closedTrades.map(t => t.resultado)) : 0;

  // Datos para gráficos
  const getDayName = (dateStr: string) => {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const date = new Date(dateStr);
    return days[date.getDay()];
  };

  const getHourKey = (hourStr: string) => {
    const hour = parseInt(hourStr.split(':')[0]);
    return `${hour}:00`;
  };

  const hourData = closedTrades.reduce((acc, trade) => {
    const hour = getHourKey(trade.horaApertura);
    if (!acc[hour]) acc[hour] = 0;
    acc[hour] += trade.resultado;
    return acc;
  }, {} as Record<string, number>);
  const hourChartData = Object.entries(hourData)
    .map(([hour, pnl]) => ({ hour, pnl }))
    .sort((a, b) => parseInt(a.hour) - parseInt(b.hour));

  const dayData = closedTrades.reduce((acc, trade) => {
    const day = getDayName(trade.fechaApertura);
    if (!acc[day]) acc[day] = 0;
    acc[day] += trade.resultado;
    return acc;
  }, {} as Record<string, number>);
  const dayOrder = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const dayChartData = dayOrder.map(day => ({ day, pnl: dayData[day] || 0 }));

  const assetData = closedTrades.reduce((acc, trade) => {
    if (!acc[trade.activo]) acc[trade.activo] = 0;
    acc[trade.activo] += trade.resultado;
    return acc;
  }, {} as Record<string, number>);
  const assetChartData = Object.entries(assetData).map(([asset, pnl]) => ({ asset, pnl }));

  let runningBalanceForChart = startBalance;
  const balanceHistory = closedTrades.map((trade, index) => {
    runningBalanceForChart += trade.resultado - (trade.comisiones || 0);
    return { trade: index + 1, balance: runningBalanceForChart };
  });

const emotionData = closedTrades.reduce((acc, trade) => {
  const emotion = trade.estadoEmocional || 'No registrado';
  if (!acc[emotion]) acc[emotion] = { total: 0, count: 0 };
  acc[emotion].total += trade.resultado;
  acc[emotion].count += 1;
  return acc;
}, {} as Record<string, { total: number; count: number }>);

// Convertir a array con tipo explícito
const emotionChartData: { emotion: string; avgPnL: number; totalPnL: number; trades: number }[] = [];

for (const emotion in emotionData) {
  const data = emotionData[emotion];
  emotionChartData.push({
    emotion: emotion,
    avgPnL: data.count > 0 ? data.total / data.count : 0,
    totalPnL: data.total,
    trades: data.count
  });
}

  const topTrades = [...closedTrades].sort((a, b) => b.resultado - a.resultado).slice(0, 10);
  const worstTrades = [...closedTrades].sort((a, b) => a.resultado - b.resultado).slice(0, 10);

const bestHour = Object.entries(hourData).sort((a, b) => (b[1] as number) - (a[1] as number))[0];
const bestDay = Object.entries(dayData).sort((a, b) => (b[1] as number) - (a[1] as number))[0];
const bestAsset = Object.entries(assetData).sort((a, b) => (b[1] as number) - (a[1] as number))[0];
const bestEmotion = Object.entries(emotionData).sort((a, b) => (b[1] as { total: number; count: number }).total - (a[1] as { total: number; count: number }).total)[0];

  const COLORS = ['#00ccff', '#aa00ff', '#00ff88', '#ff3366', '#ffaa00', '#00ffcc'];

  const renderChart = (chartType: string) => {
    switch (chartType) {
      case 'hour':
        return (
          <>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={hourChartData}>
                <CartesianGrid stroke="#333" strokeDasharray="3 3" />
                <XAxis dataKey="hour" stroke="#00ccff" fontSize={10} />
                <YAxis stroke="#00ccff" fontSize={10} />
                <Tooltip active={false} />
                <Bar dataKey="pnl" fill="#00ccff" />
              </BarChart>
            </ResponsiveContainer>
            {bestHour && <p className="text-xs text-cyan-400 mt-2">✨ Mejor hora: {bestHour[0]} (+${(bestHour[1] as number).toFixed(2)})</p>}
          </>
        );
      case 'day':
        return (
          <>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={dayChartData}>
                <CartesianGrid stroke="#333" strokeDasharray="3 3" />
                <XAxis dataKey="day" stroke="#aa00ff" fontSize={10} />
                <YAxis stroke="#aa00ff" fontSize={10} />
                <Tooltip active={false} />
                <Bar dataKey="pnl" fill="#aa00ff" />
              </BarChart>
            </ResponsiveContainer>
            {bestDay && <p className="text-xs text-purple-400 mt-2">✨ Mejor día: {bestDay[0]} (+${(bestDay[1] as number).toFixed(2)})</p>}
          </>
        );
      case 'asset':
        return (
          <>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={assetChartData}
                  dataKey="pnl"
                  nameKey="asset"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  label={({ name, value }) => `${name}: $${value.toFixed(0)}`}
                  fontSize={10}
                >
                  {assetChartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip active={false} />
              </PieChart>
            </ResponsiveContainer>
            {bestAsset && <p className="text-xs text-green-400 mt-2">✨ Mejor activo: {bestAsset[0]} (+${(bestAsset[1] as number).toFixed(2)})</p>}
          </>
        );
      case 'balance':
        return (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={balanceHistory}>
              <CartesianGrid stroke="#333" strokeDasharray="3 3" />
              <XAxis dataKey="trade" stroke="#00ff88" fontSize={10} />
              <YAxis stroke="#00ff88" fontSize={10} />
              <Tooltip active={false} />
              <Line type="monotone" dataKey="balance" stroke="#00ff88" strokeWidth={2} dot={{ fill: '#00ff88', r: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'emotion':
        return (
          <>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={emotionChartData}>
                <CartesianGrid stroke="#333" strokeDasharray="3 3" />
                <XAxis dataKey="emotion" stroke="#ff3366" fontSize={10} />
                <YAxis stroke="#ff3366" fontSize={10} />
                <Tooltip active={false} />
                <Bar dataKey="avgPnL" fill="#ff3366" />
              </BarChart>
            </ResponsiveContainer>
            {bestEmotion && <p className="text-xs text-red-400 mt-2">✨ Mejor estado: {bestEmotion[0]} (+${(bestEmotion[1] as { total: number; count: number }).total.toFixed(2)} total)</p>}
          </>
        );
      case 'top':
        return (
          <div className="overflow-y-auto max-h-[180px] space-y-1">
            {topTrades.map((trade, i) => (
              <div key={trade.id} className="flex justify-between items-center p-2 border-b border-gray-700 text-xs">
                <span className="text-cyan-400 font-bold">#{i + 1}</span>
                <span>{trade.fechaApertura}</span>
                <span className="font-bold text-green-400">+${trade.resultado.toFixed(2)}</span>
                <span className="text-gray-400 truncate max-w-[120px]">{trade.estrategia || '-'}</span>
              </div>
            ))}
            {topTrades.length === 0 && <p className="text-gray-400 text-xs text-center py-4">No hay trades cerrados aún</p>}
          </div>
        );
      case 'worst':
        return (
          <div className="overflow-y-auto max-h-[180px] space-y-1">
            {worstTrades.map((trade, i) => (
              <div key={trade.id} className="flex justify-between items-center p-2 border-b border-gray-700 text-xs">
                <span className="text-red-400 font-bold">#{i + 1}</span>
                <span>{trade.fechaApertura}</span>
                <span className="font-bold text-red-400">${trade.resultado.toFixed(2)}</span>
                <span className="text-gray-400 truncate max-w-[120px]">{trade.aciertosErrores || '-'}</span>
              </div>
            ))}
            {worstTrades.length === 0 && <p className="text-gray-400 text-xs text-center py-4">No hay trades cerrados aún</p>}
          </div>
        );
      default:
        return null;
    }
  };

  const exportToCSV = () => {
    const headers = ['Fecha', 'Hora', 'Activo', 'Tipo', 'Resultado', 'Comisiones', 'Estrategia', 'Estado Emocional', 'Aciertos/Errores', 'Estado'];
    const rows = trades.map(t => [
      t.fechaApertura,
      t.horaApertura,
      t.activo,
      t.tipo,
      t.resultado || 'Pendiente',
      t.comisiones || 0,
      t.estrategia || '',
      t.estadoEmocional || '',
      t.aciertosErrores || '',
      t.estado || 'cerrado'
    ]);
    
    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trades_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 relative">
      <div className="lightning"></div>
      <div className="waves">
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave"></div>
      </div>

      <div className="relative z-10">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold neon-text-cyan text-center md:text-left">
            ⚡ IRON TRADER PANEL ⚡
          </h1>
          <div className="flex gap-2 flex-wrap justify-center">
            {/* 🔥 MODIFICADO: Pasamos formations como prop */}
            <FormationsMenu 
              formations={formations} 
              onAddFormation={() => setIsAddFormationModalOpen(true)} 
            />
            <button
              onClick={() => setShowOpenTradesList(!showOpenTradesList)}
              className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full font-bold text-xs md:text-sm transition-all ${
                showOpenTradesList 
                  ? 'bg-cyan-600 hover:bg-cyan-700' 
                  : 'bg-cyan-700 hover:bg-cyan-600'
              } shadow-[0_0_15px_rgba(0,255,255,0.3)]`}
            >
              🔥 TRADES ABIERTOS 🔥 {openTrades.length > 0 && `(${openTrades.length})`}
            </button>
            <button
              onClick={() => setIsOpenTradeModalOpen(true)}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 px-3 md:px-4 py-1.5 md:py-2 rounded-full font-bold text-xs md:text-sm hover:scale-105 transition-all shadow-[0_0_15px_rgba(0,255,255,0.5)]"
            >
              ⚡ ABRIR TRADE ⚡
            </button>
            <button
              onClick={exportToCSV}
              className="bg-gray-700 hover:bg-gray-600 px-3 md:px-4 py-1.5 md:py-2 rounded-full font-bold text-xs md:text-sm transition-all"
            >
              📥 Exportar CSV 📥
            </button>
            <button
              onClick={() => setShowResetConfirm(true)}
              className="bg-red-700 hover:bg-red-600 px-3 md:px-4 py-1.5 md:py-2 rounded-full font-bold text-xs md:text-sm transition-all shadow-[0_0_15px_rgba(255,0,0,0.3)]"
            >
              🗑️ RESET
            </button>
          </div>
        </div>

        {/* MODAL DE CONFIRMACIÓN DE RESET */}
        {showResetConfirm && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-[200]">
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 w-[450px] max-w-[90vw] border border-red-500 shadow-[0_0_30px_rgba(255,0,0,0.5)]">
              <h2 className="text-2xl font-bold text-red-400 mb-4 text-center">
                ⚠️ ¿RESETEAR TODO?
              </h2>
              <div className="text-center mb-6">
                <p className="text-gray-300 mb-2">Se borrarán PERMANENTEMENTE:</p>
                <ul className="text-left text-sm text-gray-400 space-y-1 mb-4 bg-black/50 p-3 rounded-lg">
                  <li>💰 • Balance inicial y retiros</li>
                  <li>📚 • Todas las formaciones guardadas</li>
                  <li>📊 • Historial completo de retiros</li>
                  <li>📋 • TODOS los trades (abiertos y cerrados)</li>
                </ul>
                <p className="text-yellow-400 text-xs font-bold">
                  ⚡ Esta acción NO se puede deshacer ⚡
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-2 bg-gray-700 rounded-lg font-bold hover:bg-gray-600"
                >
                  Cancelar
                </button>
                <button
                  onClick={resetAllData}
                  className="flex-1 py-2 bg-gradient-to-r from-red-600 to-red-800 rounded-lg font-bold hover:from-red-500 hover:to-red-700 transition-all"
                >
                  🗑️ RESET TODO
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Lista desplegable de trades abiertos */}
        {showOpenTradesList && openTrades.length > 0 && (
          <div className="mb-6 glow-card border border-red-500 p-4 rounded-xl">
            <h3 className="text-lg font-bold text-red-400 mb-3">🔥 Trades Abiertos</h3>
            <div className="space-y-2">
              {openTrades.map((trade) => (
                <div key={trade.id} className="flex justify-between items-center p-3 bg-black/50 rounded-lg border border-red-500/30">
                  <div>
                    <p className="font-bold text-cyan-400">{trade.activo} - {trade.tipo}</p>
                    <p className="text-xs text-gray-400">Entrada: ${trade.precioEntrada} | ${trade.cantidadUsdt} USDT | {trade.apalancamiento}x</p>
                    <p className="text-xs text-gray-500">{trade.fechaApertura} {trade.horaApertura}</p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedTradeToClose(trade);
                      setIsCloseTradeModalOpen(true);
                      setShowOpenTradesList(false);
                    }}
                    className="bg-green-600 hover:bg-green-500 px-3 py-1 rounded text-xs font-bold"
                  >
                    ✅ CERRAR
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Layout de dos columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
          {/* Columna izquierda: KPIs */}
          <div className="lg:col-span-1 space-y-3 md:space-y-4">
            <div className="glow-card neon-border-cyan p-3 md:p-4 rounded-xl">
              <p className="text-gray-400 text-xs uppercase tracking-wider">Balance Inicial</p>
              {editingBalance ? (
                <div className="flex gap-2 items-center mt-1">
                  <input
                    type="number"
                    value={tempBalance}
                    onChange={(e) => setTempBalance(e.target.value)}
                    className="bg-black border border-cyan-500 rounded px-3 py-1 text-white w-28"
                  />
                  <button onClick={() => updateBalance(parseFloat(tempBalance))} className="bg-green-600 px-3 py-1 rounded text-xs hover:bg-green-500">Guardar</button>
                  <button onClick={() => setEditingBalance(false)} className="bg-gray-600 px-3 py-1 rounded text-xs hover:bg-gray-500">Cancelar</button>
                </div>
              ) : (
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xl md:text-2xl font-bold neon-text-green">${startBalance.toFixed(2)}</p>
                  <button onClick={() => setEditingBalance(true)} className="text-xs text-gray-400 hover:text-cyan-400 transition-colors">✏️ Editar</button>
                </div>
              )}
            </div>

            <div className="glow-card neon-border-purple p-3 md:p-4 rounded-xl">
              <p className="text-gray-400 text-xs uppercase tracking-wider">Balance Actual</p>
              <p className="text-xl md:text-2xl font-bold neon-text-purple mt-1">${currentBalance.toFixed(2)}</p>
              <div className="flex justify-between text-xs mt-1">
                <span className="text-gray-500">PnL: {totalPnL >= 0 ? '+' : ''}{totalPnL.toFixed(2)} USDT</span>
                {totalWithdrawn > 0 && <span className="text-red-400">Retirado: -${totalWithdrawn.toFixed(2)}</span>}
              </div>
            </div>

            <div className="glow-card neon-border-cyan p-3 md:p-4 rounded-xl">
              <p className="text-gray-400 text-xs uppercase tracking-wider">Win Rate</p>
              <p className="text-xl md:text-2xl font-bold neon-text-cyan mt-1">{winRate}%</p>
              <p className="text-xs text-gray-500 mt-1">{winningTrades}/{totalTrades} trades</p>
            </div>

            <div className="glow-card neon-border-purple p-3 md:p-4 rounded-xl">
              <p className="text-gray-400 text-xs uppercase tracking-wider">Total Trades</p>
              <p className="text-xl md:text-2xl font-bold neon-text-purple mt-1">{totalTrades}</p>
              <p className="text-xs text-gray-500 mt-1">Avg Win: ${avgWin.toFixed(0)} | Avg Loss: ${Math.abs(avgLoss).toFixed(0)}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div className="glow-card neon-border-cyan p-3 md:p-4 rounded-xl">
                <p className="text-gray-400 text-xs uppercase tracking-wider">🏆 Máx Ganancia</p>
                <p className="text-lg md:text-xl font-bold neon-text-green mt-1">+${maxGain.toFixed(0)}</p>
              </div>
              <div className="glow-card neon-border-purple p-3 md:p-4 rounded-xl">
                <p className="text-gray-400 text-xs uppercase tracking-wider">📉 Máx Pérdida</p>
                <p className="text-lg md:text-xl font-bold neon-text-red mt-1">${maxLoss.toFixed(0)}</p>
              </div>
            </div>

            {openTrades.length > 0 && (
              <div className="glow-card border border-red-500 p-3 md:p-4 rounded-xl">
                <p className="text-gray-400 text-xs uppercase tracking-wider">🔥 Trades Abiertos</p>
                <p className="text-xl md:text-2xl font-bold text-red-400 mt-1">{openTrades.length}</p>
              </div>
            )}

            {/* Botones de Retiro y Historial */}
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <button
                onClick={() => setIsWithdrawModalOpen(true)}
                className="bg-gradient-to-r from-red-600 to-orange-600 py-2 md:py-2.5 rounded-xl font-bold text-xs md:text-sm hover:from-red-500 hover:to-orange-500 transition-all shadow-[0_0_15px_rgba(255,0,0,0.3)]"
              >
                💸 RETIRAR
              </button>
              <button
                onClick={() => setIsWithdrawHistoryModalOpen(true)}
                className="bg-gray-700 py-2 md:py-2.5 rounded-xl font-bold text-xs md:text-sm hover:bg-gray-600 transition-all"
              >
                📜 HISTORIAL
              </button>
            </div>
          </div>

          {/* Columna derecha: Gráficos */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            <div className="glow-card neon-border-cyan p-3 md:p-4 rounded-xl">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
                <h2 className="text-base md:text-lg font-bold text-cyan-400">📊 Gráfico 1</h2>
                <select
                  value={selectedChart1}
                  onChange={(e) => setSelectedChart1(e.target.value)}
                  className="bg-black/50 backdrop-blur-sm border border-cyan-500 rounded-lg px-3 py-1.5 text-cyan-400 text-xs md:text-sm cursor-pointer hover:bg-black/70 w-full sm:w-auto"
                >
                  <option value="hour">📊 Rendimiento por Hora</option>
                  <option value="day">📅 Rendimiento por Día</option>
                  <option value="asset">🪙 Rendimiento por Activo</option>
                  <option value="balance">📈 Evolución de Balance</option>
                  <option value="emotion">😤 Rendimiento por Estado</option>
                </select>
              </div>
              {loading ? (
                <p className="text-gray-400 text-center py-8">Cargando datos...</p>
              ) : closedTrades.length === 0 ? (
                <p className="text-gray-400 text-center py-8">Añade trades cerrados para ver estadísticas</p>
              ) : (
                renderChart(selectedChart1)
              )}
            </div>

            <div className="glow-card neon-border-purple p-3 md:p-4 rounded-xl">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
                <h2 className="text-base md:text-lg font-bold text-purple-400">📊 Gráfico 2</h2>
                <select
                  value={selectedChart2}
                  onChange={(e) => setSelectedChart2(e.target.value)}
                  className="bg-black/50 backdrop-blur-sm border border-purple-500 rounded-lg px-3 py-1.5 text-purple-400 text-xs md:text-sm cursor-pointer hover:bg-black/70 w-full sm:w-auto"
                >
                  <option value="top">🎯 Top 10 Mejores Trades</option>
                  <option value="worst">💀 Top 10 Peores Trades</option>
                  <option value="emotion">😤 Rendimiento por Estado</option>
                  <option value="asset">🪙 Rendimiento por Activo</option>
                  <option value="hour">📊 Rendimiento por Hora</option>
                  <option value="day">📅 Rendimiento por Día</option>
                </select>
              </div>
              {loading ? (
                <p className="text-gray-400 text-center py-8">Cargando datos...</p>
              ) : closedTrades.length === 0 ? (
                <p className="text-gray-400 text-center py-8">Añade trades cerrados para ver estadísticas</p>
              ) : (
                renderChart(selectedChart2)
              )}
            </div>
          </div>
        </div>

        {/* Tabla de trades */}
        <div className="glow-card neon-border-cyan rounded-xl overflow-hidden">
          <div className="p-3 md:p-4 border-b border-cyan-500/30 bg-gray-900/50">
            <h2 className="text-base md:text-lg font-bold text-cyan-400">📋 Historial de Trades</h2>
            <p className="text-xs text-gray-500 mt-1">Total: {trades.length} trades | Abiertos: {openTrades.length} | Cerrados: {closedTrades.length}</p>
          </div>
          
          {loading ? (
            <div className="p-8 text-center text-gray-400">Cargando trades...</div>
          ) : trades.length === 0 ? (
            <div className="p-8 text-center text-gray-400">No hay trades aún. ¡Abre tu primer trade!</div>
          ) : (
            <div className="overflow-x-auto overflow-y-auto max-h-[500px]">
              <table className="w-full text-xs md:text-sm">
                                <thead className="sticky top-0 bg-gray-900 z-10">
                  <tr className="text-left text-gray-400 border-b border-gray-700">
                    <th className="p-2 md:p-3 bg-gray-900">Estado</th>
                    <th className="p-2 md:p-3 bg-gray-900">Fecha</th>
                    <th className="p-2 md:p-3 bg-gray-900">Hora</th>
                    <th className="p-2 md:p-3 bg-gray-900">Activo</th>
                    <th className="p-2 md:p-3 bg-gray-900">Tipo</th>
                    <th className="p-2 md:p-3 bg-gray-900">Entrada</th>
                    <th className="p-2 md:p-3 bg-gray-900">Resultado</th>
                    <th className="p-2 md:p-3 bg-gray-900">Estrategia</th>
                    <th className="p-2 md:p-3 bg-gray-900">Estado Emocional</th>
                    <th className="p-2 md:p-3 bg-gray-900">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {trades.map((trade, idx) => {
                    const isOpen = trade.estado === "abierto";
                    const isPositive = trade.resultado > 0;
                    const isNegative = trade.resultado < 0;
                    let emotionClass = "bg-red-900 text-red-300";
                    if (trade.estadoEmocional === "Tranquilo") emotionClass = "bg-green-900 text-green-300";
                    else if (trade.estadoEmocional === "Lúcido") emotionClass = "bg-cyan-900 text-cyan-300";
                    else if (trade.estadoEmocional === "Nervioso") emotionClass = "bg-yellow-900 text-yellow-300";
                    
                    return (
                      <tr
                        key={trade.id || idx}
                        className={"border-b border-gray-800 hover:bg-gray-800/50 cursor-pointer transition-colors " + (isOpen ? "bg-red-900/10" : "")}
                        onClick={() => {
                          setSelectedTrade(trade);
                          setIsDetailsModalOpen(true);
                        }}
                      >
                        <td className="p-2 md:p-3">
                          {isOpen ? (
                            <span className="px-1.5 md:px-2 py-0.5 md:py-1 rounded text-[10px] md:text-xs bg-red-900 text-red-300">🔥 Abierto</span>
                          ) : (
                            <span className="px-1.5 md:px-2 py-0.5 md:py-1 rounded text-[10px] md:text-xs bg-green-900 text-green-300">✅ Cerrado</span>
                          )}
                        </td>
                        <td className="p-2 md:p-3">{trade.fechaApertura}</td>
                        <td className="p-2 md:p-3">{trade.horaApertura}</td>
                        <td className="p-2 md:p-3 font-bold text-cyan-400">{trade.activo}</td>
                        <td className="p-2 md:p-3">{trade.tipo}</td>
                        <td className="p-2 md:p-3 text-gray-300">
                          {trade.precioEntrada ? "$" + trade.precioEntrada : "-"}
                          {trade.cantidadUsdt && <span className="text-gray-500 block text-[10px] md:text-xs">${trade.cantidadUsdt} | {trade.apalancamiento}x</span>}
                        </td>
                        <td className={"p-2 md:p-3 font-bold " + (isPositive ? "text-green-400" : isNegative ? "text-red-400" : "text-gray-400")}>
                          {trade.resultado ? (isPositive ? "+" : "") + trade.resultado + " USDT" : "Pendiente"}
                        </td>
                        <td className="p-2 md:p-3 text-gray-300 max-w-[100px] md:max-w-[150px] truncate" title={trade.estrategia}>
                          {trade.estrategia || "-"}
                        </td>
                        <td className="p-2 md:p-3">
                          <span className={"px-1.5 md:px-2 py-0.5 md:py-1 rounded text-[10px] md:text-xs " + emotionClass}>
                            {trade.estadoEmocional || "-"}
                          </span>
                        </td>
                        <td className="p-2 md:p-3">
                          {isOpen && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedTradeToClose(trade);
                                setIsCloseTradeModalOpen(true);
                              }}
                              className="bg-green-600 hover:bg-green-500 px-2 md:px-3 py-0.5 md:py-1 rounded text-[10px] md:text-xs font-bold transition-colors"
                            >
                              Cerrar
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}    
        </div>
      </div>

      {/* Modales */}
      <OpenTradeModal
        isOpen={isOpenTradeModalOpen}
        onClose={() => setIsOpenTradeModalOpen(false)}
        onSave={saveTrade}
      />

      <CloseTradeModal
        isOpen={isCloseTradeModalOpen}
        onClose={() => {
          setIsCloseTradeModalOpen(false);
          setSelectedTradeToClose(null);
        }}
        onSave={updateTrade}
        trade={selectedTradeToClose}
      />

      <TradeDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedTrade(null);
        }}
        trade={selectedTrade}
      />

      <WithdrawModal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        onWithdraw={handleWithdraw}
        currentBalance={currentBalance}
      />

      <WithdrawHistoryModal
        isOpen={isWithdrawHistoryModalOpen}
        onClose={() => setIsWithdrawHistoryModalOpen(false)}
        withdrawals={withdrawals}
      />

      <AddFormationModal
        isOpen={isAddFormationModalOpen}
        onClose={() => setIsAddFormationModalOpen(false)}
        onSave={addFormation}
      />
    </div>
  );
}