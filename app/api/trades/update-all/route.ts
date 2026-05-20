import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const tradesFilePath = path.join(process.cwd(), 'trades.json');

function saveTrades(trades: any[]) {
  try {
    fs.writeFileSync(tradesFilePath, JSON.stringify(trades, null, 2));
    return true;
  } catch (error) {
    console.error('Error guardando archivo:', error);
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const trades = await request.json();
    const success = saveTrades(trades);
    
    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Error al guardar' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error POST update-all:', error);
    return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 });
  }
}