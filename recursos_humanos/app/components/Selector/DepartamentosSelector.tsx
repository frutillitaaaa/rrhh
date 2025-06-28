import * as React from "react"

import { useEffect, useState } from "react";

//types
import { Departamento } from "@/types/departamento";

//components
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function DepartamentosSelector() {
  const [data, setData] = React.useState<Departamento[]>([])
  useEffect(() => {
      
      async function fetchData() {
        const res = await fetch("/api/departamentos");
        const data = await res.json();
        setData(data);
      }
  
      fetchData();
    }, []);

  return (
    <Select>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Seleccionar departamento" />
      </SelectTrigger>
      <SelectContent>
        {data.map((departamento) => {
          return (
            <SelectItem value={departamento.nombreDepartamento}>{departamento.nombreDepartamento}</SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}
