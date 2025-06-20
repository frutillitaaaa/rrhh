import { NextResponse } from 'next/server';
import { obtenerTodasLasSolicitudes, crearSolicitud } from '@/lib/services/solicitudService';

export async function GET() {
    try {
        const solicitudes = await obtenerTodasLasSolicitudes();
        return NextResponse.json(solicitudes);
    } catch (error) {
        return NextResponse.json({ message: 'Error al obtener solicitudes', error: (error as Error).message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const nuevaSolicitud = await crearSolicitud(data);
        return NextResponse.json(nuevaSolicitud, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: 'Error al crear la solicitud', error: (error as Error).message }, { status: 400 });
    }
}