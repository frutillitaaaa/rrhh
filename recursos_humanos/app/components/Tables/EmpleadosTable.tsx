"use client"

import * as React from "react"

import { useEffect, useState } from "react";
import { Empleado } from "@/types/empleado"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { useRouter } from 'next/navigation'

export function EmpleadosTable() {
    const [data, setData] = React.useState<Empleado[]>([])
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [cantMostrar, setCantMostrar] = React.useState<number>(10);
    const [selectedEmpleado, setSelectedEmpleado] = React.useState<Empleado | null>(null);
    const [isDetailDialogOpen, setIsDetailDialogOpen] = React.useState(false);
    const [isEliminando, setIsEliminando] = React.useState(false);
    const router = useRouter();

    const handleVerDetalles = (empleado: Empleado) => {
      setSelectedEmpleado(empleado);
      router.push(`/dashboard/empleados/${empleado._id}`);
    };

    const handleEliminarEmpleados = async () => {
        const selectedRows = table.getFilteredSelectedRowModel().rows;
        if (selectedRows.length === 0) {
            alert("Debe seleccionar al menos un empleado para eliminar");
            return;
        }

        setIsEliminando(true);
        try {
            const empleadosIds = selectedRows.map(row => row.original._id);
            const results = await Promise.all(empleadosIds.map(async (id) => {
                const res = await fetch(`/api/empleados/${id}`, { method: "DELETE" });
                return { id, ok: res.ok };
            }));
            const eliminados = results.filter(r => r.ok).length;
            const fallidos = results.length - eliminados;
            alert(`Eliminados: ${eliminados}. Fallidos: ${fallidos}`);
            const res = await fetch("/api/empleados");
            const newData = await res.json();
            setData(newData);
            table.toggleAllPageRowsSelected(false);
        } catch (error) {
            alert("Error al procesar la eliminación");
            console.error("Error:", error);
        } finally {
            setIsEliminando(false);
        }
    };

    const columns: ColumnDef<Empleado>[] = [
        {
          id: "select",
          header: ({ table }) => (
              <Checkbox
                  checked={
                      table.getIsAllPageRowsSelected() ||
                      (table.getIsSomePageRowsSelected() && "indeterminate")
                  }
                  onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                  aria-label="Select all"
              />
          ),
          cell: ({ row }) => (
              <Checkbox
                  checked={row.getIsSelected()}
                  onCheckedChange={(value) => row.toggleSelected(!!value)}
                  aria-label="Select row"
              />
          ),
          enableSorting: false,
          enableHiding: false,
        },
        {
          accessorKey: "rut",
          header: "Rut",
          cell: ({ row }) => <div className="capitalize">{row.getValue("rut")}</div>,
        },
        {
          accessorKey: "nombre",
          header: ({ column }) => (
              <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                  Nombre <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
          ),
          cell: ({ row }) => <div className="lowercase">{row.getValue("nombre")}</div>,
        },
        {
          accessorKey: "apellido",
          header: ({ column }) => (
              <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                  Apellido <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
          ),
          cell: ({ row }) => <div className="lowercase">{row.getValue("apellido")}</div>,
        },
        {
          accessorKey: "cargo",
          header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
              Cargo <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          ),
          cell: ({ row }) => <div className="lowercase">{row.getValue("cargo")}</div>,
      
        },
        {
          accessorKey: "departamento",
          header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
              Departamento <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          ),
          cell: ({ row }) => <div className="lowercase">{row.getValue("departamento")}</div>,
        },
        {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const empleado = row.original
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => handleVerDetalles(empleado)}
                >
                  Ver detalles
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Editar datos</DropdownMenuItem>
                <DropdownMenuItem>Eliminar empleado</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      },
    ]

    useEffect(() => {
    
    async function fetchData() {
      const res = await fetch("/api/empleados");
      const data = await res.json();
      setData(data);
    }

    fetchData();
  }, []);
  
    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
          sorting,
          columnFilters,
          columnVisibility,
          rowSelection,
        },
    })
    
    return (
    <>
      <div className="w-full">
        <div className="flex items-center space-x-10 py-4">
          <Input
            placeholder="Buscar por Rut..."
            value={(table.getColumn("rut")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("rut")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <Button
            onClick={handleEliminarEmpleados}
            disabled={table.getFilteredSelectedRowModel().rows.length === 0 || isEliminando}
            className="mr-2"
            variant="destructive"
          >
            {isEliminando ? "Eliminando..." : "Eliminar Empleado"}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columnas <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.slice(0, cantMostrar).map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No hay resultados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-5">
          <span className="text-black text-[14px]">Mostrar: </span>
          <Select value={cantMostrar?.toString()} onValueChange={(value) => setCantMostrar(Number(value))}>
            <SelectTrigger className="w-[64px]">
              <SelectValue placeholder="Mostrar ..." />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="text-muted-foreground flex-1 text-sm">
            {table.getFilteredSelectedRowModel().rows.length} de{" "}
            {table.getFilteredRowModel().rows.length} fila(s) seleccionadas.
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
{/* <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="max-w-md">
              <DialogHeader>
                  <DialogTitle>Detalles del Empleado</DialogTitle>
                  <DialogDescription>
                      Información completa del empleado seleccionado
                  </DialogDescription>
              </DialogHeader>
              {selectedEmpleado && (
                  <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="text-sm font-medium text-gray-500">RUT</label>
                              <p className="text-sm">{selectedEmpleado.rut}</p>
                          </div>
                          <div>
                              <label className="text-sm font-medium text-gray-500">Nombre</label>
                              <p className="text-sm">{selectedEmpleado.nombre}</p>
                          </div>
                          <div>
                              <label className="text-sm font-medium text-gray-500">Apellido</label>
                              <p className="text-sm">{selectedEmpleado.apellido}</p>
                          </div>
                          <div>
                              <label className="text-sm font-medium text-gray-500">Correo</label>
                              <p className="text-sm">{selectedEmpleado.correo}</p>
                          </div>
                          <div>
                              <label className="text-sm font-medium text-gray-500">Teléfono</label>
                              <p className="text-sm">{selectedEmpleado.telefono}</p>
                          </div>
                          <div>
                              <label className="text-sm font-medium text-gray-500">Cargo</label>
                              <p className="text-sm">{selectedEmpleado.cargo}</p>
                          </div>
                          <div>
                              <label className="text-sm font-medium text-gray-500">Departamento</label>
                              <p className="text-sm">{selectedEmpleado.departamento}</p>
                          </div>
                          <div>
                              <label className="text-sm font-medium text-gray-500">Estado</label>
                              <p className="text-sm">{selectedEmpleado.estado || "No especificado"}</p>
                          </div>
                          <div className="col-span-2">
                              <label className="text-sm font-medium text-gray-500">Sueldo Líquido</label>
                              <p className="text-sm">
                                  {selectedEmpleado.sueldo_liquido ? 
                                      new Intl.NumberFormat("es-CL", {
                                          style: "currency",
                                          currency: "CLP",
                                      }).format(selectedEmpleado.sueldo_liquido) : 
                                      "No especificado"
                                  }
                              </p>
                          </div>
                          <div className="col-span-2">
                              <label className="text-sm font-medium text-gray-500">Fecha de Contratación</label>
                              <p className="text-sm">{selectedEmpleado.fecha_contratacion}</p>
                          </div>
                          {(selectedEmpleado.dias_vacaciones !== undefined && selectedEmpleado.dias_vacaciones !== null) && (
                              <div className="col-span-2">
                                  <label className="text-sm font-medium text-gray-500">Días de Vacaciones</label>
                                  <p className="text-sm">
                                      {selectedEmpleado.dias_vacaciones > 0
                                          ? `${selectedEmpleado.dias_vacaciones} días`
                                          : "No está en vacaciones"}
                                  </p>
                              </div>
                          )}
                      </div>
                  </div>
              )}
          </DialogContent>
      </Dialog> */}
      
    </>
  )
}