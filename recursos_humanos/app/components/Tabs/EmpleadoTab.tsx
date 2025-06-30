
import { AppWindowIcon, CodeIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import { Empleado } from "@/types/empleado"
interface Props {
  empleado: Empleado;
}
export function EmpleadoTab({empleado}: Props) {
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="historial-sueldos">Historial Sueldos</TabsTrigger>
          <TabsTrigger value="historial-estados">Historial Estados</TabsTrigger>
        </TabsList>
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General</CardTitle>
              <CardDescription>
                Datos generales del empleado
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid gap-3">
                  <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="text-sm font-medium text-gray-500">RUT</label>
                              <p className="text-sm">{empleado.rut}</p>
                          </div>
                          <div>
                              <label className="text-sm font-medium text-gray-500">Nombre</label>
                              <p className="text-sm">{empleado.nombre}</p>
                          </div>
                          <div>
                              <label className="text-sm font-medium text-gray-500">Apellido</label>
                              <p className="text-sm">{empleado.apellido}</p>
                          </div>
                          <div>
                              <label className="text-sm font-medium text-gray-500">Correo</label>
                              <p className="text-sm">{empleado.correo}</p>
                          </div>
                          <div>
                              <label className="text-sm font-medium text-gray-500">Teléfono</label>
                              <p className="text-sm">{empleado.telefono}</p>
                          </div>
                          <div>
                              <label className="text-sm font-medium text-gray-500">Cargo</label>
                              <p className="text-sm">{empleado.cargo}</p>
                          </div>
                          <div>
                              <label className="text-sm font-medium text-gray-500">Departamento</label>
                              <p className="text-sm">{empleado.departamento}</p>
                          </div>
                          <div>
                              <label className="text-sm font-medium text-gray-500">Estado</label>
                              <p className="text-sm">{empleado.estado || "No especificado"}</p>
                          </div>
                          <div className="col-span-2">
                              <label className="text-sm font-medium text-gray-500">Sueldo Líquido</label>
                              <p className="text-sm">
                                  {empleado.sueldo_liquido ? 
                                      new Intl.NumberFormat("es-CL", {
                                          style: "currency",
                                          currency: "CLP",
                                      }).format(empleado.sueldo_liquido) : 
                                      "No especificado"
                                  }
                              </p>
                          </div>
                          <div className="col-span-2">
                              <label className="text-sm font-medium text-gray-500">Fecha de Contratación</label>
                              <p className="text-sm">{empleado.fecha_contratacion}</p>
                          </div>
                          {(empleado.dias_vacaciones !== undefined && empleado.dias_vacaciones !== null) && (
                              <div className="col-span-2">
                                  <label className="text-sm font-medium text-gray-500">Días de Vacaciones</label>
                                  <p className="text-sm">
                                      {empleado.dias_vacaciones > 0
                                          ? `${empleado.dias_vacaciones} días`
                                          : "No está en vacaciones"}
                                  </p>
                              </div>
                          )}
                      </div>
                  </div>
              
       
              </div>
            </CardContent>
            <CardFooter>
            
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="historial-sueldos">
          <Card>
            <CardHeader>
              <CardTitle>Historial Sueldos</CardTitle>
              <CardDescription>
                Historial de liquidaciones de sueldo del empleado
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid gap-3">
                
              </div>
            </CardContent>
            <CardFooter>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="historial-estados">
          <Card>
            <CardHeader>
              <CardTitle>Historial Estados</CardTitle>
              <CardDescription>
                Historial de estados del empleado
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid gap-3">
                
              </div>
            </CardContent>
            <CardFooter>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
