import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCrearOrganizacion, useOrganizaciones } from "@/hooks/use-lookups";
import type { TipoOrganizacion } from "@/types/api";

interface OrganizacionSelectorProps {
  value: number | null;
  onChange: (id: number) => void;
  /** Cliente (Proyecto) o empleador (Experiencia) - filtra las opciones y precompleta la creación rápida. */
  tipo: TipoOrganizacion;
  disabled?: boolean;
}

/**
 * Selector de Organización - reutilizable por Proyecto (tipo="cliente") y
 * Experiencia (tipo="empleador"). Incluye creación rápida inline porque
 * hoy no existe una página de administración de Organización propia: sin
 * esto, no habría forma de dar de alta un cliente/empleador nuevo desde
 * el formulario.
 */
export function OrganizacionSelector({ value, onChange, tipo, disabled }: OrganizacionSelectorProps) {
  const { data: organizaciones, isLoading } = useOrganizaciones(tipo);
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [nombreNuevo, setNombreNuevo] = useState("");
  const crear = useCrearOrganizacion();

  const etiquetaTipo = tipo === "empleador" ? "empleador" : "cliente";

  function handleCrear() {
    if (!nombreNuevo.trim()) return;
    crear.mutate(
      { nombre: nombreNuevo.trim(), tipo },
      {
        onSuccess: (nueva) => {
          setNombreNuevo("");
          setDialogoAbierto(false);
          // El id se selecciona en el siguiente tick, no en el mismo:
          // si el <SelectItem> de la organización recién creada se monta
          // en el mismo ciclo de render en que cambia el value, Radix
          // Select dispara un onValueChange("") espurio desde su <select>
          // nativo oculto (confirmado con logging) y pisa la selección.
          // Un tick de diferencia le da tiempo al DOM a montar la opción
          // nueva antes de seleccionarla.
          setTimeout(() => onChange(nueva.id), 0);
        },
      }
    );
  }

  if (isLoading) return <Skeleton className="h-10 w-full" />;

  // Radix Select solo resuelve el texto mostrado a partir de un
  // <SelectItem> que ya se haya montado (el listado del dropdown es
  // lazy) - si el valor se fija programáticamente (creación inline) sin
  // que el usuario haya abierto el desplegable, se queda mostrando el
  // placeholder aunque el valor sea correcto. Se pasa el texto ya
  // resuelto como children de SelectValue para no depender de eso.
  const seleccionada = organizaciones?.find((org) => org.id === value);

  return (
    <div className="flex gap-2">
      {/* Controlado siempre (nunca `undefined`) a propósito: si alterna
          entre no-controlado y controlado, Radix Select puede reemitir
          onValueChange("") al promoverse a controlado por una vía
          distinta de un clic directo (p.ej. valor fijado por creación
          inline) - eso llegaba como Number("") = 0 y pisaba la selección
          recién hecha. Bug real, confirmado con logging antes de este fix. */}
      <Select value={value ? String(value) : ""} onValueChange={(v) => onChange(Number(v))} disabled={disabled}>
        <SelectTrigger aria-label="Organización" className="flex-1">
          <SelectValue placeholder={`Selecciona un ${etiquetaTipo}`}>{seleccionada?.nombre}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {organizaciones?.map((org) => (
            <SelectItem key={org.id} value={String(org.id)}>
              {org.nombre}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Dialog open={dialogoAbierto} onOpenChange={setDialogoAbierto}>
        <Button type="button" variant="outline" size="icon" disabled={disabled} onClick={() => setDialogoAbierto(true)} aria-label={`Nuevo ${etiquetaTipo}`}>
          <Plus className="h-4 w-4" />
        </Button>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nuevo {etiquetaTipo}</DialogTitle>
            <DialogDescription>
              Se crea con los datos mínimos. El resto (logo, rubro, alias público) se puede completar más adelante.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <Label htmlFor="organizacion-nombre-nuevo">Nombre</Label>
            <Input
              id="organizacion-nombre-nuevo"
              value={nombreNuevo}
              onChange={(e) => setNombreNuevo(e.target.value)}
              placeholder="Nombre de la organización"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDialogoAbierto(false)} disabled={crear.isPending}>
              Cancelar
            </Button>
            <Button type="button" onClick={handleCrear} disabled={crear.isPending || !nombreNuevo.trim()}>
              {crear.isPending ? "Creando..." : "Crear"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
