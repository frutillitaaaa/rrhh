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

import { CargosSelector } from "../Selector/CargosSelector"
import { DepartamentosSelector } from "../Selector/DepartamentosSelector"
import { Candidato } from "@/types/candidato"

const formSchema = z.object({
    nombre: z.string().min(1, {
        message: "El nombre no puede estar vacío.",
    }),
    apellido: z.string().min(1, {
        message: "El apellido no puede estar vacío.",
    }),
    correo: z.string().email({
        message: "El correo debe ser válido.",
    }),
    telefono: z.string().min(1, {
        message: "El teléfono no puede estar vacío.",
    }),
    cargo: z.string().min(1, {
        message: "Debe seleccionar un cargo.",
    }),
    departamento: z.string().min(1, {
        message: "Debe seleccionar un departamento.",
    }),
    sueldo_ideal: z.string().min(1, {
        message: "El sueldo ideal no puede estar vacío.",
    }).refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: "El sueldo debe ser un número válido mayor a 0.",
    }),
})

interface CandidatoFormProps {
  onClose: () => void;
  isEditing?: boolean;
  initialData?: Candidato;
  onSuccess?: () => void;
}

export function CandidatoForm({ onClose, isEditing = false, initialData, onSuccess }: CandidatoFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: initialData?.nombre || "",
      apellido: initialData?.apellido || "",
      correo: initialData?.correo || "",
      telefono: initialData?.telefono || "",
      cargo: initialData?.cargo || "",
      departamento: initialData?.departamento || "",
      sueldo_ideal: initialData?.sueldo_ideal?.toString() || "",
    },
  })

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      form.reset({
        nombre: initialData.nombre,
        apellido: initialData.apellido,
        correo: initialData.correo,
        telefono: initialData.telefono,
        cargo: initialData.cargo,
        departamento: initialData.departamento,
        sueldo_ideal: initialData.sueldo_ideal.toString(),
      });
    }
  }, [initialData, form]);

  const onSubmit = async(data: z.infer<typeof formSchema> ) => {
    setError(null);
    try {
        const requestBody = {
          nombre: data.nombre,
          apellido: data.apellido,
          correo: data.correo,
          telefono: data.telefono,
          cargo: data.cargo,
          departamento: data.departamento,
          sueldo_ideal: Number(data.sueldo_ideal),
        };

        const endpoint = isEditing
          ? `/api/candidatos/${initialData?._id}`
          : '/api/candidatos';
        const method = isEditing ? 'PUT' : 'POST';

        const req = await fetch(endpoint, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
        });
        const res = await req.json();
        if (!req.ok) {
          setError(`Error en la petición (${method} ${endpoint}): ${res.message || "Error desconocido"}`);
          return;
        }
        if (onSuccess) {
          onSuccess();
        }
    } catch (e) {
        setError(`Error inesperado al enviar datos: ${(e instanceof Error ? e.message : e)}`);
        console.error("Error al enviar datos: ", e );
    }
    onClose();
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {error && <div className="text-red-600 font-semibold text-sm">{error}</div>}
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="nombre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Juan" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="apellido"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apellido</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Pérez" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="correo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Correo</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="juan.perez@email.com" 
                    type="email"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="telefono"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="+56912345678" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField 
            control={form.control}
            name="cargo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cargo</FormLabel>
                <FormControl>
                  <CargosSelector value={field.value} onChange={field.onChange}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField 
            control={form.control}
            name="departamento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Departamento</FormLabel>
                <FormControl>
                  <DepartamentosSelector value={field.value} onChange={field.onChange}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="sueldo_ideal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sueldo Ideal</FormLabel>
              <FormControl>
                <Input 
                  placeholder="500000" 
                  type="number"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          <Button type="submit">{isEditing ? 'Actualizar' : 'Crear'}</Button>
          <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
        </div>
      </form>
    </Form>
  )
} 