import { EmpleadoTab } from "@/app/components/Tabs/EmpleadoTab";
import { obtenerEmpleadoPorId } from "@/lib/services/empleadoService";
import { Empleado } from "@/types/empleado";
import { redirect } from "next/navigation";

interface Props {
    params: {
        id: string;
    }
}


export default async function EmpleadoDetail ({ params }: Props) {
    const empleado = await obtenerEmpleadoPorId(params.id);

    if(!empleado) {
        return redirect("/dashboard/empleados");
    }
    return (
        <div>
            <EmpleadoTab empleado={empleado} />
        </div>
    );
}