"use client"

import * as React from "react"

import { useEffect, useState } from "react";
import type { Row } from '@tanstack/react-table';

import { Usuario } from "@/types/usuario"

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

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

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
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { ScrollArea } from "@/components/ui/scroll-area"

import { UsuarioForm } from "../Forms/UsuarioForm";
import { Empleado } from "@/types/empleado";
import { Candidato } from "@/types/candidato";

export const columns: ColumnDef<Usuario>[] = [
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
    },
    {
      accessorKey: "nombre",
      header: "Nombre",
    },
    {
      accessorKey: "apellido",
      header: "Apellido",
    },
    {
      accessorKey: "correo",
      header: "Correo",
    },
    {
      accessorKey: "telefono",
      header: "Teléfono",
        
    },
    {
      accessorKey: "tipo_usuario",
      header: "Tipo",
    }
    
]

export function UsuariosTable() {
    const [open, setOpen] = useState(false)
    const [data, setData] = React.useState<Usuario[]>([])
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [cantMostrar, setCantMostrar] = React.useState<number>(10)
    const [globalFilter, setGlobalFilter] = useState("");



    useEffect(() => {
    
    async function fetchData() {
      const [empleadosRes, candidatosRes] = await Promise.all([
        fetch("/api/empleados"),
        fetch("/api/candidatos"),
      ])
      const empleados = await empleadosRes.json();
      const candidatos = await candidatosRes.json();

      const empleadosConTipo = empleados.map((e: Empleado) => ({
        ...e,
        tipo_usuario: "Empleado",
      }));

      const candidatosConTipo = candidatos.map((c: Candidato) => ({
        ...c,
        tipo_usuario: "Candidato",
      }));

      const usuarios = [...empleadosConTipo, ...candidatosConTipo];
      setData(usuarios);
    }

    fetchData();
  }, []);
  
     function globalFilterFn (row: Row<Usuario>, filterValue: string):boolean {
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
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
          globalFilter,
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
        
    })
    
    return (
    <div className="w-full">
      <div className="flex items-center py-4 gap-x-4">
        <Input
          placeholder="Buscar un usuario..."
          value={table.getState().globalFilter ?? ""}
          onChange={(event) =>
            table.setGlobalFilter(event.target.value)
          }
          className="max-w-sm"  
        />
        <Dialog open={open} onOpenChange={setOpen}>
          <Tooltip>
              <TooltipTrigger asChild>
                  <DialogTrigger asChild>
                      <Button variant="outline">
                      <UserPlus />
                      </Button>
                  </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent>
                  <p>Crear Usuario</p>
              </TooltipContent>
          </Tooltip>
          <DialogContent className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl">
              <DialogHeader>
              <DialogTitle>Crear Usuario</DialogTitle>
              <ScrollArea className="max-h-[70vh] p-4">
                <UsuarioForm onClose = {() => setOpen(false)}/>
              </ScrollArea>
              </DialogHeader>
          </DialogContent>
          
        </Dialog>
        
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
                  No results.
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
  )
}