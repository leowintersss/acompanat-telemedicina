import "./globals.css";
import { Suspense } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sistema Clínico Hospitalario",
  description: "Plataforma de gestión médica",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    /* Agregamos la clase 'dark' aquí para que aplique en todo el sistema */
    <html lang="es" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} bg-slate-950 text-slate-100 min-h-screen`}>
       <Suspense fallback={<div className="bg-slate-900 min-h-screen flex items-center justify-center text-white">Cargando plataforma...</div>}>
  {children}
</Suspense>
      </body>
    </html>
  );
}
