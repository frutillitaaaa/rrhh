export interface Licencia {
    id_empleado: int
    fecha_inicio: string
    fecha_termino: string
    
}

export interface Renuncia {
    id_empleado: int
    fecha: string
    motivo: string
}

export interface Despido {
    id_empleado: int
    fecha: string
    motivo: string
}

export interface Vacacion {
    id_empleado: int
    fecha_inicio: string
    fecha_termino: string
}

export interface Trabajo {
    id_empleado: int
    dias_trabajados: int
}

export interface Accidente_Laboral {
    id_empleado: int
    fecha: string
    descripcion: string
}