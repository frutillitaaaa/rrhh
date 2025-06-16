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

import { LayoutDashboard, UsersRound, Building, Layers2, ContactRound } from 'lucide-react';

const items = [
    {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Cargos",
    url: "/cargos",
    icon: Layers2,
  },
  {
    title: "Departamentos",
    url: "/departamentos",
    icon: Building,
  },
   {
    title: "Empleados",
    url: "/empleados",
    icon: UsersRound,
  },
   {
    title: "Candidatos",
    url: "/candidatos",
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
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
          <SidebarGroup />
        </SidebarContent>
    </Sidebar>
    )
    
}