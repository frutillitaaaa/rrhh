import { redis } from '@/lib/redis';
import { Departamento } from '@/types/departamento';

const DEPARTAMENTOS_KEY = 'departamentos';

export async function obtenerTodosLosDepartamentos(): Promise<Departamento[]> {
    try {
        const data = await redis.hgetall(DEPARTAMENTOS_KEY);
        console.log("Valor obtenido desde Redis:", data);
        if (!data) return [];
        return Object.entries(data).map(([nombreDepartamento, cargos]) => ({
            nombreDepartamento,
            cargos: typeof cargos === 'string' ? JSON.parse(cargos) : cargos
}));
    } catch (error) {
        console.error("Error en obtenerTodosLosDepartamentos (Redis):", error);
        throw new Error("No se pudieron obtener los departamentos.");
    }
}

export async function obtenerDepartamentoPorNombre(nombreDepartamento: string): Promise<Departamento | null> {
    try {
        const secciones = await redis.hget(DEPARTAMENTOS_KEY, nombreDepartamento);
        if (!secciones) return null;
        return {
            nombreDepartamento,
            cargos: JSON.parse(secciones as string) as string[]
        };
    } catch (error) {
        console.error(`Error en obtenerDepartamentoPorNombre con nombre ${nombreDepartamento} (Redis):`, error);
        throw new Error("No se pudo obtener el departamento.");
    }
}

export async function agregarDepartamento(departamento: Departamento): Promise<void> {
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
    try {
        if (data.cargos) {
            await redis.hset(DEPARTAMENTOS_KEY, {
                [nombreDepartamento]: JSON.stringify(data.cargos)
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

export async function obtenerDepartamentoPorCargo(cargo: string): Promise<string | null> {
    try {
        const departamentos = await obtenerTodosLosDepartamentos();
        for (const departamento of departamentos) {
            if (departamento.cargos.includes(cargo)) {
                return departamento.nombreDepartamento;
            }
        }
        return null;
    } catch (error) {
        console.error(`Error en obtenerDepartamentoPorCargo con cargo ${cargo}:`, error);
        throw new Error("No se pudo obtener el departamento por cargo.");
    }
}
