import mongoose, { Schema, Document, Model } from 'mongoose';
import { Candidato as ICandidato } from '@/types/candidato';
import { Usuario } from '@/types/usuario';

const CurriculumSchema = new Schema({
    educacion: { type: String, required: false },
    experiencia_laboral: { type: String, required: false },
}, { _id: false });

const CandidatoSchema = new Schema<ICandidato>({
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    rut: { type: String, required: true, unique: true },
    correo: { type: String, required: true, unique: true },
    telefono: { type: String, required: true },

    curriculum: { type: CurriculumSchema, required: false },
    cargo: { type: String, required: true },
    departamento: { type: String, required: true},
    sueldo_ideal: { type: Number, required: true }, 
}, {
    timestamps: true,
});

const Candidato: Model<ICandidato & Document> = mongoose.models.Candidato || mongoose.model<ICandidato & Document>('Candidato', CandidatoSchema);

export default Candidato;