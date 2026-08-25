import { NavLink } from "react-router-dom";
import { Award, Briefcase, FolderKanban, LayoutDashboard, LogOut, Newspaper, Sparkles, User } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

const ITEMS = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/proyectos", label: "Proyectos", icon: FolderKanban, end: false },
  { to: "/experiencia", label: "Experiencia", icon: Briefcase, end: false },
  { to: "/blog", label: "Blog", icon: Newspaper, end: false },
  { to: "/servicios", label: "Servicios", icon: Sparkles, end: false },
  { to: "/certificaciones", label: "Certificaciones", icon: Award, end: false },
  { to: "/perfil", label: "Mi perfil", icon: User, end: false },
];

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const { usuario, logout } = useAuth();

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border px-5 py-4">
        <span className="text-lg font-bold bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">
          hleon.dev
        </span>
        <p className="text-xs text-muted-foreground">Panel de administración</p>
      </div>

      <nav className="flex-1 space-y-1 p-3" aria-label="Navegación principal">
        {ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                "focus-visible:outline-2 focus-visible:outline-ring",
                isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
              )
            }
          >
            <item.icon className="h-4 w-4" aria-hidden="true" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-border p-3">
        <div className="mb-2 px-3 text-xs text-muted-foreground">
          <p className="truncate font-medium text-foreground">{usuario?.nombre}</p>
          <p className="truncate">{usuario?.email}</p>
        </div>
        <button
          type="button"
          onClick={() => void logout()}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
