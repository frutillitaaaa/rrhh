import { NextResponse } from 'next/server';
import { obtenerCandidatoPorId, actualizarCandidato, eliminarCandidato } from '@/lib/services/candidatoService';

interface Params {
    id: string;
}

export async function GET(request: Request, context: { params: Params }) {
    try {
        const candidato = await obtenerCandidatoPorId(context.params.id);
        if (!candidato) {
            return NextResponse.json({ message: 'Candidato no encontrado' }, { status: 404 });
        }
        return NextResponse.json(candidato);
    } catch (error) {
        return NextResponse.json({ message: 'Error al obtener el candidato', error: (error as Error).message }, { status: 500 });
    }
}

export async function PUT(request: Request, context: { params: Params }) {
    try {
        const data = await request.json();
        const candidatoActualizado = await actualizarCandidato(context.params.id, data);
        if (!candidatoActualizado) {
            return NextResponse.json({ message: 'Candidato no encontrado' }, { status: 404 });
        }
        return NextResponse.json(candidatoActualizado);
    } catch (error) {
        return NextResponse.json({ message: 'Error al actualizar el candidato', error: (error as Error).message }, { status: 400 });
    }
}

export async function DELETE(request: Request, context: { params: Params }) {
    try {
        const resultado = await eliminarCandidato(context.params.id);
        if (resultado.deletedCount === 0) {
            return NextResponse.json({ message: 'Candidato no encontrado' }, { status: 404 });
        }
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        return NextResponse.json({ message: 'Error al eliminar el candidato', error: (error as Error).message }, { status: 500 });
    }
}