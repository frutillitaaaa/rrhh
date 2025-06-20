import { NextResponse } from 'next/server';
import { obtenerDepartamentoPorArea, actualizarDepartamento, eliminarDepartamento } from '@/lib/services/departamentoService';

interface Params {
    area: string;
}

export async function GET(request: Request, { params }: { params: Params }) {
    try {
        const area = params.area;
        console.log(`Buscando departamento con el área: "${area}"`);
        const departamento = await obtenerDepartamentoPorArea(area);
        
        if (!departamento) {
            console.log(`No se encontró el departamento para el área: "${area}"`);
            return NextResponse.json({ message: 'Departamento no encontrado' }, { status: 404 });
        }

        return NextResponse.json(departamento);
    } catch (error) {
        return NextResponse.json({ message: 'Error al obtener el departamento', error: (error as Error).message }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: Params }) {
    try {
        const data = await request.json();
        const area = params.area;
        
        await actualizarDepartamento(area, data);
        
        return NextResponse.json({ message: 'Departamento actualizado con éxito' });
    } catch (error) {
        return NextResponse.json({ message: 'Error al actualizar el departamento', error: (error as Error).message }, { status: 400 });
    }
}

export async function DELETE(request: Request, { params }: { params: Params }) {
    try {
        const area = params.area;
        await eliminarDepartamento(area);
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        return NextResponse.json({ message: 'Error al eliminar el departamento', error: (error as Error).message }, { status: 500 });
    }
}