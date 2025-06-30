"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

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

const optionSchema =  z.object({
    value: z.string(),
    label: z.string()
})

const formSchema = z.object({
    nombreDepartamento: z.string().min(1, {
        message: "El nombre del departamento no puede estar vacío.",
    }),
    cargos: z.array(optionSchema).min(1, {
        message: "Debe seleccionar al menos "
    })
})

interface DepartamentoFormProps {
  onClose:() => void;
};

export function DepartamentoForm({ onClose }: DepartamentoFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
    nombreDepartamento: "",
    cargos: [],
    },
  })

  const onSubmit = async(data: z.infer<typeof formSchema> ) => {
    try {
        const req = await fetch('/api/departamentos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        const res = await req.json();
        console.log(res);
    } catch (e) {
        console.error("Error al enviar datos: ", e );
    }
    onClose();
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="nombreDepartamento"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre Departamento</FormLabel>
              <FormControl>
                <Input placeholder="Desarrollo de Software" {...field} />
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
            </FormItem>
            )}
            />

        <Button type="submit" >Submit</Button>
        <Button type="button" onClick={onClose}>Cancelar</Button>
      </form>
    </Form>
  )
}
