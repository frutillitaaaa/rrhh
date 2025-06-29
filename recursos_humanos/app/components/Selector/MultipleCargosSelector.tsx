'use client';

import React from 'react';

import { useEffect, useState } from "react";
import MultipleSelector from '@/components/ui/multiple-selector';

import { Cargo } from '@/types/cargo';

type Option = {
    value: string;
    label: string;
}

type MultipleCargosSelectorProps = {
  value: Option[];
  onChange: (value: Option[]) => void;
};


const MultipleCargosSelector : React.FC<MultipleCargosSelectorProps> = ({value, onChange}) => {
  const [options, setOptions] = React.useState<Option[]>([])
    useEffect(() => {
        
        async function fetchData() {
            try {
                const res = await fetch("/api/cargos");
                const data: Cargo[] = await res.json();

                const formattedCargos: Option[] = data.map((cargo) => ({
                    label: cargo.cargo,
                    value: cargo.cargo,
                }))
                
                setOptions(formattedCargos);
            } catch (e) {
                console.error("Error al cargar datos: ", e);
            }
        }
    
        fetchData();
      }, []);
  return (
    <div className="flex w-full flex-col gap-5 px-10">
      <p className="text-primary">Seleccionados: {value.length > 0 ? value.join(', ') : 'Ninguno'}</p>
      <MultipleSelector
        value={value}
        onChange={onChange}
        defaultOptions={options}
        placeholder="Select frameworks you like..."
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
