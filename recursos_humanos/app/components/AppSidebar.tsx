import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import { LayoutDashboard, UsersRound, Building, Layers2, ContactRound, UserPlus } from 'lucide-react';

const items = [
   {
    title: "Empleados",
    url: "/dashboard/empleados",
    icon: UsersRound,
  },
   {
    title: "Candidatos",
    url: "/dashboard/candidatos",
    icon: ContactRound,
  },

]
export function AppSidebar() {
    return (
      <Sidebar>
        <SidebarHeader/>
        <h1 className="text-2xl font-bold text-blue-600 flex justify-between items-center p-6 ">RRHH</h1>
        <SidebarContent className="fixed top-16 left-4">
          <SidebarGroup />
          <SidebarGroupContent >
            <SidebarMenu 
            >
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/">
                    <LayoutDashboard />
                    <span>Dashboard</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/dashboard/departamentos">
                    <Building/>
                    <span>Departamentos</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/dashboard/cargos">
                    <Layers2/>
                    <span>Cargos</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <Accordion
                  type="single"
                  collapsible
                  className="w-full"
                >
                  <AccordionItem value="item-1">
                    <SidebarMenuButton asChild>
                      <AccordionTrigger className="gap-2 border-0 hover:bg-gray-100">
                        <a href="/dashboard/usuarios" className="flex items-center text-sm gap-2">
                          <UserPlus className="h-4 w-4" />
                          <span className="text-sm">Usuarios</span>
                        </a>
                      </AccordionTrigger>
                    </SidebarMenuButton>
                    
                    <AccordionContent className="flex flex-col text-balance">
                      <SidebarMenuButton asChild>
                        <a href="/dashboard/empleados">
                          <UsersRound/>
                          <span>Empleados</span>
                        </a>
                      </SidebarMenuButton>
                      <SidebarMenuButton asChild>
                        <a href="/dashboard/candidatos">
                        <ContactRound/>
                        <span>Candidatos</span>
                        </a>
                      </SidebarMenuButton>
                    </AccordionContent>
                  </AccordionItem>
                    </Accordion>      
              </SidebarMenuItem>
           
            </SidebarMenu>
          </SidebarGroupContent>
          <SidebarGroup />
        </SidebarContent>
    </Sidebar>
    )
    
}