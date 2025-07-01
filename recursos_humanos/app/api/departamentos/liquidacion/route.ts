import { NextResponse } from 'next/server';
import { generarLiquidacionMultiplesDepartamentos } from '@/lib/services/liquidacionService';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { departamentos } = body;
        
        if (!departamentos || !Array.isArray(departamentos) || departamentos.length === 0) {
            return NextResponse.json(
                { message: 'Se requiere una lista de departamentos válida' },
                { status: 400 }
            );
        }

        const resultados = await generarLiquidacionMultiplesDepartamentos(departamentos);
        let totalEmpleados = 0;
        let totalLiquidacion = 0;
        
        resultados.forEach(({ resultados: liquidaciones }) => {
            totalEmpleados += liquidaciones.length;
            liquidaciones.forEach(liquidacion => {
                totalLiquidacion += liquidacion.sueldoLiquido;
            });
        });

        return NextResponse.json({
            message: 'Liquidación generada exitosamente',
            departamentos: resultados,
            estadisticas: {
                totalDepartamentos: departamentos.length,
                totalEmpleados,
                totalLiquidacion: Math.round(totalLiquidacion)
            }
        }, { status: 200 });
        
    } catch (error) {
        console.error("Error en liquidación:", error);
        return NextResponse.json(
            { message: 'Error al generar la liquidación', error: (error as Error).message },
            { status: 500 }
        );
    }
} 