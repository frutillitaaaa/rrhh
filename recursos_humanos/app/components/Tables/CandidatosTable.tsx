"use client"

import * as React from "react"

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
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"
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
import { Candidato } from "@/types/candidato"
import { useEffect, useState } from "react";
import { CandidatoForm } from "../Forms/CandidatoForm";
import { ScrollArea } from "@/components/ui/scroll-area";

export function CandidatosTable() {
    const [data, setData] = React.useState<Candidato[]>([]);
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [cantMostrar, setCantMostrar] = React.useState<number>(10);
    const [isContratando, setIsContratando] = React.useState(false);
    const [selectedCandidato, setSelectedCandidato] = React.useState<Candidato | null>(null);
    const [isDetailDialogOpen, setIsDetailDialogOpen] = React.useState(false);
    const [isEliminando, setIsEliminando] = React.useState(false);
    const [globalFilter, setGlobalFilter] = useState("");
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10
    });
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [candidatoToEdit, setCandidatoToEdit] = useState<Candidato | null>(null);

    const handleVerDetalles = (candidato: Candidato) => {
        setSelectedCandidato(candidato);
        setIsDetailDialogOpen(true);
    };

    const handleEditarCandidato = (candidato: Candidato) => {
        setCandidatoToEdit(candidato);
        setIsEditDialogOpen(true);
    };

    const columns: ColumnDef<Candidato>[] = [
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
            header: "Cargo Postulante",
        },
        {
            accessorKey: "sueldo_ideal",
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Sueldo ideal <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => {
                const amount = parseFloat(row.getValue("sueldo_ideal"))
                const formatted = new Intl.NumberFormat("es-CL", {
                    style: "currency",
                    currency: "CLP",
                }).format(amount)
                return <div className="text-center align-middle font-medium">{formatted}</div>
            },
        },
        {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const candidato = row.original
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Opciones</DropdownMenuLabel>
                <DropdownMenuItem
                 onClick={() => handleVerDetalles(candidato)}
                >
                  Ver detalles
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleEditarCandidato(candidato)}
                >
                  Editar datos
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      },
    ]

    useEffect(() => {
        
        async function fetchData() {
          const res = await fetch("/api/candidatos");
          const data = await res.json();
          setData(data);
        }
    
        fetchData();
      }, []);

    const handleContratar = async () => {
        const selectedRows = table.getFilteredSelectedRowModel().rows;
        if (selectedRows.length === 0) {
            alert("Debe seleccionar al menos un candidato para contratar");
            return;
        }

        setIsContratando(true);
        try {
            const candidatosIds = selectedRows.map(row => row.original._id);
            
            const response = await fetch("/api/candidatos/contratar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ candidatosIds }),
            });

            const result = await response.json();

            if (response.ok) {
                alert(result.message);
                const res = await fetch("/api/candidatos");
                const newData = await res.json();
                setData(newData);
                table.toggleAllPageRowsSelected(false);
            } else {
                alert(result.message || "Error al contratar candidatos");
            }
        } catch (error) {
            alert("Error al procesar la contratación");
            console.error("Error:", error);
        } finally {
            setIsContratando(false);
        }
    };

    const handleEliminarCandidatos = async () => {
        const selectedRows = table.getFilteredSelectedRowModel().rows;
        if (selectedRows.length === 0) {
            alert("Debe seleccionar al menos un candidato para eliminar");
            return;
        }

        setIsEliminando(true);
        try {
            const candidatosIds = selectedRows.map(row => row.original._id);
            const results = await Promise.all(candidatosIds.map(async (id) => {
                const res = await fetch(`/api/candidatos/${id}`, { method: "DELETE" });
                return { id, ok: res.ok };
            }));
            const eliminados = results.filter(r => r.ok).length;
            const fallidos = results.length - eliminados;
            alert(`Eliminados: ${eliminados}. Fallidos: ${fallidos}`);
            const res = await fetch("/api/candidatos");
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

  function globalFilterFn (row: Row<Candidato>, filterValue: string):boolean {
        console.log("Row values:", row.original);
  console.log("Filter value:", filterValue);
          return Object.values(row.original).some((value) =>
          String(value ?? "").toLowerCase().includes(String(filterValue).toLowerCase())
        )
        }
      const table = useReactTable({
          data,
          columns,
          filterFns: {
            global: globalFilterFn,
          },
          onGlobalFilterChange: setGlobalFilter,
          onSortingChange: setSorting,
          onColumnFiltersChange: setColumnFilters,
          getCoreRowModel: getCoreRowModel(),
          getPaginationRowModel: getPaginationRowModel(),
          initialState: {
            pagination: {
              pageSize: 5, 
            },
          },
          onPaginationChange: setPagination,
          getSortedRowModel: getSortedRowModel(),
          getFilteredRowModel: getFilteredRowModel(),
          onColumnVisibilityChange: setColumnVisibility,
          onRowSelectionChange: setRowSelection,
          state: {
            pagination,
            globalFilter,
              sorting,
              columnFilters,
              columnVisibility,
              rowSelection,
          },
      })
    
    return (
        <div className="w-full">
              <div className="flex items-center py-4">
                <Input
                    placeholder="Buscar un candidato..."
                    value={table.getState().globalFilter ?? ""}
                    onChange={(event) =>
                    table.setGlobalFilter(event.target.value)
                    }
                    className="max-w-sm"  
                />
                
                <Button
                    onClick={handleContratar}
                    disabled={table.getFilteredSelectedRowModel().rows.length === 0 || isContratando}
                    className="ml-auto mr-2"
                    variant="default"
                >
                    {isContratando ? "Contratando..." : "Contratar"}
                </Button>
                <Button
                    onClick={() => setIsConfirmDeleteOpen(true)}
                    disabled={table.getFilteredSelectedRowModel().rows.length === 0 || isEliminando}
                    className="mr-2"
                    variant="destructive"
                >
                    {isEliminando ? "Eliminando..." : "Eliminar Candidato"}
                </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="ml-auto">
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
                        <Select
                          value={String(table.getState().pagination.pageSize)}
                          onValueChange={(value) => table.setPageSize(Number(value))}
                        >
                          <SelectTrigger className="w-[80px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[10, 20, 50].map((size) => (
                              <SelectItem key={size} value={String(size)}>
                                {size}
                              </SelectItem>
                            ))}
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

            <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Detalles del Candidato</DialogTitle>
                        <DialogDescription>
                            Información completa del candidato seleccionado
                        </DialogDescription>
                    </DialogHeader>
                    {selectedCandidato && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">RUT</label>
                                    <p className="text-sm">{selectedCandidato.rut}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Nombre</label>
                                    <p className="text-sm">{selectedCandidato.nombre}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Apellido</label>
                                    <p className="text-sm">{selectedCandidato.apellido}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Correo</label>
                                    <p className="text-sm">{selectedCandidato.correo}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Teléfono</label>
                                    <p className="text-sm">{selectedCandidato.telefono}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Cargo</label>
                                    <p className="text-sm">{selectedCandidato.cargo}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Departamento</label>
                                    <p className="text-sm">{selectedCandidato.departamento}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Sueldo Ideal</label>
                                    <p className="text-sm">
                                        {new Intl.NumberFormat("es-CL", {
                                            style: "currency",
                                            currency: "CLP",
                                        }).format(selectedCandidato.sueldo_ideal)}
                                    </p>
                                </div>
                                {selectedCandidato.curriculum && (
                                    <>
                                        <div className="col-span-2">
                                            <label className="text-sm font-medium text-gray-500">Educación</label>
                                            <p className="text-sm">{selectedCandidato.curriculum.educacion || "No especificada"}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <label className="text-sm font-medium text-gray-500">Experiencia Laboral</label>
                                            <p className="text-sm">{selectedCandidato.curriculum.experiencia_laboral || "No especificada"}</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <Dialog open={isConfirmDeleteOpen} onOpenChange={setIsConfirmDeleteOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirmar eliminación</DialogTitle>
                        <DialogDescription>
                            ¿Estás seguro de eliminar Candidato(s)?
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outline" onClick={() => setIsConfirmDeleteOpen(false)}>
                            Cancelar
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={async () => {
                                setIsConfirmDeleteOpen(false);
                                await handleEliminarCandidatos();
                            }}
                            disabled={isEliminando}
                        >
                            Eliminar
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Editar Candidato</DialogTitle>
                        <DialogDescription>
                            Modifica los datos del candidato. El RUT no se puede cambiar.
                        </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="max-h-[70vh] p-4">
                        {candidatoToEdit && (
                            <CandidatoForm 
                                onClose={() => setIsEditDialogOpen(false)} 
                                isEditing={true} 
                                initialData={candidatoToEdit}
                                onSuccess={async () => {
                                    const res = await fetch("/api/candidatos");
                                    const newData = await res.json();
                                    setData(newData);
                                }}
                            />
                        )}
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </div>
    )
}