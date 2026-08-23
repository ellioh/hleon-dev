import * as React from "react";
import { Menu } from "lucide-react";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

/**
 * Escritorio primero, utilizable en móvil/tablet - no paridad visual,
 * pero navegable y sin romperse (ver criterio explícito del usuario).
 * Sidebar fija desde md (≥768px); cajón deslizante con overlay debajo.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const [menuAbierto, setMenuAbierto] = React.useState(false);

  return (
    <div className="min-h-screen bg-background">
      <a href="#contenido" className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground">
        Saltar al contenido
      </a>

      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-border bg-card md:block">
        <SidebarNav />
      </aside>

      <Dialog open={menuAbierto} onOpenChange={setMenuAbierto}>
        <DialogContent className="left-0 top-0 h-full max-h-none w-64 max-w-none translate-x-0 translate-y-0 rounded-none p-0 md:hidden">
          <DialogTitle className="sr-only">Menú de navegación</DialogTitle>
          <SidebarNav onNavigate={() => setMenuAbierto(false)} />
        </DialogContent>
      </Dialog>

      <div className="md:pl-64">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-card/95 px-4 backdrop-blur-sm md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setMenuAbierto(true)} aria-label="Abrir menú">
            <Menu className="h-5 w-5" />
          </Button>
          <span className="font-semibold text-foreground">hleon.dev · Admin</span>
        </header>

        <main id="contenido" className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
