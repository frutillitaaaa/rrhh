export interface Licencia {
    id_empleado: number
    fecha_inicio: string
    fecha_termino: string
    
}

export interface Renuncia {
    id_empleado: number
    fecha: string
    motivo: string
}

export interface Despido {
    id_empleado: number
    fecha: string
    motivo: string
}

export interface Vacacion {
    id_empleado: number
    fecha_inicio: string
    fecha_termino: string
}

export interface Trabajo {
    id_empleado: number
    dias_trabajados: number
}

export interface Accidente_Laboral {
    id_empleado: number
    fecha: string
    descripcion: string
}