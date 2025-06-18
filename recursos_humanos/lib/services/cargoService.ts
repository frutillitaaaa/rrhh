import { redis } from '@/lib/redis';
import { Cargo } from '@/types/cargo';

const CARGOS_KEY = 'cargos';

export async function obtenerTodosLosCargos(): Promise<Cargo[]> {
    const data = await redis.hgetall(CARGOS_KEY);
    if (!data) return [];
    return Object.entries(data).map(([cargo, sueldo_base]) => ({
        cargo,
        sueldo_base: Number(sueldo_base)
    }));
}

export async function agregarCargo(cargo: Cargo): Promise<void> {
    await redis.hset(CARGOS_KEY, { [cargo.cargo]: cargo.sueldo_base });
}

export async function eliminarCargo(nombreCargo: string): Promise<void> {
    await redis.hdel(CARGOS_KEY, nombreCargo);
}