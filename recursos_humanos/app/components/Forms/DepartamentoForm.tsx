"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import MultipleCargosSelector from "../Selector/MultipleCargosSelector"
import { Departamento } from "@/types/departamento"
import { Option } from "@/components/ui/multiple-selector"

const optionSchema =  z.object({
    value: z.string(),
    label: z.string()
})

const formSchema = z.object({
    nombreDepartamento: z.string().min(1, {
        message: "El nombre del departamento no puede estar vacío.",
    }),
    cargos: z.array(optionSchema).min(1, {
        message: "Debe seleccionar al menos un cargo"
    })
})

interface DepartamentoFormProps {
  onClose: () => void;
  isEditing?: boolean;
  initialData?: Departamento;
  onSuccess?: () => void;
}

export function DepartamentoForm({ onClose, isEditing = false, initialData, onSuccess }: DepartamentoFormProps) {
  const convertCargosToOptions = (cargos: string[]): Option[] => {
    return cargos.map(cargo => ({
      value: cargo,
      label: cargo
    }));
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombreDepartamento: initialData?.nombreDepartamento || "",
      cargos: initialData?.cargos ? convertCargosToOptions(initialData.cargos) : [],
    },
  })

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      form.reset({
        nombreDepartamento: initialData.nombreDepartamento,
        cargos: convertCargosToOptions(initialData.cargos)
      });
    }
  }, [initialData, form]);

  const onSubmit = async(data: z.infer<typeof formSchema> ) => {
    setError(null);
    try {
        let nombre: string | undefined = undefined;
        if (isEditing) {
          nombre = initialData?.nombreDepartamento;
        } else {
          nombre = data.nombreDepartamento;
        }
        if (!nombre || nombre === "undefined" || nombre.trim() === "") {
          setError(`Error: El nombre del departamento es inválido (valor: "${nombre}"). No se puede ${isEditing ? 'editar' : 'crear'}.
Datos iniciales: ${JSON.stringify(initialData)}
Datos del form: ${JSON.stringify(data)}`);
          return;
        }
        const endpoint = isEditing
          ? `/api/departamentos/${encodeURIComponent(nombre)}`
          : '/api/departamentos';
        const method = isEditing ? 'PUT' : 'POST';
        const requestBody = isEditing ? {
          cargos: data.cargos.map(cargo => cargo.value)
        } : {
          nombreDepartamento: nombre,
          cargos: data.cargos.map(cargo => cargo.value)
        };
        const req = await fetch(endpoint, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
        });
        const res = await req.json();
        if (!req.ok) {
          setError(`Error en la petición (${method} ${endpoint}): ${res.message || "Error desconocido"}\nRequestBody: ${JSON.stringify(requestBody)}\ninitialData: ${JSON.stringify(initialData)}\nformData: ${JSON.stringify(data)}`);
          return;
        }
        if (onSuccess) {
          onSuccess();
        }
    } catch (e) {
        setError(`Error inesperado al enviar datos: ${(e instanceof Error ? e.message : e)}\ninitialData: ${JSON.stringify(initialData)}\nformData: ${JSON.stringify(data)}`);
        console.error("Error al enviar datos: ", e );
    }
    onClose();
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {error && <div className="text-red-600 font-semibold text-sm">{error}</div>}
        <FormField
          control={form.control}
          name="nombreDepartamento"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre Departamento</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Desarrollo de Software" 
                  {...field} 
                  disabled={isEditing} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField 
            control={form.control}
            name="cargos"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Cargos</FormLabel>
                <FormControl>
                    <MultipleCargosSelector value = {field.value} onChange={field.onChange}/>
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
            />

        <Button type="submit" >{isEditing ? 'Actualizar' : 'Crear'}</Button>
        <Button type="button" onClick={onClose}>Cancelar</Button>
      </form>
    </Form>
  )
}
