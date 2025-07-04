import { redis } from '@/lib/redis';
import { Departamento } from '@/types/departamento';

const DEPARTAMENTOS_KEY = 'departamentos';

export async function obtenerTodosLosDepartamentos(): Promise<Departamento[]> {
    try {
        const data = await redis.hgetall(DEPARTAMENTOS_KEY);
        console.log("Valor obtenido desde Redis:", data);
        if (!data) return [];
        return Object.entries(data).map(([nombreDepartamento, cargos]) => {
            let cargosArray: string[];
            if (typeof cargos === 'string') {
                try {
                    cargosArray = JSON.parse(cargos);
                } catch {
                    cargosArray = [];
                }
            } else if (Array.isArray(cargos)) {
                cargosArray = cargos.map(cargo => 
                    typeof cargo === 'string' ? cargo : 
                    typeof cargo === 'object' && cargo !== null ? 
                        (cargo as any).label || (cargo as any).value || '' : ''
                );
            } else {
                cargosArray = [];
            }
            
            return {
                nombreDepartamento,
                cargos: cargosArray
            };
        });
    } catch (error) {
        console.error("Error en obtenerTodosLosDepartamentos (Redis):", error);
        throw new Error("No se pudieron obtener los departamentos.");
    }
}

export async function obtenerDepartamentoPorNombre(nombreDepartamento: string): Promise<Departamento | null> {
    try {
        const secciones = await redis.hget(DEPARTAMENTOS_KEY, nombreDepartamento);
        if (!secciones) return null;
        
        let cargosArray: string[];
        try {
            const parsed = JSON.parse(secciones as string);
            if (Array.isArray(parsed)) {
                cargosArray = parsed.map(cargo => 
                    typeof cargo === 'string' ? cargo : 
                    typeof cargo === 'object' && cargo !== null ? 
                        (cargo as any).label || (cargo as any).value || '' : ''
                );
            } else {
                cargosArray = [];
            }
        } catch {
            cargosArray = [];
        }
        
        return {
            nombreDepartamento,
            cargos: cargosArray
        };
    } catch (error) {
        console.error(`Error en obtenerDepartamentoPorNombre con nombre ${nombreDepartamento} (Redis):`, error);
        throw new Error("No se pudo obtener el departamento.");
    }
}

export async function agregarDepartamento(departamento: Departamento): Promise<void> {
    if (!departamento.nombreDepartamento || departamento.nombreDepartamento === "undefined" || departamento.nombreDepartamento.trim() === "") {
        throw new Error("El nombre del departamento es inválido. No se puede crear en Redis.");
    }
    try {
        await redis.hset(DEPARTAMENTOS_KEY, {
            [departamento.nombreDepartamento]: JSON.stringify(departamento.cargos)
        });
    } catch (error) {
        console.error("Error en agregarDepartamento (Redis):", error);
        throw new Error("No se pudo agregar el departamento.");
    }
}

export async function actualizarDepartamento(nombreDepartamento: string, data: Partial<Departamento>): Promise<void> {
    if (!nombreDepartamento || nombreDepartamento === "undefined" || nombreDepartamento.trim() === "") {
        throw new Error("El nombre del departamento es inválido. No se puede actualizar en Redis.");
    }
    try {
        if (data.nombreDepartamento && data.nombreDepartamento !== nombreDepartamento) {
            const cargosActuales = await redis.hget(DEPARTAMENTOS_KEY, nombreDepartamento);
            if (cargosActuales) {
                await redis.hset(DEPARTAMENTOS_KEY, {
                    [data.nombreDepartamento]: cargosActuales
                });
                await redis.hdel(DEPARTAMENTOS_KEY, nombreDepartamento);
            }
        }
        const nombreFinal = data.nombreDepartamento || nombreDepartamento;
        if (data.cargos) {
            await redis.hset(DEPARTAMENTOS_KEY, {
                [nombreFinal]: JSON.stringify(data.cargos)
            });
        }
    } catch (error) {
        console.error(`Error en actualizarDepartamento con nombre ${nombreDepartamento} (Redis):`, error);
        throw new Error("No se pudo actualizar el departamento.");
    }
}

export async function eliminarDepartamento(nombreDepartamento: string): Promise<void> {
    try {
        await redis.hdel(DEPARTAMENTOS_KEY, nombreDepartamento);
    } catch (error) {
        console.error(`Error en eliminarDepartamento con nombre ${nombreDepartamento} (Redis):`, error);
        throw new Error("No se pudo eliminar el departamento.");
    }
}
