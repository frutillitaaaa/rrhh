import dbConnect from '@/lib/mongoose';
import Solicitud from '@/models/Solicitud';
import { Solicitud as ISolicitud } from '@/types/solicitud';
import Empleado from '@/models/Empleado';
import { actualizarHistorialEstados } from './empleadoService';

export async function obtenerTodasLasSolicitudes(): Promise<ISolicitud[]> {
    try {
        await dbConnect();
        const solicitudesRaw = await Solicitud.find({ estado: 'Pendiente' }).populate('id_empleado', 'nombre apellido').lean();
        const solicitudesValidas = solicitudesRaw.filter(s => s.id_empleado);
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
        
        if (data.estado && (data.estado === 'Aprobada' || data.estado === 'Rechazada')) {
            console.log('Actualizando estado de solicitud:', data.estado);
            console.log('ID del empleado:', solicitud.id_empleado);
            console.log('Tipo de solicitud:', solicitud.tipo);
            
            const empleadoId = solicitud.id_empleado as string;
            console.log('ID del empleado procesado:', empleadoId);
            
            const fechaActual = new Date().toISOString().split('T')[0];
            const nuevoEstado = {
                estado: data.estado,
                tipo_solicitud: solicitud.tipo,
                fecha_cambio: fechaActual,
                motivo: solicitud.motivo
            };
            
            console.log('Nuevo estado a agregar:', nuevoEstado);
            try {
                await actualizarHistorialEstados(empleadoId, nuevoEstado);
                console.log('Historial de estados actualizado exitosamente');
            } catch (error) {
                console.error('Error al actualizar historial de estados:', error);
            }
        }
        
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