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

        if (!Array.isArray(data)) {
            const nuevoCandidato = await crearCandidato(data);
            return NextResponse.json(nuevoCandidato, { status: 201 }); 
        }
        const nuevosCandidatos = await Promise.all(data.map(crearCandidato));
        return NextResponse.json(nuevosCandidatos, {status: 201});
    
    } catch (error) {
        return NextResponse.json({ message: 'Error al crear el candidato', error: (error as Error).message }, { status: 400 });
    }
}