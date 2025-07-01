import dbConnect from '@/lib/mongoose';
import Solicitud from '@/models/Solicitud';
import { Solicitud as ISolicitud } from '@/types/solicitud';
import Empleado from '@/models/Empleado';

export async function obtenerTodasLasSolicitudes(): Promise<ISolicitud[]> {
    try {
        await dbConnect();
        // Solo solicitudes pendientes y con empleado existente
        const solicitudesRaw = await Solicitud.find({ estado: 'Pendiente' }).populate('id_empleado', 'nombre apellido').lean();
        const solicitudesValidas = solicitudesRaw.filter(s => s.id_empleado);
        // Elimina solicitudes huérfanas
        const huérfanas = solicitudesRaw.filter(s => !s.id_empleado);
        if (huérfanas.length > 0) {
            await Solicitud.deleteMany({ _id: { $in: huérfanas.map(s => s._id) } });
        }
        return solicitudesValidas as ISolicitud[];
    } catch (error) {
        console.error("Error en obtenerTodasLasSolicitudes:", error);
        throw new Error("No se pudieron obtener las solicitudes.");
    }
}

export async function obtenerSolicitudPorId(id: string): Promise<ISolicitud | null> {
    try {
        await dbConnect();
        const solicitud = await Solicitud.findById(id).populate('id_empleado', 'nombre apellido').lean();
        if (!solicitud || !solicitud.id_empleado) return null;
        return solicitud as ISolicitud;
    } catch (error) {
        console.error(`Error en obtenerSolicitudPorId con id ${id}:`, error);
        throw new Error("No se pudo obtener la solicitud.");
    }
}

export async function crearSolicitud(data: ISolicitud): Promise<ISolicitud> {
    try {
        await dbConnect();
        const nuevaSolicitud = new Solicitud(data);
        const saved = await nuevaSolicitud.save();
        return saved.toObject() as ISolicitud;
    } catch (error) {
        console.error("Error en crearSolicitud:", error);
        throw new Error("No se pudo crear la solicitud.");
    }
}

export async function actualizarSolicitud(id: string, data: Partial<ISolicitud>): Promise<ISolicitud | null> {
    try {
        await dbConnect();
        const solicitud = await Solicitud.findByIdAndUpdate(id, data, { new: true }).lean();
        if (!solicitud || !solicitud.id_empleado) return null;
        return solicitud as ISolicitud;
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