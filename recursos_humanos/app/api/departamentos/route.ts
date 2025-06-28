import { NextResponse } from 'next/server';
import { obtenerTodosLosDepartamentos, agregarDepartamento } from '@/lib/services/departamentoService';

export async function GET() {
    try {
        const departamentos = await obtenerTodosLosDepartamentos();
        return NextResponse.json(departamentos);
    } catch (error) {
        return NextResponse.json({ message: 'Error al obtener departamentos', error: (error as Error).message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { nombreDepartamento, cargos } = await request.json();
        if (!nombreDepartamento || !cargos) {
            return NextResponse.json({ message: 'Nombre departamento y al menos un cargo son requeridos' }, { status: 400 });
        }
        await agregarDepartamento({ nombreDepartamento, cargos });
        return NextResponse.json({ message: 'Departamento agregado con éxito' }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: 'Error al agregar departamento', error: (error as Error).message }, { status: 500 });
    }
}