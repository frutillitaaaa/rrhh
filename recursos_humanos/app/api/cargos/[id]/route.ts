import { NextResponse } from 'next/server';

import { actualizarCargo, eliminarCargo, obtenerCargoPorNombre } from '@/lib/services/cargoService';

interface Params {
    nombreCargo: string;
}

export async function GET(request: Request, { params }: { params: Params }) {
    try {
        const nombreCargo = params.nombreCargo;
        const cargo = await obtenerCargoPorNombre(nombreCargo);
        
        if (!cargo) {
            console.log(`No se encontró el cargo: "${nombreCargo}"`);
            return NextResponse.json({ message: 'Cargo no encontrado' }, { status: 404 });
        }

        return NextResponse.json(cargo);
    } catch (error) {
        return NextResponse.json({ message: 'Error al obtener el cargo', error: (error as Error).message }, { status: 500 });
    }
}

export async function PUT(req: Request, context: { params: { id: string } }) {
  const nombreCargo = decodeURIComponent(context.params.id);
  const body = await req.json();

  if (!body || typeof body.sueldo_base !== "number") {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  try {
    await actualizarCargo(nombreCargo, { sueldo_base: body.sueldo_base });
    return NextResponse.json({ message: "Cargo actualizado" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "No se pudo actualizar" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Params }) {
    try {
        const nombreCargo = params.nombreCargo;
        await eliminarCargo(nombreCargo);
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        return NextResponse.json({ message: 'Error al eliminar el departamento', error: (error as Error).message }, { status: 500 });
    }
}