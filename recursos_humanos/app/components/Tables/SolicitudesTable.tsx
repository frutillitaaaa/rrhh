"use client"

import * as React from "react"

import { useEffect, useState } from "react";
import { Solicitud } from "@/types/solicitud";

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
import { ArrowUpDown, ChevronDown, MoreHorizontal, Eye } from "lucide-react"

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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export function SolicitudesTable() {
    const [data, setData] = React.useState<Solicitud[]>([])
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [cantMostrar, setCantMostrar] = React.useState<number>(10)
    const [selectedSolicitud, setSelectedSolicitud] = React.useState<Solicitud | null>(null);
    const [isDetailDialogOpen, setIsDetailDialogOpen] = React.useState(false);
    const [isRechazando, setIsRechazando] = React.useState(false);
    const [isConfirmRechazarOpen, setIsConfirmRechazarOpen] = useState(false);
    
    const handleVerDetalles = (solicitud: Solicitud) => {
        setSelectedSolicitud(solicitud);
        setIsDetailDialogOpen(true);
    };

    const handleRechazarSolicitudes = async () => {
        const selectedRows = table.getFilteredSelectedRowModel().rows;
        if (selectedRows.length === 0) {
            alert("Debe seleccionar al menos una solicitud para rechazar");
            return;
        }
        setIsRechazando(true);

        try {
            const solicitudesIds = selectedRows.map(row => row.original._id);
            const results = await Promise.all(solicitudesIds.map(async (id) => {
                const res = await fetch(`/api/solicitudes/${id}`, { 
                    method: "PUT",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ estado: 'Rechazada' })
                });
                return { id, ok: res.ok };
            }));
            const rechazadas = results.filter(r => r.ok).length;
            const fallidas = results.length - rechazadas;
            alert(`Rechazadas: ${rechazadas}. Fallidas: ${fallidas}`);
            const res = await fetch("/api/solicitudes");
            const newData = await res.json();
            setData(newData);
            table.toggleAllPageRowsSelected(false);
        } catch (error) {
            alert("Error al procesar el rechazo");
            console.error("Error:", error);
        } finally {
            setIsRechazando(false);
        }
    };

    const columns: ColumnDef<Solicitud>[] = [
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
            accessorKey: "nombre_empleado",
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Nombre Empleado <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => <div>{row.getValue("nombre_empleado") || "N/A"}</div>,
        },
        {
            accessorKey: "tipo",
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Tipo de Solicitud <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => <div>{row.getValue("tipo")}</div>,
        },
        {
            accessorKey: "estado",
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Estado <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => <div>{row.getValue("estado")}</div>,
        },
        {
            id: "verDetalles",
            header: "",
            cell: ({ row }) => {
                const solicitud = row.original;
                const [open, setOpen] = React.useState(false);
                return (
                    <>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => setOpen(true)} className="p-0 rounded-full bg-black hover:bg-neutral-800">
                                    <Eye className="h-5 w-5 text-white" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Ver detalles</p>
                            </TooltipContent>
                        </Tooltip>
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogContent className="max-w-md">
                                <DialogHeader>
                                    <DialogTitle>Detalles de la Solicitud</DialogTitle>
                                    <DialogDescription>
                                        Información completa de la solicitud seleccionada
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Nombre Empleado</label>
                                            <p className="text-sm">{solicitud.nombre_empleado || "N/A"}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Tipo de Solicitud</label>
                                            <p className="text-sm">{solicitud.tipo}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Fecha Inicio</label>
                                            <p className="text-sm">{solicitud.fecha_inicio}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Fecha Término</label>
                                            <p className="text-sm">{solicitud.fecha_termino}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Estado</label>
                                            <p className="text-sm">{solicitud.estado}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Motivo</label>
                                            <p className="text-sm">{solicitud.motivo || "No especificado"}</p>
                                        </div>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </>
                );
            },
            enableSorting: false,
            enableHiding: false,
        },
    ]

    useEffect(() => {
    
    async function fetchData() {
      const res = await fetch("/api/solicitudes");
      const data: Solicitud [] = await res.json();
      
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
          <div className="flex items-center py-4">
            <Input
              placeholder="Buscar por nombre..."
              value={(table.getColumn("nombre_empleado")?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn("nombre_empleado")?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
            <div className="ml-auto flex items-center space-x-2">
              <Button
                onClick={() => setIsConfirmRechazarOpen(true)}
                disabled={table.getFilteredSelectedRowModel().rows.length === 0 || isRechazando}
                variant="destructive"
              >
                {isRechazando ? "Rechazando..." : "Rechazar Solicitud"}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Columns <ChevronDown />
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
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
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
        <Dialog open={isConfirmRechazarOpen} onOpenChange={setIsConfirmRechazarOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar rechazo</DialogTitle>
              <DialogDescription>
                ¿Estás seguro de rechazar la(s) solicitud(es) seleccionada(s)?
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsConfirmRechazarOpen(false)}>
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={async () => {
                  setIsConfirmRechazarOpen(false);
                  await handleRechazarSolicitudes();
                }}
                disabled={isRechazando}
              >
                Rechazar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </>
    )
}
