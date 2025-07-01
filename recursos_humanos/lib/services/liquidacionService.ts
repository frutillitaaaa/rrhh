import { obtenerEmpleadosPorDepartamento, actualizarHistorialSueldos } from './empleadoService';
import { obtenerCargoPorNombre } from './cargoService';
import { Empleado } from '@/types/empleado';

const GRATIFICACION_LEGAL = 156205; 
const AFP_PORCENTAJE = 0.1145; 
const PREVISION_SOCIAL_PORCENTAJE = 0.07; 
const SEGURO_CESANTIA_PORCENTAJE = 0.006; 

interface LiquidacionResult {
    empleadoId: string;
    nombre: string;
    apellido: string;
    cargo: string;
    sueldoBase: number;
    ingresoBruto: number;
    descuentos: {
        afp: number;
        previsionSocial: number;
        seguroCesantia: number;
        total: number;
    };
    sueldoLiquido: number;
    fechaInicio: string;
    fechaTermino: string;
}

export async function generarLiquidacionDepartamento(departamento: string): Promise<LiquidacionResult[]> {
    try {
        const empleados = await obtenerEmpleadosPorDepartamento(departamento);
        const resultados: LiquidacionResult[] = [];

        for (const empleado of empleados) {
            const cargoInfo = await obtenerCargoPorNombre(empleado.cargo);
            if (!cargoInfo) {
                console.warn(`No se encontró información de cargo para: ${empleado.cargo}`);
                continue;
            }

            const sueldoBase = cargoInfo.sueldo_base;
            const ingresoBruto = GRATIFICACION_LEGAL + sueldoBase;
            
            const afp = ingresoBruto * AFP_PORCENTAJE;
            const previsionSocial = ingresoBruto * PREVISION_SOCIAL_PORCENTAJE;
            const seguroCesantia = ingresoBruto * SEGURO_CESANTIA_PORCENTAJE;
            const totalDescuentos = afp + previsionSocial + seguroCesantia;
            
            const sueldoLiquido = ingresoBruto - totalDescuentos;
            
            const fechaActual = new Date();
            const fechaInicio = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1).toISOString().split('T')[0];
            const fechaTermino = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 0).toISOString().split('T')[0];
            
            const historialSueldo = {
                sueldo_liquido: Math.round(sueldoLiquido),
                sueldo_bruto: Math.round(ingresoBruto),
                fecha_inicio: fechaInicio,
                fecha_termino: fechaTermino
            };
            
            await actualizarHistorialSueldos(empleado._id as string, historialSueldo);
            
            resultados.push({
                empleadoId: empleado._id as string,
                nombre: empleado.nombre,
                apellido: empleado.apellido,
                cargo: empleado.cargo,
                sueldoBase,
                ingresoBruto: Math.round(ingresoBruto),
                descuentos: {
                    afp: Math.round(afp),
                    previsionSocial: Math.round(previsionSocial),
                    seguroCesantia: Math.round(seguroCesantia),
                    total: Math.round(totalDescuentos)
                },
                sueldoLiquido: Math.round(sueldoLiquido),
                fechaInicio,
                fechaTermino
            });
        }
        
        return resultados;
    } catch (error) {
        console.error(`Error en generarLiquidacionDepartamento para ${departamento}:`, error);
        throw new Error(`No se pudo generar la liquidación para el departamento ${departamento}`);
    }
}

export async function generarLiquidacionMultiplesDepartamentos(departamentos: string[]): Promise<{ departamento: string; resultados: LiquidacionResult[] }[]> {
    try {
        const resultadosGenerales = [];
        
        for (const departamento of departamentos) {
            const resultados = await generarLiquidacionDepartamento(departamento);
            resultadosGenerales.push({
                departamento,
                resultados
            });
        }
        
        return resultadosGenerales;
    } catch (error) {
        console.error('Error en generarLiquidacionMultiplesDepartamentos:', error);
        throw new Error('No se pudo generar la liquidación para los departamentos seleccionados');
    }
} 