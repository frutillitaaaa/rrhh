import { redis } from '@/lib/redis';
import { Departamento } from '@/types/departamento';

const DEPARTAMENTOS_KEY = 'departamentos';

export async function obtenerTodosLosDepartamentos(): Promise<Departamento[]> {
    try {
        const data = await redis.hgetall(DEPARTAMENTOS_KEY);
        if (!data) return [];
        return Object.entries(data).map(([area, seccion]) => ({ area, seccion: seccion as string }));
    } catch (error) {
        console.error("Error en obtenerTodosLosDepartamentos (Redis):", error);
        throw new Error("No se pudieron obtener los departamentos.");
    }
}

export async function obtenerDepartamentoPorArea(area: string): Promise<Departamento | null> {
    try {
        const seccion = await redis.hget(DEPARTAMENTOS_KEY, area);
        if (!seccion) return null;
        return { area, seccion: seccion as string };
    } catch (error) {
        console.error(`Error en obtenerDepartamentoPorArea con area ${area} (Redis):`, error);
        throw new Error("No se pudo obtener el departamento.");
    }
}

export async function agregarDepartamento(departamento: Departamento): Promise<void> {
    try {
        await redis.hset(DEPARTAMENTOS_KEY, { [departamento.area]: departamento.seccion });
    } catch (error) {
        console.error("Error en agregarDepartamento (Redis):", error);
        throw new Error("No se pudo agregar el departamento.");
    }
}

export async function actualizarDepartamento(area: string, data: Partial<Departamento>): Promise<void> {
    try {
        if (data.seccion) {
            await redis.hset(DEPARTAMENTOS_KEY, { [area]: data.seccion });
        }
    } catch (error) {
        console.error(`Error en actualizarDepartamento con area ${area} (Redis):`, error);
        throw new Error("No se pudo actualizar el departamento.");
    }
}

export async function eliminarDepartamento(area: string): Promise<void> {
    try {
        await redis.hdel(DEPARTAMENTOS_KEY, area);
    } catch (error) {
        console.error(`Error en eliminarDepartamento con area ${area} (Redis):`, error);
        throw new Error("No se pudo eliminar el departamento.");
    }
}