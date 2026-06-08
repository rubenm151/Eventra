import type { Metadata } from "next";
import { Header } from "~~/components/Header";
import "~~/styles/globals.css";

export const metadata: Metadata = {
  title: "Eventra - Plataforma de Eventos",
  description: "Crea eventos, descubre experiencias y compra entradas.",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="relative flex flex-col flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
