import dbConnect from '@/lib/mongoose';
import Solicitud from '@/models/Solicitud';
import { ISolicitud } from '@/models/Solicitud'; 

type EstadoSolicitud = 'Pendiente' | 'Aprobada' | 'Rechazada';

export async function obtenerSolicitudes(estado?: EstadoSolicitud): Promise<ISolicitud[]> {
    await dbConnect();
    const query = estado ? { estado } : {};
    const solicitudes = await Solicitud.find(query).populate('id_empleado', 'nombre apellido').lean();
    return JSON.parse(JSON.stringify(solicitudes));
}

export async function crearSolicitud(data: Omit<ISolicitud, 'estado' | 'id' | 'createdAt' | 'updatedAt'>): Promise<ISolicitud> {
    await dbConnect();
    const nuevaSolicitud = new Solicitud(data);
    const solicitudGuardada = await nuevaSolicitud.save();
    return JSON.parse(JSON.stringify(solicitudGuardada));
}

export async function actualizarEstadoSolicitud(id: string, estado: EstadoSolicitud): Promise<ISolicitud | null> {
    await dbConnect();
    const solicitudActualizada = await Solicitud.findByIdAndUpdate(id, { estado }, { new: true }).lean();
    if (!solicitudActualizada) return null;
    return JSON.parse(JSON.stringify(solicitudActualizada));
}