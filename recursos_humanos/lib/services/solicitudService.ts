import clientPromise from '@/lib/mongodb';
import Solicitud from '@/models/Solicitud';
import { ISolicitud } from '@/models/Solicitud'; 

async function connectToDatabase() {
    await clientPromise;
}

type EstadoSolicitud = 'Pendiente' | 'Aprobada' | 'Rechazada';

export async function obtenerSolicitudes(estado?: EstadoSolicitud): Promise<ISolicitud[]> {
    await connectToDatabase();
    const query = estado ? { estado } : {};
    const solicitudes = await Solicitud.find(query).populate('id_empleado', 'nombre apellido').lean();
    return JSON.parse(JSON.stringify(solicitudes));
}

export async function crearSolicitud(data: Omit<ISolicitud, 'estado' | 'id' | 'createdAt' | 'updatedAt'>): Promise<ISolicitud> {
    await connectToDatabase();
    const nuevaSolicitud = new Solicitud(data);
    const solicitudGuardada = await nuevaSolicitud.save();
    return JSON.parse(JSON.stringify(solicitudGuardada));
}

export async function actualizarEstadoSolicitud(id: string, estado: EstadoSolicitud): Promise<ISolicitud | null> {
    await connectToDatabase();
    const solicitudActualizada = await Solicitud.findByIdAndUpdate(id, { estado }, { new: true }).lean();
    if (!solicitudActualizada) return null;
    return JSON.parse(JSON.stringify(solicitudActualizada));
}