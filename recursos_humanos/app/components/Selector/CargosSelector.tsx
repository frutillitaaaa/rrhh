import * as React from "react"

import { useEffect, useState } from "react";

//types
import { Cargo } from "@/types/cargo";

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

type CargosSelectorProps = {
  value: string;
  onChange: (value: string) => void;
};

export function CargosSelector({value, onChange}: CargosSelectorProps) {
  const [data, setData] = React.useState<Cargo[]>([])
  useEffect(() => {
      
      async function fetchData() {
        const res = await fetch("/api/cargos");
        const data = await res.json();
        setData(data);
      }
  
      fetchData();
    }, []);

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Seleccionar cargo" />
      </SelectTrigger>
      <SelectContent>
        {data.map((cargo) => {
          return (
            <SelectItem key={cargo.cargo} value={cargo.cargo}>{cargo.cargo}</SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}
