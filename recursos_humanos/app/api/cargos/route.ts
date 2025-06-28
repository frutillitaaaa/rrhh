import { NextResponse } from 'next/server';
import { agregarCargo, obtenerTodosLosCargos } from '@/lib/services/cargoService';

export async function GET() {
    try {
        const cargos = await obtenerTodosLosCargos();
        return NextResponse.json(cargos);
    } catch (error) {
        return NextResponse.json({ message: 'Error al obtener cargos', error: (error as Error).message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { cargo, sueldo_base } = await request.json();
        if (!cargo || !sueldo_base) {
            return NextResponse.json({ message: 'Cargo y sueldo base son requeridos' }, { status: 400 });
        }
        await agregarCargo({ cargo, sueldo_base });
        return NextResponse.json({ message: 'Cargo agregado con éxito' }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: 'Error al agregar cargo', error: (error as Error).message }, { status: 500 });
    }
}