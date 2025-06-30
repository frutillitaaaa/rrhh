"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useWatch } from "react-hook-form";
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
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { DateSelector } from "../../../components/DateSelector";
import { CargosSelector } from "../Selector/CargosSelector";
import { DepartamentosSelector } from "../Selector/DepartamentosSelector";

const formSchema = z.object({
    nombre: z.string().min(1, {
    message: "El nombre no puede estar vacío.",
    }),
    apellido: z.string().min(1, {
    message: "El apellido no puede estar vacío."
    }),
    rut: z.string().min(11, {
    message: "El rut no puede tener menos de 11 caracteres. Su formato debe ser 12.345.678-9"
    }).max(12, {
    message: "El rut no puede tener mas de 12 caracteres. Su formato debe ser 12.345.678-9"
    }),
    correo: z.string().min(1, {
    message: "El correo no puede estar vacío.",
    }),
    telefono: z.string().length(12, {
    message: "El formato debe ser +56912345678"
    }),
    tipo_usuario: z.string({
    required_error: "Debe seleccionar una opción",
    }),
    cargo: z.string().optional(),
    departamento: z.string().optional(),
    fecha_contratacion: z.string().optional(),
    sueldo_ideal: z.number().optional(),
})

interface UsuarioFormProps {
  onClose:() => void;
};

export function UsuarioForm({ onClose }: UsuarioFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
    nombre: "",
    apellido: "",
    rut: "",
    correo: "",
    telefono: ""
    },
  })
  const tipo = useWatch({
  control: form.control,
  name: "tipo_usuario",
  });

  const onSubmit = async(data: z.infer<typeof formSchema> ) => {
    if(tipo === "empleado") {
      try {
        const req = await fetch('http://localhost:3000/api/empleados', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        const res = await req.json();
        console.log(res);
      } catch (e) {
        console.error("Error al enviar datos: ", e );
      }
    } else {
      try {
        const req = await fetch('http://localhost:3000/api/candidatos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        const res = await req.json();
        console.log(res);
      } catch (e) {
        console.error("Error al enviar datos: ", e );
      }
    }
    onClose();
  
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Denzel" {...field} />
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
                <Input placeholder="Delgado" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="rut"
          render={({ field }) => (
            <FormItem>
              <FormLabel>RUT</FormLabel>
              <FormControl>
                <Input placeholder="12.345.678-9" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="correo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input placeholder="denzel.delgado@example.com" {...field} />
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
                <Input placeholder="+56912345678" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
            control={form.control}
            name="tipo_usuario"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Tipo de Usuario</FormLabel>
                    <FormControl>
                        <RadioGroup onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col">
                        <FormItem className="flex items-center gap-3">
                            <FormControl>
                            <RadioGroupItem value="candidato" />
                            </FormControl>
                            <FormLabel className="font-normal">
                            Candidato
                            </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center gap-3">
                            <FormControl>
                            <RadioGroupItem value="empleado" />
                            </FormControl>
                            <FormLabel className="font-normal">
                            Empleado
                            </FormLabel>
                        </FormItem>
                        </RadioGroup>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />

        {tipo === "candidato" && (
            <div>
              <FormField 
                control={form.control}
                name="cargo"
                render={({ field }) => (
                  <FormItem>
                      <FormLabel>Cargo al que postula</FormLabel>
                      <FormControl>
                        <CargosSelector value={field.value || ""} onChange={field.onChange}/>
                      </FormControl>
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
                      <DepartamentosSelector value = {field.value || ""} onChange={field.onChange}/>
                    </FormControl>
                  </FormItem>
                )}
                />
            
              <FormField 
                  control={form.control}
                  name="sueldo_ideal"
                  render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sueldo ideal</FormLabel>
                    <FormControl>
                      <Input placeholder="1.800.000" type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                    </FormControl>
                  </FormItem>
                  )}
              />
            </div>
        )}

        {tipo === "empleado" && (
            <div>
              <FormField 
                control={form.control}
                name="cargo"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Cargo</FormLabel>
                    <FormControl>
                      <CargosSelector value = {field.value || ""} onChange={field.onChange}/>
                    </FormControl>
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
                      <DepartamentosSelector value = {field.value || ""} onChange={field.onChange}/>
                    </FormControl>
                  </FormItem>
                )}
                />
                
                <FormField 
                    control={form.control}
                    name="fecha_contratacion"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel></FormLabel>
                        <FormControl>
                            <DateSelector label="Fecha contratacion" value = {field.value} onChange={field.onChange}/>
                        </FormControl>
                    </FormItem>
                )}
                />  
            </div>
            
        )}

        <Button type="submit" >Submit</Button>
        <Button type="button" onClick={onClose}>Cancelar</Button>
      </form>
    </Form>
  )
}
