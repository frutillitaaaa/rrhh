import { Document } from 'mongoose';
import { Usuario } from "./usuario"

export interface Historial_cargos {
    cargo: string
    fecha_inicio: string
    fecha_termino: string
}

export interface Historial_sueldos {
    sueldo_liquido: number
    sueldo_bruto: number
    fecha_inicio: string
    fecha_termino: string
}

export interface PlainEmpleado extends Usuario {
    cargo: string
    sueldo_liquido: number
    sueldo_bruto: number
    estado: number
    departamento: string
    fecha_contratacion: string
    dias_vacaciones: number
    historial_sueldos?: Historial_sueldos[]
    historial_cargos?: Historial_cargos[]
}
export interface Empleado extends PlainEmpleado, Document {}