import { NextResponse } from 'next/server';
import { aceptarCandidato } from '@/lib/services/candidatoService';
import { PlainEmpleado } from '@/types/empleado';

interface Params {
    id: string;
}

export async function POST(request: Request, context: { params: Params }) {
    try {
        const candidatoId = context.params.id;
    
        const datosContratacion: Partial<PlainEmpleado> = await request.json();
        
        const nuevoEmpleado = await aceptarCandidato(candidatoId, datosContratacion);
        
        return NextResponse.json({ message: 'Candidato aceptado y convertido en empleado', empleado: nuevoEmpleado }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ message: 'Error al aceptar el candidato', error: (error as Error).message }, { status: 500 });
    }
}