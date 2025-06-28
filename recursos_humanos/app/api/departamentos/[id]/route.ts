import { NextResponse } from 'next/server';
import { obtenerDepartamentoPorNombre, actualizarDepartamento, eliminarDepartamento } from '@/lib/services/departamentoService';

interface Params {
    nombreDepartamento: string;
}

export async function GET(request: Request, { params }: { params: Params }) {
    try {
        const nombreDepartamento = params.nombreDepartamento;
        console.log(`Buscando departamento con el área: "${nombreDepartamento}"`);
        const departamento = await obtenerDepartamentoPorNombre(nombreDepartamento);
        
        if (!departamento) {
            console.log(`No se encontró el departamento para el área: "${nombreDepartamento}"`);
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
        const departamento = params.nombreDepartamento;
        
        await actualizarDepartamento(departamento, data);
        
        return NextResponse.json({ message: 'Departamento actualizado con éxito' });
    } catch (error) {
        return NextResponse.json({ message: 'Error al actualizar el departamento', error: (error as Error).message }, { status: 400 });
    }
}

export async function DELETE(request: Request, { params }: { params: Params }) {
    try {
        const nombreDepartamento = params.nombreDepartamento;
        await eliminarDepartamento(nombreDepartamento);
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        return NextResponse.json({ message: 'Error al eliminar el departamento', error: (error as Error).message }, { status: 500 });
    }
}