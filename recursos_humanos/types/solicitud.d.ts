export interface Solicitud {
    _id?: string;
    id_empleado: string;
    nombre_empleado?: string;
    tipo: 'Vacaciones' | 'Licencia' | 'Otro';
    fecha_inicio: string;
    fecha_termino: string;
    motivo: string;
    estado: 'Pendiente' | 'Aprobada' | 'Rechazada';
}

