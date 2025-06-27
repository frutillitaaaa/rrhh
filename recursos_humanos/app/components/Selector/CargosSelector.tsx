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

export function CargosSelector() {
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
    <Select>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Seleccionar cargo" />
      </SelectTrigger>
      <SelectContent>
        {data.map((cargo) => {
          return (
            <SelectItem value={cargo.cargo}>{cargo.cargo}</SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}
