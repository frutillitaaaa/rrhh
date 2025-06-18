import clientPromise from '@/lib/mongodb';
import Empleado from '@/models/Empleado';
import { Empleado as IEmpleado, PlainEmpleado } from '@/types/empleado';

async function connectToDatabase() {
    await clientPromise;
}

export async function obtenerTodosLosEmpleados(): Promise<IEmpleado[]> {
    await connectToDatabase();
    const empleados = await Empleado.find({}).lean();
    return JSON.parse(JSON.stringify(empleados));
}

export async function obtenerEmpleadoPorId(id: string): Promise<IEmpleado | null> {
    await connectToDatabase();
    const empleado = await Empleado.findById(id).lean();
    if (!empleado) return null;
    return JSON.parse(JSON.stringify(empleado));
}

export async function crearEmpleado(data: Omit<PlainEmpleado, 'id'>): Promise<IEmpleado> {
    await connectToDatabase();
    const nuevoEmpleado = new Empleado(data);
    const empleadoGuardado = await nuevoEmpleado.save();
    return JSON.parse(JSON.stringify(empleadoGuardado));
}

export async function actualizarEmpleado(id: string, data: Partial<IEmpleado>): Promise<IEmpleado | null> {
    await connectToDatabase();
    const empleadoActualizado = await Empleado.findByIdAndUpdate(id, data, { new: true }).lean();
    if (!empleadoActualizado) return null;
    return JSON.parse(JSON.stringify(empleadoActualizado));
}

export async function eliminarEmpleado(id: string): Promise<{ deletedCount?: number }> {
    await connectToDatabase();
    const resultado = await Empleado.deleteOne({ _id: id });
    return resultado;
}