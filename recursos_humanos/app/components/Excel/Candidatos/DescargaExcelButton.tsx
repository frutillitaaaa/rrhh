import { Button } from "@/components/ui/button"
import { descargarPlantillaCandidatos } from "./DescargaExcel"

export function DescargarExcelButton () {
    return (
        <Button onClick={descargarPlantillaCandidatos}>
            Descargar Plantilla Excel
        </Button>
    );
}