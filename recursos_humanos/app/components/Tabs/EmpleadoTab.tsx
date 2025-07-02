
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
    <div className="flex w-full flex-col gap-6">
        <h1 style={{ fontWeight: 'bold' }}>Empleado {empleado.nombre} {empleado.apellido}</h1>
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
            <CardContent className="w-full grid grid-cols-2 gap-6">
                <div className="col-span-2 grid grid-cols-2 gap-4 w-full">
                    <div className="w-full">
                        <label className="text-sm font-medium text-gray-500">RUT</label>
                        <p className="text-sm">{empleado.rut}</p>
                    </div>
                    <div className="w-full">
                        <label className="text-sm font-medium text-gray-500">Nombre</label>
                        <p className="text-sm">{empleado.nombre}</p>
                    </div>
                    <div className="w-full">
                        <label className="text-sm font-medium text-gray-500">Apellido</label>
                        <p className="text-sm">{empleado.apellido}</p>
                    </div>
                    <div className="w-full">
                        <label className="text-sm font-medium text-gray-500">Correo</label>
                        <p className="text-sm">{empleado.correo}</p>
                    </div>
                    <div className="w-full">
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
                {empleado.historial_sueldos && empleado.historial_sueldos.length > 0 ? (
                  empleado.historial_sueldos.map((historial, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold">Período: {historial.fecha_inicio} - {historial.fecha_termino}</h4>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Sueldo Líquido</p>
                          <p className="text-lg font-bold text-green-600">
                            {new Intl.NumberFormat("es-CL", {
                              style: "currency",
                              currency: "CLP",
                            }).format(historial.sueldo_liquido)}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Sueldo Bruto</p>
                          <p className="font-medium">
                            {new Intl.NumberFormat("es-CL", {
                              style: "currency",
                              currency: "CLP",
                            }).format(historial.sueldo_bruto)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Descuentos Totales</p>
                          <p className="font-medium text-red-600">
                            {new Intl.NumberFormat("es-CL", {
                              style: "currency",
                              currency: "CLP",
                            }).format(historial.sueldo_bruto - historial.sueldo_liquido)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No hay historial de sueldos disponible</p>
                    <p className="text-sm">Los sueldos aparecerán aquí después de generar liquidaciones</p>
                  </div>
                )}
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
                {empleado.historial_estados && empleado.historial_estados.length > 0 ? (
                  empleado.historial_estados.map((historial, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold">{historial.tipo_solicitud}</h4>
                          <p className="text-sm text-gray-500">Fecha: {historial.fecha_cambio}</p>
                        </div>
                        <div className="text-right">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            historial.estado === 'Aprobada' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {historial.estado}
                          </span>
                        </div>
                      </div>
                      {historial.motivo && (
                        <div>
                          <p className="text-sm text-gray-500">Motivo:</p>
                          <p className="text-sm">{historial.motivo}</p>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No hay historial de estados disponible</p>
                    <p className="text-sm">Los estados aparecerán si se rechazan o aprueban las solicitudes</p>
                  </div>
                )}
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
