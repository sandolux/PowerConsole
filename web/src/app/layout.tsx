import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { DiProvider } from "../presentation/context/DiContext";
import { ThemeProvider } from "../presentation/providers/ThemeProvider";
import { SqlRunnerModalProvider } from "../presentation/context/SqlRunnerModalContext";
import "./globals.css";

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
            <SqlRunnerModalProvider>
              {children}
            </SqlRunnerModalProvider>
          </ThemeProvider>
        </DiProvider>
      </body>
    </html>
  );
}
