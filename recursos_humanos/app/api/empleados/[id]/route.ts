import { NextResponse } from 'next/server';
import { obtenerEmpleadoPorId, actualizarEmpleado, eliminarEmpleado } from '@/lib/services/empleadoService';

interface Params {
    id: string;
}

export async function GET(request: Request, context: { params: Params }) {
    try {
        const id = context.params.id;
        const empleado = await obtenerEmpleadoPorId(id);
        if (!empleado) {
            return NextResponse.json({ message: 'Empleado no encontrado' }, { status: 404 });
        }
        return NextResponse.json(empleado);
    } catch (error) {
        return NextResponse.json({ message: 'Error al obtener el empleado', error: (error as Error).message }, { status: 500 });
    }
}

export async function PUT(request: Request, context: { params: Params }) {
    try {
        const id = context.params.id;
        const data = await request.json();
        const empleadoActualizado = await actualizarEmpleado(id, data);
        if (!empleadoActualizado) {
            return NextResponse.json({ message: 'Empleado no encontrado' }, { status: 404 });
        }
        return NextResponse.json(empleadoActualizado);
    } catch (error) {
        return NextResponse.json({ message: 'Error al actualizar el empleado', error: (error as Error).message }, { status: 400 });
    }
}

export async function DELETE(request: Request, context: { params: Params }) {
    try {
        const id = context.params.id;
        const resultado = await eliminarEmpleado(id);
        if (resultado.deletedCount === 0) {
            return NextResponse.json({ message: 'Empleado no encontrado' }, { status: 404 });
        }
        return new NextResponse(null, { status: 204 }); 
    } catch (error) {
        return NextResponse.json({ message: 'Error al eliminar el empleado', error: (error as Error).message }, { status: 500 });
    }
}