import * as XLSX from "xlsx"

export function descargarPlantillaCandidatos() {
    const headers = ["rut", "nombre", "apellido", "correo", "telefono", "cargo", "departamento", "sueldo_ideal"];
    const hoja = XLSX.utils.aoa_to_sheet([headers]);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "Candidatos");
    XLSX.writeFile(libro, "plantilla_candidatos.xlsx")

}