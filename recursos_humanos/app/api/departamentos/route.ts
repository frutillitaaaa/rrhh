import { NextResponse } from 'next/server';
import { obtenerTodosLosDepartamentos, agregarDepartamento } from '@/lib/services/departamentoService';
import { Departamento } from '@/types/departamento';

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
        const body = await request.json();
        const { nombreDepartamento, cargos } = body as Departamento;
        if (!nombreDepartamento || nombreDepartamento === "undefined" || nombreDepartamento.trim() === "" || !Array.isArray(cargos) || cargos.length === 0) {
            return NextResponse.json(
                { message: 'Nombre del departamento válido y al menos un cargo son requeridos' },
                { status: 400 }
            );
        }
        await agregarDepartamento({ nombreDepartamento, cargos });
        return NextResponse.json({ message: 'Departamento agregado con éxito' }, { status: 201 });
    } catch (error) {
        console.error("POST Error:", error);
        return NextResponse.json(
            { message: 'Error al agregar departamento', error: (error as Error).message },
            { status: 500 }
        );
    }
}