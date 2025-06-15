import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";

import { SidebarProvider } from "@/components/ui/sidebar";
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
        <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">RRHH</h1>
        </header>

        <div className="flex pt-16 min-h-screen bg-gray-100">
          <aside className="hidden md:block w-64 bg-white shadow-md p-4">
            <SidebarProvider>
              <AppSidebar />
            </SidebarProvider>
          </aside>
          <main className="flex-grow px-6 py-6 bg-gray-50">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}