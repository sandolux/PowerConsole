import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// Importamos nuestro Proveedor de Dependencias
import { DiProvider } from "../presentation/context/DiContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PowerConsole",
  description: "Suite de desarrollo e integración",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {/* Envolvemos la app con el Provider */}
        <DiProvider>
          {children}
        </DiProvider>
      </body>
    </html>
  );
}