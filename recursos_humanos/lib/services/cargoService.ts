import { redis } from '@/lib/redis';
import { Cargo } from '@/types/cargo';

const CARGOS_KEY = 'cargos';

export async function obtenerTodosLosCargos(): Promise<Cargo[]> {
    try {
        const data = await redis.hgetall(CARGOS_KEY);
        if (!data) return [];
        return Object.entries(data).map(([cargo, sueldo_base]) => ({
            cargo,
            sueldo_base: Number(sueldo_base)
        }));
    } catch (error) {
        console.error("Error en obtenerTodosLosCargos (Redis):", error);
        throw new Error("No se pudieron obtener los cargos.");
    }
}

export async function obtenerCargoPorNombre(nombreCargo: string): Promise<Cargo | null> {
    try {
        const sueldo_base = await redis.hget(CARGOS_KEY, nombreCargo);
        if (!sueldo_base) return null;
        return { cargo: nombreCargo, sueldo_base: Number(sueldo_base) };
    } catch (error) {
        console.error(`Error en obtenerCargoPorNombre con nombre ${nombreCargo} (Redis):`, error);
        throw new Error("No se pudo obtener el cargo.");
    }
}

export async function agregarCargo(cargo: Cargo): Promise<void> {
    try {
        await redis.hset(CARGOS_KEY, { [cargo.cargo]: cargo.sueldo_base });
    } catch (error) {
        console.error("Error en agregarCargo (Redis):", error);
        throw new Error("No se pudo agregar el cargo.");
    }
}

export async function actualizarCargo(nombreCargo: string, data: Partial<Cargo>): Promise<void> {
    try {
        if (data.sueldo_base) {
            await redis.hset(CARGOS_KEY, { [nombreCargo]: data.sueldo_base });
        }
    } catch (error) {
        console.error(`Error en actualizarCargo con nombre ${nombreCargo} (Redis):`, error);
        throw new Error("No se pudo actualizar el cargo.");
    }
}

export async function eliminarCargo(nombreCargo: string): Promise<void> {
    try {
        await redis.hdel(CARGOS_KEY, nombreCargo);
    } catch (error) {
        console.error(`Error en eliminarCargo con nombre ${nombreCargo} (Redis):`, error);
        throw new Error("No se pudo eliminar el cargo.");
    }
}