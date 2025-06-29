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
import { Controller, useController, useFormContext } from "react-hook-form";

type DepartamentosSelectorProps = {
  value: string;
  onChange: (value: string) => void;
};


export function DepartamentosSelector({value, onChange}: DepartamentosSelectorProps) {
  const { control } = useFormContext();
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
      <Select onValueChange={onChange} value={value}>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Seleccionar departamento" />
      </SelectTrigger>
      <SelectContent>
        {data.map((departamento) => {
          return (
            <SelectItem key={departamento.nombreDepartamento} value={departamento.nombreDepartamento}>{departamento.nombreDepartamento}</SelectItem>
          )
        })}
      </SelectContent>
      </Select>

    
  )
}
