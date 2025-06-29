"use client"

import * as React from "react"

import { useEffect, useState } from "react";

import { SquarePen, Trash2, UserPlus } from 'lucide-react';

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
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { ScrollArea } from "@/components/ui/scroll-area"

import { Cargo } from "@/types/cargo"
import { CargoForm } from "../Forms/CargoForm";


export const columns: ColumnDef<Cargo>[] = [
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
    accessorKey: "cargo",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Cargo
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue("cargo")}</div>,
  },
  {
    accessorKey: "sueldo_base",
    header: () => <div className="text-right">Sueldo base</div>,
    cell: ({ row }) => {
      const sueldo_base = parseFloat(row.getValue("sueldo_base"))

      const formatted = new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
      }).format(sueldo_base)

      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    id: "acciones",
    header: () => <div className="text-right">Acciones</div>,
    enableHiding: false,
    cell: ({ row }) => {
      const cargo = row.original

      function editar(cargo: string): void {
        throw new Error("Function not implemented.");
      }

      return (
        <div className="flex items-center align-right">
            <Button onClick={() => editar(cargo.cargo)}>
                <SquarePen/>
            </Button>
        </div>
      )
    },
  },
]

export function CargosTable() {
  const [open, setOpen] = useState(false)
  const [data, setData] = React.useState<Cargo[]>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

    useEffect(() => {
        
        async function fetchData() {
          const res = await fetch("/api/cargos");
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
    <div className="w-full">
      <div className="flex items-center py-4 gap-x-4">
        <Input
          placeholder="Buscar cargos ..."
          value={(table.getColumn("cargo")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("cargo")?.setFilterValue(event.target.value)
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
                  <p>Crear Cargo</p>
              </TooltipContent>
          </Tooltip>
          <DialogContent className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl">
              <DialogHeader>
              <DialogTitle>Crear Cargo</DialogTitle>
              <ScrollArea className="max-h-[70vh] p-4">
                <CargoForm onClose = {() => setOpen(false)}/>
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
