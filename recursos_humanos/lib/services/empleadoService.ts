import dbConnect from '@/lib/mongoose';
import Empleado from '@/models/Empleado';
import { Empleado as IEmpleado } from '@/types/empleado';

export async function obtenerTodosLosEmpleados(): Promise<IEmpleado[]> {
    try {
        await dbConnect();
        return await Empleado.find({}).lean();
    } catch (error) {
        console.error("Error en obtenerTodosLosEmpleados:", error);
        throw new Error("No se pudieron obtener los empleados.");
    }
}

export async function obtenerEmpleadoPorId(id: string): Promise<IEmpleado | null> {
    try {
        await dbConnect();
        return await Empleado.findById(id).lean();
    } catch (error) {
        console.error(`Error en obtenerEmpleadoPorId con id ${id}:`, error);
        throw new Error("No se pudo obtener el empleado.");
    }
}

export async function crearEmpleado(data: IEmpleado): Promise<IEmpleado> {
    try {
        await dbConnect();
        const nuevoEmpleado = new Empleado(data);
        console.log(nuevoEmpleado);
        return await nuevoEmpleado.save();
    } catch (error) {
        console.error("Error en crearEmpleado:", error);
        throw new Error("No se pudo crear el empleado.");
    }
}

export async function actualizarEmpleado(id: string, data: Partial<IEmpleado>): Promise<IEmpleado | null> {
    try {
        await dbConnect();
        return await Empleado.findByIdAndUpdate(id, data, { new: true }).lean();
    } catch (error) {
        console.error(`Error en actualizarEmpleado con id ${id}:`, error);
        throw new Error("No se pudo actualizar el empleado.");
    }
}

export async function eliminarEmpleado(id: string): Promise<{ deletedCount?: number }> {
    try {
        await dbConnect();
        return await Empleado.deleteOne({ _id: id });
    } catch (error) {
        console.error(`Error en eliminarEmpleado con id ${id}:`, error);
        throw new Error("No se pudo eliminar el empleado.");
    }
}

export async function obtenerEmpleadosPorDepartamento(departamento: string): Promise<IEmpleado[]> {
    try {
        await dbConnect();
        return await Empleado.find({ departamento }).lean();
    } catch (error) {
        console.error(`Error en obtenerEmpleadosPorDepartamento con departamento ${departamento}:`, error);
        throw new Error("No se pudieron obtener los empleados del departamento.");
    }
}

export async function actualizarHistorialSueldos(empleadoId: string, nuevoHistorial: any): Promise<IEmpleado | null> {
    try {
        await dbConnect();
        return await Empleado.findByIdAndUpdate(
            empleadoId, 
            { 
                $push: { historial_sueldos: nuevoHistorial },
                sueldo_liquido: nuevoHistorial.sueldo_liquido 
            }, 
            { new: true }
        ).lean();
    } catch (error) {
        console.error(`Error en actualizarHistorialSueldos con id ${empleadoId}:`, error);
        throw new Error("No se pudo actualizar el historial de sueldos.");
    }
}

export async function actualizarHistorialEstados(empleadoId: string, nuevoEstado: any): Promise<IEmpleado | null> {
    try {
        console.log('Iniciando actualización de historial de estados para empleado:', empleadoId);
        console.log('Nuevo estado:', nuevoEstado);
        
        await dbConnect();
        const resultado = await Empleado.findByIdAndUpdate(
            empleadoId, 
            { 
                $push: { historial_estados: nuevoEstado }
            }, 
            { new: true }
        ).lean();
        
        console.log('Resultado de la actualización:', resultado);
        return resultado;
    } catch (error) {
        console.error(`Error en actualizarHistorialEstados con id ${empleadoId}:`, error);
        throw new Error("No se pudo actualizar el historial de estados.");
    }
}