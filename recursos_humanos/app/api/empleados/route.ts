import { NextResponse } from 'next/server';
import { obtenerTodosLosEmpleados, crearEmpleado } from '@/lib/services/empleadoService';
import { PlainEmpleado } from '@/types/empleado';

export async function GET() {
    try {
        const empleados = await obtenerTodosLosEmpleados();
        return NextResponse.json(empleados);
    } catch (error) {
        return NextResponse.json({ message: 'Error al obtener empleados', error: (error as Error).message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const data: Omit<PlainEmpleado, 'id'> = await request.json();
        const nuevoEmpleado = await crearEmpleado(data);
        return NextResponse.json(nuevoEmpleado, { status: 201 }); 
    } catch (error) {
        return NextResponse.json({ message: 'Error al crear el empleado', error: (error as Error).message }, { status: 400 }); 
    }
}