import dbConnect from '@/lib/mongoose';
import Candidato from '@/models/Candidato';
import Empleado from '@/models/Empleado';
import { Candidato as ICandidato } from '@/types/candidato';
import { Empleado as IEmpleado, PlainEmpleado } from '@/types/empleado';
import mongoose from 'mongoose';

export async function obtenerTodosLosCandidatos(): Promise<ICandidato[]> {
    await dbConnect();
    const candidatos = await Candidato.find({}).lean();
    return JSON.parse(JSON.stringify(candidatos));
}

export async function crearCandidato(data: Omit<ICandidato, 'id'>): Promise<ICandidato> {
    await dbConnect();
    const nuevoCandidato = new Candidato(data);
    const candidatoGuardado = await nuevoCandidato.save();
    return JSON.parse(JSON.stringify(candidatoGuardado));
}

export async function eliminarCandidato(id: string): Promise<{ deletedCount?: number }> {
    await dbConnect();
    const resultado = await Candidato.deleteOne({ _id: id });
    return resultado;
}

export async function aceptarCandidato(candidatoId: string, datosContratacion: Partial<IEmpleado>): Promise<IEmpleado> {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const candidato = await Candidato.findById(candidatoId).session(session);
        if (!candidato) {
            throw new Error('Candidato no encontrado.');
        }

        const datosEmpleado: Omit<PlainEmpleado, 'id'> = {
            nombre: candidato.nombre,
            apellido: candidato.apellido,
            rut: candidato.rut,
            correo: candidato.correo,
            telefono: candidato.telefono,
            cargo: datosContratacion.cargo || candidato.cargo,
            sueldo_liquido: datosContratacion.sueldo_liquido || 0,
            sueldo_bruto: datosContratacion.sueldo_bruto || 0,
            estado: 3, 
            departamento: datosContratacion.departamento || '',
            fecha_contratacion: new Date().toISOString(),
            dias_vacaciones: datosContratacion.dias_vacaciones || 0,
            historial_cargos: [],
            historial_sueldos: [],
        };

        const [nuevoEmpleado] = await Empleado.create([datosEmpleado], { session });
        await Candidato.findByIdAndDelete(candidatoId).session(session);

        await session.commitTransaction();
        return JSON.parse(JSON.stringify(nuevoEmpleado));

    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
}