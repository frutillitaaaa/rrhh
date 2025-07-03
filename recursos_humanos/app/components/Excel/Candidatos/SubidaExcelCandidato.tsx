'use client';

import { Button } from "@/components/ui/button";
import React, { useRef, useState } from "react";
import * as XLSX from "xlsx"

export default function SubirExcelCandidatos () {
    const inputRef = useRef<HTMLInputElement>(null)
    const variablesPermitidas = ["rut", "nombre", "apellido", "correo", "telefono", "cargo", "departamento", "sueldo_ideal"];

    function handleFileUpload (e:React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if(!file) return;

        const reader = new FileReader()
        reader.onload = (event) => {
            const data = new Uint8Array(event.target!.result as ArrayBuffer);
            const libro = XLSX.read(data, { type: "array" })
            const hoja = libro.Sheets[libro.SheetNames[0]]
            const json = XLSX.utils.sheet_to_json(hoja)
            
            const datosFiltrados = (json as any[]).map((fila) => {
                const resultado: any = {}
                for (const key of variablesPermitidas) {
                    if (key in fila) {
                    resultado[key] = fila[key]
                    }
                }
                return resultado;
            })
            enviarDatos(datosFiltrados);
        }

          reader.readAsArrayBuffer(file);
    }

    return (
      <>
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileUpload}
        className="hidden"
      />

      <Button
        onClick={() => inputRef.current?.click()}
      >
        Subir Excel Candidato
      </Button>
    </>
        
    );
}

async function enviarDatos(datosFiltrados: any[]) {

    await fetch("/api/candidatos/", {
        method: "POST",
        headers: {
            "Content-Type": "aplication/json",
        },
        body: JSON.stringify(datosFiltrados),
    });
}
