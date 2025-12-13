import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// Importamos nuestro Proveedor de Dependencias
import { DiProvider } from "../presentation/context/DiContext";
import { ThemeProvider } from "../presentation/providers/ThemeProvider";

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
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100 antialiased`}>
        <DiProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </DiProvider>
      </body>
    </html>
  );
}
