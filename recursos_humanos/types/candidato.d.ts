import { Usuario } from "./usuario"

export interface Candidato extends Usuario {
    curriculum?: {
        educacion: string 
        experiencia_laboral: string
    }
    cargo: string
    sueldo_ideal: int
}