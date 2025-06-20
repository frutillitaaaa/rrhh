import { NextResponse } from 'next/server';
import { obtenerDepartamentoPorArea, actualizarDepartamento, eliminarDepartamento } from '@/lib/services/departamentoService';

interface Params {
    area: string;
}

export async function GET(request: Request, context: { params: Params }) {
    try {
        const area = decodeURIComponent(context.params.area);
        const departamento = await obtenerDepartamentoPorArea(area);
        if (!departamento) {
            return NextResponse.json({ message: 'Departamento no encontrado' }, { status: 404 });
        }
        return NextResponse.json(departamento);
    } catch (error) {
        return NextResponse.json({ message: 'Error al obtener el departamento', error: (error as Error).message }, { status: 500 });
    }
}

export async function PUT(request: Request, context: { params: Params }) {
    try {
        const area = decodeURIComponent(context.params.area);
        const data = await request.json();
        await actualizarDepartamento(area, data);
        return NextResponse.json({ message: 'Departamento actualizado con éxito' });
    } catch (error) {
        return NextResponse.json({ message: 'Error al actualizar el departamento', error: (error as Error).message }, { status: 400 });
    }
}

export async function DELETE(request: Request, context: { params: Params }) {
    try {
        const area = decodeURIComponent(context.params.area);
        await eliminarDepartamento(area);
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        return NextResponse.json({ message: 'Error al eliminar el departamento', error: (error as Error).message }, { status: 500 });
    }
}