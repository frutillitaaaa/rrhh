import mongoose, { Schema, Document, Model } from 'mongoose';
import { Empleado as IEmpleado, Historial_sueldos, Historial_estados } from '@/types/empleado';
import { Usuario } from '@/types/usuario';

const HistorialSueldosSchema = new Schema<Historial_sueldos>({
    sueldo_liquido: { type: Number, required: true },
    sueldo_bruto: { type: Number, required: true },
    fecha_inicio: { type: String, required: true },
    fecha_termino: { type: String, required: true },
}, { _id: false }); 

const HistorialEstadosSchema = new Schema<Historial_estados>({
    estado: { type: String, required: true },
    tipo_solicitud: { type: String, required: true },
    fecha_cambio: { type: String, required: true },
    motivo: { type: String, required: false },
}, { _id: false });

const EmpleadoSchema = new Schema<IEmpleado>({
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    rut: { type: String, required: true, unique: true },
    correo: { type: String, required: true, unique: true },
    telefono: { type: String, required: true },
    
    cargo: { type: String, required: true },
    sueldo_liquido: { type: Number, default: null },
    estado: { type: String, default: "Trabajando" },
    departamento: { type: String, required: true },
    fecha_contratacion: { type: String, required: true },
    dias_vacaciones: { type: Number, default: null },
    historial_sueldos: [HistorialSueldosSchema],
    historial_estados: [HistorialEstadosSchema],
}, {
    timestamps: true, 
});

const Empleado: Model<IEmpleado & Document> = mongoose.models.Empleado || mongoose.model<IEmpleado & Document>('Empleado', EmpleadoSchema);

export default Empleado;