import mongoose, { Schema, Model } from 'mongoose';
import { Solicitud as ISolicitud } from '@/types/solicitud';

const SolicitudSchema = new Schema<ISolicitud>({
    id_empleado: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Empleado', 
        required: true 
    },
    nombre_empleado: { type: String, required: false },
    tipo: { 
        type: String, 
        enum: ['Vacaciones', 'Licencia', 'Otro'], 
        required: true 
    },
    fecha_inicio: { type: String, required: true },
    fecha_termino: { type: String, required: true },
    motivo: { type: String, required: true },
    estado: { 
        type: String, 
        enum: ['Pendiente', 'Aprobada', 'Rechazada'], 
        default: 'Pendiente',
        required: true
    },
}, {
    timestamps: true,
});

const Solicitud: Model<ISolicitud> = mongoose.models.Solicitud || mongoose.model<ISolicitud>('Solicitud', SolicitudSchema);

export default Solicitud;