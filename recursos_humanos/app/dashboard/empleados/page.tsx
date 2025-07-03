'use client'

import { DescargarExcelButton } from "@/app/components/Excel/Empleados/DescargaExcelButton";
import { SubirExcelButton } from "@/app/components/Excel/Empleados/SubidaExcelButton";
import { EmpleadosTable } from "@/app/components/Tables/EmpleadosTable";

export default function Empleados () {
    return (
        <>
            <div className="w-full flex items-center justify-between">
                <h1>Empleados</h1>
                <div className="flex items-center gap-6 ml-auto">
                    <DescargarExcelButton/>
                    <SubirExcelButton/>
                </div>
            </div>
            <EmpleadosTable></EmpleadosTable>
        </>
        
    );
}