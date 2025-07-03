import { NextResponse } from 'next/server';
import { obtenerTodosLosEmpleados, crearEmpleado } from '@/lib/services/empleadoService';

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
        const data  = await request.json();

        if (!Array.isArray(data)) {
            const nuevoEmpleado = await crearEmpleado(data);
            return NextResponse.json(nuevoEmpleado, { status: 201 }); 
        }
        
        const nuevosEmpleados = await Promise.all(data.map(crearEmpleado));
        return NextResponse.json(nuevosEmpleados, {status: 201});


    } catch (error) {
        return NextResponse.json({ message: 'Error al crear empleado(s)', error: (error as Error).message }, { status: 400 }); 
    }
}