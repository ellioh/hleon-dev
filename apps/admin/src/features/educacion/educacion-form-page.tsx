import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FormField, FormSection } from "@/components/shared/form-section";
import { BlockLoadingState } from "@/components/shared/loading-state";
import { ErrorState } from "@/components/shared/error-state";
import { educacionSchema, valoresVacios, type EducacionFormValues } from "@/features/educacion/educacion-schema";
import { educacionToFormValues } from "@/features/educacion/educacion-mappers";
import { useActualizarEducacion, useCrearEducacion, useEducacion } from "@/features/educacion/api";
import { ApiError } from "@/lib/api";

/**
 * Sin pestañas, a diferencia de Experiencia: mismo criterio de
 * simplicidad que Certificacion (ver ADR de Certificaciones y
 * el header de la migración de educaciones).
 */
export function EducacionFormPage() {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const esEdicion = params.id !== undefined && params.id !== "nuevo";
  const id = esEdicion ? Number(params.id) : undefined;

  const { data: educacion, isLoading, error } = useEducacion(id);
  const crear = useCrearEducacion();
  const actualizar = useActualizarEducacion(id ?? 0);

  const form = useForm<EducacionFormValues>({
    resolver: zodResolver(educacionSchema),
    defaultValues: valoresVacios,
  });

  React.useEffect(() => {
    if (educacion) {
      form.reset(educacionToFormValues(educacion));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [educacion]);

  async function onSubmit(datos: EducacionFormValues) {
    try {
      if (esEdicion && id) {
        await actualizar.mutateAsync(datos);
        toast.success("Cambios guardados.");
      } else {
        const creada = await crear.mutateAsync(datos);
        toast.success("Estudio creado.");
        navigate(`/educacion/${creada.data.id}`, { replace: true });
      }
    } catch (err) {
      if (err instanceof ApiError && err.errors) {
        for (const [campo, mensajes] of Object.entries(err.errors)) {
          form.setError(campo as keyof EducacionFormValues, { message: mensajes[0] });
        }
        toast.error("Revisa los campos marcados.");
      } else {
        toast.error(err instanceof ApiError ? err.message : "No se pudo guardar el estudio.");
      }
    }
  }

  if (esEdicion && isLoading) return <BlockLoadingState lineas={6} />;
  if (esEdicion && error) return <ErrorState error={error} />;

  const guardando = crear.isPending || actualizar.isPending;
  const enCurso = form.watch("en_curso");

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{esEdicion ? "Editar estudio" : "Nuevo estudio"}</h1>
          {esEdicion && educacion && <p className="text-sm text-muted-foreground">{educacion.institucion}</p>}
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => navigate("/educacion")}>
            Cancelar
          </Button>
          <Button type="submit" disabled={guardando}>
            {guardando ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Guardar
          </Button>
        </div>
      </div>

      <FormSection title="Identificación">
        <FormField label="Institución" htmlFor="institucion" required error={form.formState.errors.institucion?.message}>
          <Input id="institucion" {...form.register("institucion")} aria-invalid={Boolean(form.formState.errors.institucion)} />
        </FormField>
        <FormField label="Título / grado" htmlFor="titulo" required error={form.formState.errors.titulo?.message}>
          <Input id="titulo" {...form.register("titulo")} />
        </FormField>
        <FormField
          label="Título (inglés)"
          htmlFor="titulo_en"
          hint='Opcional. Solo se usa en la versión en inglés del CV (/hire-me) - si lo dejas vacío, este estudio simplemente no aparece ahí.'
        >
          <Input
            id="titulo_en"
            value={form.watch("titulo_en") ?? ""}
            onChange={(e) => form.setValue("titulo_en", e.target.value || null)}
          />
        </FormField>
        <FormField label="Campo de estudio" htmlFor="campo_estudio" hint="Opcional.">
          <Input
            id="campo_estudio"
            value={form.watch("campo_estudio") ?? ""}
            onChange={(e) => form.setValue("campo_estudio", e.target.value || null)}
          />
        </FormField>
      </FormSection>

      <FormSection title="Periodo">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Fecha de inicio" htmlFor="fecha_inicio" required error={form.formState.errors.fecha_inicio?.message}>
            <Input id="fecha_inicio" type="date" {...form.register("fecha_inicio")} />
          </FormField>
          {!enCurso && (
            <FormField label="Fecha de fin" htmlFor="fecha_fin" error={form.formState.errors.fecha_fin?.message}>
              <Input
                id="fecha_fin"
                type="date"
                value={form.watch("fecha_fin") ?? ""}
                onChange={(e) => form.setValue("fecha_fin", e.target.value || null)}
              />
            </FormField>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="en_curso"
            checked={enCurso}
            onCheckedChange={(v) => {
              form.setValue("en_curso", Boolean(v));
              if (v) form.setValue("fecha_fin", null);
            }}
          />
          <Label htmlFor="en_curso" className="cursor-pointer font-normal">
            En curso (sin fecha de fin)
          </Label>
        </div>
      </FormSection>

      <FormSection title="Descripción">
        <FormField label="Descripción" htmlFor="descripcion" hint="Opcional.">
          <Textarea
            id="descripcion"
            rows={4}
            value={form.watch("descripcion") ?? ""}
            onChange={(e) => form.setValue("descripcion", e.target.value || null)}
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
        <FormField label="Orden" htmlFor="orden" hint="Menor número aparece primero.">
          <Input id="orden" type="number" min={0} {...form.register("orden", { valueAsNumber: true })} className="w-32" />
        </FormField>
      </FormSection>
    </form>
  );
}
