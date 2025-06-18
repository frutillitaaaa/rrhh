import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISolicitud extends Document {
    id_empleado: mongoose.Schema.Types.ObjectId;
    nombre_empleado: string;
    tipo: 'Vacaciones' | 'Licencia' | 'Otro';
    fecha_inicio: string;
    fecha_termino: string;
    motivo: string;
    estado: 'Pendiente' | 'Aprobada' | 'Rechazada';
}

const SolicitudSchema = new Schema<ISolicitud>({
    id_empleado: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Empleado', 
        required: true 
    },
    nombre_empleado: { type: String, required: true }, 
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