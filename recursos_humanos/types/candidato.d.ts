import { Document } from 'mongoose';
import { Usuario } from "./usuario"

export interface Candidato extends Usuario, Document {
    curriculum?: {
        educacion: string 
        experiencia_laboral: string
    }
    cargo: string
    sueldo_ideal: number
}