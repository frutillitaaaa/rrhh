import * as XLSX from "xlsx"

export function descargarPlantillaEmpleados() {
    const headers = ["rut", "nombre", "apellido", "correo", "telefono", "cargo", "departamento", "fecha_contratacion"];
    const hoja = XLSX.utils.aoa_to_sheet([headers]);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "Empleados");
    XLSX.writeFile(libro, "plantilla_empleados.xlsx")

}