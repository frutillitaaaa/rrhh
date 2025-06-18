import { Usuario } from "./usuario"

export interface Empleado extends Usuario {
    cargo: string
    sueldo_liquido: int
    sueldo_bruto: int
    estado: int
    departamento: string
    fecha_contratacion: string
    dias_vacaciones: int
    historial_sueldos?: Historial_sueldos[]
    historial_cargos?: Historial_cargos[]
    
}

export interface Historial_cargos {
    cargo: string
    fecha_inicio: string
    fecha_termino: string
}

export interface Historial_sueldos {
    sueldo_liquido: int
    sueldo_bruto: int
    fecha_inicio: string
    fecha_termino: string
}