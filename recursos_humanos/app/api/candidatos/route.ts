import { NextResponse } from 'next/server';
import { obtenerTodosLosCandidatos, crearCandidato } from '@/lib/services/candidatoService';

export async function GET() {
    try {
        const candidatos = await obtenerTodosLosCandidatos();
        return NextResponse.json(candidatos);
    } catch (error) {
        return NextResponse.json({ message: 'Error al obtener candidatos', error: (error as Error).message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const nuevoCandidato = await crearCandidato(data);
        return NextResponse.json(nuevoCandidato, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: 'Error al crear el candidato', error: (error as Error).message }, { status: 400 });
    }
}