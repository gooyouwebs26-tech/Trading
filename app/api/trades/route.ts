import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Ruta del archivo donde se guardan los trades
const tradesFilePath = path.join(process.cwd(), 'trades.json');

// Función para leer los trades del archivo
function getTrades() {
  try {
    if (fs.existsSync(tradesFilePath)) {
      const data = fs.readFileSync(tradesFilePath, 'utf-8');
      if (!data || data.trim() === '') {
        return [];
      }
      const trades = JSON.parse(data);
      
      // Migrar trades antiguos: añadir campo 'estado' si no existe
      return trades.map((trade: any) => {
        if (!trade.estado) {
          // Si el trade tiene resultado, está cerrado
          if (trade.resultado !== undefined) {
            return { ...trade, estado: 'cerrado' };
          }
          // Si no tiene resultado, está abierto
          return { ...trade, estado: 'abierto' };
        }
        return trade;
      });
    }
  } catch (error) {
    console.error('Error leyendo archivo:', error);
  }
  return [];
}

// Función para guardar trades en el archivo
function saveTrades(trades: any[]) {
  try {
    fs.writeFileSync(tradesFilePath, JSON.stringify(trades, null, 2));
  } catch (error) {
    console.error('Error guardando archivo:', error);
  }
}

// GET: Obtener todos los trades
export async function GET() {
  try {
    const trades = getTrades();
    return NextResponse.json(trades);
  } catch (error) {
    console.error('Error GET trades:', error);
    return NextResponse.json({ error: 'Error al cargar trades' }, { status: 500 });
  }
}

// POST: Guardar un nuevo trade
export async function POST(request: Request) {
  try {
    const newTrade = await request.json();
    
    // Leer trades existentes
    const trades = getTrades();
    
    // Crear nuevo trade con ID único y estado por defecto
    const tradeWithId = {
      id: Date.now().toString(),
      ...newTrade,
      estado: newTrade.estado || 'cerrado',
      createdAt: new Date().toISOString()
    };
    
    // Añadir y guardar
    trades.push(tradeWithId);
    saveTrades(trades);
    
    return NextResponse.json(tradeWithId);
  } catch (error) {
    console.error('Error POST trade:', error);
    return NextResponse.json({ error: 'Error al guardar trade' }, { status: 500 });
  }
}

// 👈 NUEVO: DELETE - Eliminar todos los trades (RESET)
export async function DELETE() {
  try {
    // Vaciar el archivo de trades
    saveTrades([]);
    console.log('✅ Todos los trades han sido eliminados');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Todos los trades han sido eliminados correctamente' 
    });
  } catch (error) {
    console.error('Error DELETE trades:', error);
    return NextResponse.json({ 
      error: 'Error al eliminar trades' 
    }, { status: 500 });
  }
}