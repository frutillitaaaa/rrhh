import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/app/components/AppSidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RRHH",
  description: "ño denzel",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="flex pt-16 min-h-screen bg-gray-100">
        
            <SidebarProvider>
              <AppSidebar />
              <main className="flex-grow px-6 py-6 bg-gray-50">
            <SidebarTrigger/>
            {children}
          </main>
            </SidebarProvider>
    
          
        </div>
      </body>
    </html>
  )
}