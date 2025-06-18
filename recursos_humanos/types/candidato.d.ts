import { Document } from 'mongoose';
import { Usuario } from "./usuario"

export interface PlainCandidato extends Usuario {
    curriculum?: {
        educacion: string 
        experiencia_laboral: string
    }
    cargo: string
    sueldo_ideal: number
}
export interface Candidato extends PlainCandidato, Document {}