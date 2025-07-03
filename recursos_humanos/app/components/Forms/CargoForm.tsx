"use client"

import { useForm } from "react-hook-form"
import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Cargo } from "@/types/cargo"

const formSchema = z.object({
  cargo: z.string().min(1, "El nombre del cargo es obligatorio"),
  sueldo_base: z.number().min(1, "El sueldo base debe ser mayor que 0"),
})

type CargoFormProps = {
  isEditing?: boolean
  initialData?: Cargo
  onSuccess?: () => void
  onClose?: () => void
}

export function CargoForm({ isEditing = false, initialData, onSuccess, onClose }: CargoFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cargo: initialData?.cargo ?? "",
      sueldo_base: initialData?.sueldo_base ?? 0,
    },
  })

  useEffect(() => {
    if (initialData) {
      console.log("cargando datos: ", initialData);
      reset({
  cargo: initialData.cargo,
  sueldo_base: initialData.sueldo_base
})
    }
  }, [initialData, setValue])

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log("Enviando datos:", data)

    try {
      const response = await fetch(
        isEditing
          ? `/api/cargos/${encodeURIComponent(initialData!.cargo)}`
          : "/api/cargos",
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(
            isEditing
              ? { sueldo_base: data.sueldo_base }
              : data
          ),
          
        }
      )
      console.log(response);
      

      if (!response.ok) {
        throw new Error("Error al guardar el cargo")
      }
      

      onSuccess?.()
      onClose?.()
    } catch (error) {
      console.error("Error al guardar cargo:", error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Label htmlFor="cargo">Cargo</Label>
        <Input
          id="cargo"
          {...register("cargo")}
          disabled={isEditing}
        />
        {errors.cargo && (
          <p className="text-sm text-red-500">{errors.cargo.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="sueldo_base">Sueldo base</Label>
        <Input
          id="sueldo_base"
          type="number"
          {...register("sueldo_base", { valueAsNumber: true })}
        />
        {errors.sueldo_base && (
          <p className="text-sm text-red-500">{errors.sueldo_base.message}</p>
        )}
      </div>

      <Button type="submit">
        {isEditing ? "Actualizar" : "Crear"}
      </Button>
    </form>
  )
}
