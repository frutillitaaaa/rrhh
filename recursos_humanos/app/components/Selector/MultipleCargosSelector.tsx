'use client';

import React from 'react';

import { useEffect, useState } from "react";
import MultipleSelector from '@/components/ui/multiple-selector';
import { Option } from '@/components/ui/multiple-selector';
import { Cargo } from '@/types/cargo';


interface MultipleCargosSelectorProps  {
  value: Option[];
  onChange: (value: Option[]) => void;
};


export function MultipleCargosSelector({value, onChange}: MultipleCargosSelectorProps) {
  const [options, setOptions] = React.useState<Option[]>([])
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
    
  useEffect(() => {
      async function fetchData() {
          try {
            const res = await fetch("/api/cargos");
            
            if(!res.ok){
              throw new Error("Error al obtener los cargos");
            }
            const data:Cargo[] = await res.json();

            const formattedCargos:Option[] = data.map((cargo) => ({
              value: cargo.cargo,
              label: cargo.cargo,
              
            }));
            console.log("📦 formattedCargos:", formattedCargos);
            setOptions(formattedCargos);
          } catch (e) {
            console.error("Error al cargar datos: ", e);
          }
      }
        fetchData();
  
      }, []);
  return (
    <div className="flex w-full flex-col gap-5 px-10">
      <p className="text-primary">Seleccionados: {(value ?? []).map((option) => option.label).join(', ')}</p>
      <MultipleSelector
        value={value}
        onChange={onChange}
        options={options}
        defaultOptions={selectedOptions}
        triggerSearchOnFocus={true}
        placeholder="Seleccione uno o varios cargos..."
        emptyIndicator={
          <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
            no results found.
          </p>
        }
      />
    </div>
  );
};

export default MultipleCargosSelector;
