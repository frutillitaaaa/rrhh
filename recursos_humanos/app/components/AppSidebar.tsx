import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import { LayoutDashboard, UsersRound, Building, Layers2, ContactRound } from 'lucide-react';

const items = [
    {
    title: "Dashboard",
    url: "dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Cargos",
    url: "cargos",
    icon: Layers2,
  },
  {
    title: "Departamentos",
    url: "departamentos",
    icon: Building,
  },
   {
    title: "Empleados",
    url: "empleados",
    icon: UsersRound,
  },
   {
    title: "Candidatos",
    url: "candidatos",
    icon: ContactRound,
  },

]
export function AppSidebar() {
    return (
      <Sidebar>
        <SidebarContent className="fixed top-12 left-4">
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