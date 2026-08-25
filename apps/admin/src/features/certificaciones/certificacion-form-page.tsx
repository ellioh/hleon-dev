import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FormField, FormSection } from "@/components/shared/form-section";
import { ImageUploader } from "@/components/shared/image-uploader";
import { BlockLoadingState } from "@/components/shared/loading-state";
import { ErrorState } from "@/components/shared/error-state";
import {
  certificacionSchema,
  valoresVacios,
  type CertificacionFormValues,
} from "@/features/certificaciones/certificacion-schema";
import { certificacionToFormValues } from "@/features/certificaciones/certificacion-mappers";
import {
  useActualizarCertificacion,
  useCertificacion,
  useCrearCertificacion,
} from "@/features/certificaciones/api";
import { ApiError } from "@/lib/api";
import type { MediaItem } from "@/types/api";

/**
 * Sin pestañas, a diferencia del resto del panel: Certificación tiene
 * muy pocos campos (sin categoría, sin descripción larga, sin SEO), una
 * sola sección alcanza (ver ADR de Certificaciones).
 */
export function CertificacionFormPage() {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const esEdicion = params.id !== undefined && params.id !== "nuevo";
  const id = esEdicion ? Number(params.id) : undefined;

  const { data: certificacion, isLoading, error } = useCertificacion(id);
  const crear = useCrearCertificacion();
  const actualizar = useActualizarCertificacion(id ?? 0);

  const form = useForm<CertificacionFormValues>({
    resolver: zodResolver(certificacionSchema),
    defaultValues: valoresVacios,
  });

  const [insignia, setInsignia] = React.useState<MediaItem | null>(null);
  const [noExpira, setNoExpira] = React.useState(true);

  React.useEffect(() => {
    if (certificacion) {
      form.reset(certificacionToFormValues(certificacion));
      setInsignia(certificacion.imagenInsignia);
      setNoExpira(!certificacion.fechaExpiracion);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [certificacion]);

  async function onSubmit(datos: CertificacionFormValues) {
    try {
      if (esEdicion && id) {
        await actualizar.mutateAsync(datos);
        toast.success("Cambios guardados.");
      } else {
        const creada = await crear.mutateAsync(datos);
        toast.success("Certificación creada.");
        navigate(`/certificaciones/${creada.data.id}`, { replace: true });
      }
    } catch (err) {
      if (err instanceof ApiError && err.errors) {
        for (const [campo, mensajes] of Object.entries(err.errors)) {
          form.setError(campo as keyof CertificacionFormValues, { message: mensajes[0] });
        }
        toast.error("Revisa los campos marcados.");
      } else {
        toast.error(err instanceof ApiError ? err.message : "No se pudo guardar la certificación.");
      }
    }
  }

  if (esEdicion && isLoading) return <BlockLoadingState lineas={6} />;
  if (esEdicion && error) return <ErrorState error={error} />;

  const guardando = crear.isPending || actualizar.isPending;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{esEdicion ? "Editar certificación" : "Nueva certificación"}</h1>
          {esEdicion && certificacion && <p className="text-sm text-muted-foreground">{certificacion.emisor}</p>}
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => navigate("/certificaciones")}>
            Cancelar
          </Button>
          <Button type="submit" disabled={guardando}>
            {guardando ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Guardar
          </Button>
        </div>
      </div>

      <FormSection title="Identificación">
        <FormField label="Nombre" htmlFor="nombre" required error={form.formState.errors.nombre?.message}>
          <Input id="nombre" {...form.register("nombre")} aria-invalid={Boolean(form.formState.errors.nombre)} />
        </FormField>
        <FormField label="Emisor" htmlFor="emisor" required error={form.formState.errors.emisor?.message}>
          <Input id="emisor" {...form.register("emisor")} />
        </FormField>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Fecha de obtención" htmlFor="fecha_obtencion" required error={form.formState.errors.fecha_obtencion?.message}>
            <Input id="fecha_obtencion" type="date" {...form.register("fecha_obtencion")} />
          </FormField>
          {!noExpira && (
            <FormField label="Fecha de expiración" htmlFor="fecha_expiracion" error={form.formState.errors.fecha_expiracion?.message}>
              <Input
                id="fecha_expiracion"
                type="date"
                value={form.watch("fecha_expiracion") ?? ""}
                onChange={(e) => form.setValue("fecha_expiracion", e.target.value || null)}
              />
            </FormField>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="no_expira"
            checked={noExpira}
            onCheckedChange={(v) => {
              setNoExpira(Boolean(v));
              if (v) form.setValue("fecha_expiracion", null);
            }}
          />
          <Label htmlFor="no_expira" className="cursor-pointer font-normal">
            No expira
          </Label>
        </div>
        <FormField label="ID de credencial" htmlFor="credencial_id" hint="Opcional.">
          <Input
            id="credencial_id"
            value={form.watch("credencial_id") ?? ""}
            onChange={(e) => form.setValue("credencial_id", e.target.value || null)}
          />
        </FormField>
        <FormField label="URL de verificación" htmlFor="url_verificacion" error={form.formState.errors.url_verificacion?.message}>
          <Input
            id="url_verificacion"
            type="url"
            placeholder="https://..."
            value={form.watch("url_verificacion") ?? ""}
            onChange={(e) => form.setValue("url_verificacion", e.target.value || null)}
          />
        </FormField>
        <FormField label="Insignia" htmlFor="insignia">
          <ImageUploader
            label="insignia"
            value={insignia}
            onChange={(media) => {
              setInsignia(media);
              form.setValue("imagen_insignia_id", media?.id ?? null);
            }}
          />
        </FormField>
      </FormSection>

      <FormSection title="Visibilidad">
        <div className="flex items-center gap-2">
          <Checkbox id="visible" checked={form.watch("visible")} onCheckedChange={(v) => form.setValue("visible", Boolean(v))} />
          <Label htmlFor="visible" className="cursor-pointer font-normal">
            Visible en el sitio público
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="destacado" checked={form.watch("destacado")} onCheckedChange={(v) => form.setValue("destacado", Boolean(v))} />
          <Label htmlFor="destacado" className="cursor-pointer font-normal">
            Mostrar como destacada
          </Label>
        </div>
        <FormField label="Orden" htmlFor="orden" hint="Menor número aparece primero.">
          <Input id="orden" type="number" min={0} {...form.register("orden", { valueAsNumber: true })} className="w-32" />
        </FormField>
      </FormSection>
    </form>
  );
}
