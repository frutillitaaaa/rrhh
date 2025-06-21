import dbConnect from '@/lib/mongoose';
import Solicitud from '@/models/Solicitud';
import { Solicitud as ISolicitud } from '@/types/solicitud';

export async function obtenerTodasLasSolicitudes(): Promise<ISolicitud[]> {
    try {
        await dbConnect();
        const solicitudesRaw = await Solicitud.find({}).populate('id_empleado', 'nombre apellido').lean();
    
        return solicitudesRaw.map((data) => ({
            _id: data._id.toString(),
        }))
    } catch (error) {
        console.error("Error en obtenerTodasLasSolicitudes:", error);
        throw new Error("No se pudieron obtener las solicitudes.");
    }
}

export async function obtenerSolicitudPorId(id: string): Promise<ISolicitud | null> {
    try {
        await dbConnect();
        return await Solicitud.findById(id).populate('id_empleado', 'nombre apellido').lean();
    } catch (error) {
        console.error(`Error en obtenerSolicitudPorId con id ${id}:`, error);
        throw new Error("No se pudo obtener la solicitud.");
    }
}

export async function crearSolicitud(data: ISolicitud): Promise<ISolicitud> {
    try {
        await dbConnect();
        const nuevaSolicitud = new Solicitud(data);
        return await nuevaSolicitud.save();
    } catch (error) {
        console.error("Error en crearSolicitud:", error);
        throw new Error("No se pudo crear la solicitud.");
    }
}

export async function actualizarSolicitud(id: string, data: Partial<ISolicitud>): Promise<ISolicitud | null> {
    try {
        await dbConnect();
        return await Solicitud.findByIdAndUpdate(id, data, { new: true }).lean();
    } catch (error) {
        console.error(`Error en actualizarSolicitud con id ${id}:`, error);
        throw new Error("No se pudo actualizar la solicitud.");
    }
}

export async function eliminarSolicitud(id: string): Promise<{ deletedCount?: number }> {
    try {
        await dbConnect();
        return await Solicitud.deleteOne({ _id: id });
    } catch (error) {
        console.error(`Error en eliminarSolicitud con id ${id}:`, error);
        throw new Error("No se pudo eliminar la solicitud.");
    }
}