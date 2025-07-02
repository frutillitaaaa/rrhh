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
import { Empleado } from "@/types/empleado"

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

    estado: z.string().min(1, {
        message: "Debe seleccionar un estado.",
    }),
    dias_vacaciones: z.string().min(1, {
        message: "Los días de vacaciones no pueden estar vacíos.",
    }).refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
        message: "Los días de vacaciones deben ser un número válido mayor o igual a 0.",
    }),
})

interface EmpleadoFormProps {
  onClose: () => void;
  isEditing?: boolean;
  initialData?: Empleado;
  onSuccess?: () => void;
}

export function EmpleadoForm({ onClose, isEditing = false, initialData, onSuccess }: EmpleadoFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: initialData?.nombre || "",
      apellido: initialData?.apellido || "",
      correo: initialData?.correo || "",
      telefono: initialData?.telefono || "",
      cargo: initialData?.cargo || "",
      departamento: initialData?.departamento || "",
      estado: initialData?.estado || "Activo",
      dias_vacaciones: initialData?.dias_vacaciones?.toString() || "0",
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
        estado: initialData.estado || "Activo",
        dias_vacaciones: initialData.dias_vacaciones?.toString() || "0",
      });
    }
  }, [initialData, form]);

  const onSubmit = async(data: z.infer<typeof formSchema> ) => {
    setError(null);
    
    try {
      const [cargosRes, departamentosRes] = await Promise.all([
        fetch("/api/cargos"),
        fetch("/api/departamentos")
      ]);
      
      const cargos = await cargosRes.json();
      const departamentos = await departamentosRes.json();
      const departamentoSeleccionado = departamentos.find(
        (d: any) => d.nombreDepartamento === data.departamento
      );
      
      if (departamentoSeleccionado && departamentoSeleccionado.cargos) {
        const cargoEsValido = departamentoSeleccionado.cargos.includes(data.cargo);
        
        if (!cargoEsValido) {
          setError(`❌ Error de compatibilidad: El cargo "${data.cargo}" no pertenece al departamento "${data.departamento}". 
          
Cargos válidos para "${data.departamento}": ${departamentoSeleccionado.cargos.join(', ')}`);
          return;
        }
      }
    } catch (validationError) {
      setError(`Error al validar compatibilidad: ${(validationError as Error).message}`);
      return;
    }
    
    try {
        const requestBody = {
          nombre: data.nombre,
          apellido: data.apellido,
          correo: data.correo,
          telefono: data.telefono,
          cargo: data.cargo,
          departamento: data.departamento,
          estado: data.estado,
          dias_vacaciones: Number(data.dias_vacaciones),
        };

        const endpoint = isEditing
          ? `/api/empleados/${initialData?._id}`
          : '/api/empleados';
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
        onClose();
    } catch (e) {
        setError(`Error inesperado al enviar datos: ${(e instanceof Error ? e.message : e)}`);
        console.error("Error al enviar datos: ", e );
    }
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

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="estado"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado</FormLabel>
                <FormControl>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    {...field}
                  >
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                    <option value="Vacaciones">Vacaciones</option>
                    <option value="Licencia">Licencia</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dias_vacaciones"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Días de Vacaciones</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="0" 
                    type="number"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-2">
          <Button type="submit">{isEditing ? 'Actualizar' : 'Crear'}</Button>
          <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
        </div>
      </form>
    </Form>
  )
}
