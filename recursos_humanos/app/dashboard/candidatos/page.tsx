'use client';

import { DescargarExcelButton } from "@/app/components/Excel/Candidatos/DescargaExcelButton";
import { SubirExcelButton } from "@/app/components/Excel/Candidatos/SubidaExcelButton";
import { CandidatosTable } from "@/app/components/Tables/CandidatosTable";

export default function Candidatos () {
    return (
        <>
            <div className="w-full flex items-center justify-between">
                <h1>Candidatos</h1>
                <div className="flex items-center py-6 gap-6 ml-auto">
                    <DescargarExcelButton/>
                    <SubirExcelButton/>
                </div>
                
            </div>
            
            <CandidatosTable></CandidatosTable>
        </>
    );
}