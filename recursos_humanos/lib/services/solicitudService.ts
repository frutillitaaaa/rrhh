import dbConnect from '@/lib/mongoose';
import Solicitud from '@/models/Solicitud';
import { Solicitud as ISolicitud } from '@/types/solicitud';
import Empleado from '@/models/Empleado';

export async function obtenerTodasLasSolicitudes(): Promise<ISolicitud[]> {
    try {
        await dbConnect();
        const solicitudesRaw = await Solicitud.find({ estado: 'Pendiente' }).populate('id_empleado', 'nombre apellido').lean();
        const solicitudesValidas = [];
        for (const solicitud of solicitudesRaw) {
            if (!solicitud.id_empleado) {
                await Solicitud.deleteOne({ _id: solicitud._id });
                continue;
            }
            solicitudesValidas.push(solicitud);
        }
    
        return solicitudesValidas.map((data: any) => ({
            _id: data._id.toString(),
            id_empleado: data.id_empleado.toString(),
            nombre_empleado: data.nombre_empleado,
            tipo: data.tipo,
            fecha_inicio: data.fecha_inicio,
            fecha_termino: data.fecha_termino,
            motivo: data.motivo,
            estado: data.estado
        }));
    } catch (error) {
        console.error("Error en obtenerTodasLasSolicitudes:", error);
        throw new Error("No se pudieron obtener las solicitudes.");
    }
}

export async function obtenerSolicitudPorId(id: string): Promise<ISolicitud | null> {
    try {
        await dbConnect();
        const solicitud = await Solicitud.findById(id).populate('id_empleado', 'nombre apellido').lean();
        if (!solicitud) return null;
        
        return {
            _id: solicitud._id.toString(),
            id_empleado: solicitud.id_empleado ? solicitud.id_empleado.toString() : 'Empleado eliminado',
            nombre_empleado: solicitud.nombre_empleado || 'Empleado eliminado',
            tipo: solicitud.tipo,
            fecha_inicio: solicitud.fecha_inicio,
            fecha_termino: solicitud.fecha_termino,
            motivo: solicitud.motivo,
            estado: solicitud.estado
        };
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
        return {
            _id: saved._id.toString(),
            id_empleado: saved.id_empleado,
            nombre_empleado: saved.nombre_empleado,
            tipo: saved.tipo,
            fecha_inicio: saved.fecha_inicio,
            fecha_termino: saved.fecha_termino,
            motivo: saved.motivo,
            estado: saved.estado
        };
    } catch (error) {
        console.error("Error en crearSolicitud:", error);
        throw new Error("No se pudo crear la solicitud.");
    }
}

export async function actualizarSolicitud(id: string, data: Partial<ISolicitud>): Promise<ISolicitud | null> {
    try {
        await dbConnect();
        const solicitud = await Solicitud.findByIdAndUpdate(id, data, { new: true }).lean();
        if (!solicitud) return null;
        
        return {
            _id: solicitud._id.toString(),
            id_empleado: solicitud.id_empleado ? solicitud.id_empleado.toString() : 'Empleado eliminado',
            nombre_empleado: solicitud.nombre_empleado || 'Empleado eliminado',
            tipo: solicitud.tipo,
            fecha_inicio: solicitud.fecha_inicio,
            fecha_termino: solicitud.fecha_termino,
            motivo: solicitud.motivo,
            estado: solicitud.estado
        };
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