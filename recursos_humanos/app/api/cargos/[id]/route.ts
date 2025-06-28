import { NextResponse } from 'next/server';

import { actualizarCargo, eliminarCargo, obtenerCargoPorNombre } from '@/lib/services/cargoService';

interface Params {
    nombreCargo: string;
}

export async function GET(request: Request, { params }: { params: Params }) {
    try {
        const nombreCargo = params.nombreCargo;
        const cargo = await obtenerCargoPorNombre(nombreCargo);
        
        if (!cargo) {
            console.log(`No se encontró el cargo: "${nombreCargo}"`);
            return NextResponse.json({ message: 'Cargo no encontrado' }, { status: 404 });
        }

        return NextResponse.json(cargo);
    } catch (error) {
        return NextResponse.json({ message: 'Error al obtener el cargo', error: (error as Error).message }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: Params }) {
    try {
        const data = await request.json();
        const nombreCargo = params.nombreCargo;
        
        await actualizarCargo(nombreCargo, data);
        
        return NextResponse.json({ message: 'Departamento actualizado con éxito' });
    } catch (error) {
        return NextResponse.json({ message: 'Error al actualizar el departamento', error: (error as Error).message }, { status: 400 });
    }
}

export async function DELETE(request: Request, { params }: { params: Params }) {
    try {
        const nombreCargo = params.nombreCargo;
        await eliminarCargo(nombreCargo);
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        return NextResponse.json({ message: 'Error al eliminar el departamento', error: (error as Error).message }, { status: 500 });
    }
}