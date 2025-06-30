import { NextResponse } from 'next/server';
import { obtenerCandidatoPorId, eliminarCandidato } from '@/lib/services/candidatoService';
import { crearEmpleado } from '@/lib/services/empleadoService';
import { Candidato } from '@/types/candidato';
import { Empleado } from '@/types/empleado';

export async function POST(request: Request) {
    try {
        const { candidatosIds } = await request.json();
        
        if (!Array.isArray(candidatosIds) || candidatosIds.length === 0) {
            return NextResponse.json({ message: 'Se requiere al menos un candidato para contratar' }, { status: 400 });
        }

        const resultados = [];
        const fechaContratacion = new Date().toISOString().split('T')[0]; 

        for (const candidatoId of candidatosIds) {
            try {
                const candidato = await obtenerCandidatoPorId(candidatoId);
                if (!candidato) {
                    resultados.push({ candidatoId, success: false, message: 'Candidato no encontrado' });
                    continue;
                }

                if (!candidato.departamento) {
                    resultados.push({ candidatoId, success: false, message: `El candidato no tiene departamento asignado` });
                    continue;
                }

                const empleadoData: Partial<Empleado> = {
                    rut: candidato.rut,
                    nombre: candidato.nombre,
                    apellido: candidato.apellido,
                    correo: candidato.correo,
                    telefono: candidato.telefono,
                    cargo: candidato.cargo,
                    sueldo_liquido: candidato.sueldo_ideal,
                    departamento: candidato.departamento,
                    fecha_contratacion: fechaContratacion,
                    estado: 'Activo',
                    dias_vacaciones: 0
                };

                const nuevoEmpleado = await crearEmpleado(empleadoData as Empleado);

                await eliminarCandidato(candidatoId);

                resultados.push({ 
                    candidatoId, 
                    success: true, 
                    message: 'Candidato contratado exitosamente',
                    empleadoId: nuevoEmpleado._id 
                });

            } catch (error) {
                resultados.push({ 
                    candidatoId, 
                    success: false, 
                    message: `Error al contratar candidato: ${(error as Error).message}` 
                });
            }
        }

        const exitosos = resultados.filter(r => r.success);
        const fallidos = resultados.filter(r => !r.success);

        return NextResponse.json({
            message: `Proceso completado. ${exitosos.length} contratados exitosamente, ${fallidos.length} fallidos`,
            resultados,
            exitosos: exitosos.length,
            fallidos: fallidos.length
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ 
            message: 'Error al procesar la contratación', 
            error: (error as Error).message 
        }, { status: 500 });
    }
} 