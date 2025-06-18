import { redis } from '@/lib/redis';
import { Departamento } from '@/types/departamento';

const DEPARTAMENTOS_KEY = 'departamentos';

export async function obtenerTodosLosDepartamentos(): Promise<Departamento[]> {
    const data = await redis.hgetall(DEPARTAMENTOS_KEY);
    if (!data) return [];
    return Object.entries(data).map(([area, seccion]) => ({ area, seccion: seccion as string }));
}

export async function agregarDepartamento(departamento: Departamento): Promise<void> {
    await redis.hset(DEPARTAMENTOS_KEY, { [departamento.area]: departamento.seccion });
}

export async function eliminarDepartamento(area: string): Promise<void> {
    await redis.hdel(DEPARTAMENTOS_KEY, area);
}