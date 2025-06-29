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

const formSchema = z.object({
    cargo: z.string().min(1, {
    message: "El nombre del cargo no puede estar vacío.",
    }),
    sueldo_base: z.number({
        message: "El sueldo base del cargo no puede ser 0.",
    }),
})

interface CargoFormProps {
  onClose:() => void;
};

export function CargoForm({ onClose }: CargoFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
    cargo: "",
    
    },
  })


  const onSubmit = async(data: z.infer<typeof formSchema> ) => {
    try {
        const req = await fetch('http://localhost:3000/api/cargos', {
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
          name="cargo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre Cargo</FormLabel>
              <FormControl>
                <Input placeholder="Ingeniero de Software" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sueldo_base"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sueldo Base</FormLabel>
              <FormControl>
                <Input placeholder="1.800.000" type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" >Submit</Button>
        <Button type="button" onClick={onClose}>Cancelar</Button>
      </form>
    </Form>
  )
}
