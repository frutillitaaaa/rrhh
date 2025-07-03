import { Button } from "@/components/ui/button"
import { descargarPlantillaEmpleados } from "./DescargaExcel"

export function DescargarExcelButton () {
    return (
        <Button onClick={descargarPlantillaEmpleados}>
            Descargar Plantilla Excel
        </Button>
    );
}