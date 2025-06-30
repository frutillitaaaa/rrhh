"use client"

import * as React from "react"

import { useEffect, useState } from "react";

import { SquarePen, Trash2, Eye, Edit } from 'lucide-react';

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
import { ArrowUpDown, ChevronDown, MoreHorizontal, HousePlus } from 'lucide-react';

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
import { Departamento } from "@/types/departamento";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DepartamentoForm } from "../Forms/DepartamentoForm";

export function DepartamentosTable() {
  const [open, setOpen] = useState(false)
  const [data, setData] = React.useState<Departamento[]>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const fetchData = async () => {
    try {
      const res = await fetch("/api/departamentos");
      const data = await res.json();
      setData(data);
    } catch (error) {
      console.error("Error al obtener departamentos:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns: ColumnDef<Departamento>[] = [
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
      accessorKey: "nombreDepartamento",
      header: "Departamento",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("nombreDepartamento")}</div>
      ),
    },
    {
      id: "verDetalles",
      header: "",
      cell: ({ row }) => {
        const departamento = row.original;
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
                  <DialogTitle>Detalles del Departamento</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Nombre</label>
                    <p className="text-lg font-semibold">{departamento.nombreDepartamento}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Cargos</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {departamento.cargos && departamento.cargos.length > 0 ? (
                        departamento.cargos.map((cargo: string, idx: number) => {
                          return (
                            <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                              {cargo}
                            </span>
                          );
                        })
                      ) : (
                        <span className="text-gray-400">Sin cargos</span>
                      )}
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
    {
      id: "editarDepartamento",
      header: "",
      cell: ({ row }) => {
        const departamento = row.original;
        const [open, setOpen] = React.useState(false);
        
        return (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="secondary" size="sm" onClick={() => setOpen(true)} className="p-0 rounded-full bg-black hover:bg-neutral-800">
                  <Edit className="h-5 w-5 text-white" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Editar departamento</p>
              </TooltipContent>
            </Tooltip>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogContent className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Editar Departamento</DialogTitle>
                  <ScrollArea className="max-h-[70vh] p-4">
                    <DepartamentoForm 
                      onClose={() => setOpen(false)} 
                      isEditing={true} 
                      initialData={departamento}
                      onSuccess={fetchData}
                    />
                  </ScrollArea>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
  ];

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
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Buscar Departamento..."
          value={(table.getColumn("nombreDepartamento")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("nombreDepartamento")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

        <Dialog open={open} onOpenChange={setOpen}>
          <Tooltip>
              <TooltipTrigger asChild>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <HousePlus />
                    </Button>
                  </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent>
                  <p>Crear Departamento</p>
              </TooltipContent>
          </Tooltip>
          <DialogContent className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl">
              <DialogHeader>
              <DialogTitle>Crear Departamento</DialogTitle>
              <ScrollArea className="max-h-[70vh] p-4">
                <DepartamentoForm onClose = {() => setOpen(false)} onSuccess={fetchData}/>
              </ScrollArea>
              </DialogHeader>
          </DialogContent>
          
        </Dialog>
        
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
              table.getRowModel().rows.map((row) => (
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
