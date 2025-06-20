import { NextResponse } from 'next/server';
import { obtenerSolicitudPorId, actualizarSolicitud, eliminarSolicitud } from '@/lib/services/solicitudService';

interface Params {
    id: string;
}

export async function GET(request: Request, context: { params: Params }) {
    try {
        const solicitud = await obtenerSolicitudPorId(context.params.id);
        if (!solicitud) {
            return NextResponse.json({ message: 'Solicitud no encontrada' }, { status: 404 });
        }
        return NextResponse.json(solicitud);
    } catch (error) {
        return NextResponse.json({ message: 'Error al obtener la solicitud', error: (error as Error).message }, { status: 500 });
    }
}

export async function PUT(request: Request, context: { params: Params }) {
    try {
        const data = await request.json();
        const solicitudActualizada = await actualizarSolicitud(context.params.id, data);
        if (!solicitudActualizada) {
            return NextResponse.json({ message: 'Solicitud no encontrada' }, { status: 404 });
        }
        return NextResponse.json(solicitudActualizada);
    } catch (error) {
        return NextResponse.json({ message: 'Error al actualizar la solicitud', error: (error as Error).message }, { status: 400 });
    }
}

export async function DELETE(request: Request, context: { params: Params }) {
    try {
        const resultado = await eliminarSolicitud(context.params.id);
        if (resultado.deletedCount === 0) {
            return NextResponse.json({ message: 'Solicitud no encontrada' }, { status: 404 });
        }
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        return NextResponse.json({ message: 'Error al eliminar la solicitud', error: (error as Error).message }, { status: 500 });
    }
}