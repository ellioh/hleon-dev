import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormField, FormSection } from "@/components/shared/form-section";
import { OrganizacionSelector } from "@/components/shared/organizacion-selector";
import { TechnologySelector } from "@/components/shared/technology-selector";
import { BlockLoadingState } from "@/components/shared/loading-state";
import { ErrorState } from "@/components/shared/error-state";
import { ProyectoSelector } from "@/features/experiencia/proyecto-selector";
import { TextListEditor } from "@/components/shared/text-list-editor";
import { experienciaSchema, valoresVacios, type ExperienciaFormValues } from "@/features/experiencia/experiencia-schema";
import { experienciaToFormValues } from "@/features/experiencia/experiencia-mappers";
import { useActualizarExperiencia, useCrearExperiencia, useExperiencia } from "@/features/experiencia/api";
import { ApiError } from "@/lib/api";

const TABS = [
  { value: "general", label: "General" },
  { value: "descripcion", label: "Descripción y logros" },
  { value: "tecnologias", label: "Tecnologías" },
  { value: "proyectos", label: "Proyectos relacionados" },
  { value: "publicacion", label: "Publicación" },
] as const;

export function ExperienciaFormPage() {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const esEdicion = params.id !== undefined && params.id !== "nuevo";
  const id = esEdicion ? Number(params.id) : undefined;

  const { data: experiencia, isLoading, error } = useExperiencia(id);
  const crear = useCrearExperiencia();
  const actualizar = useActualizarExperiencia(id ?? 0);

  const form = useForm<ExperienciaFormValues>({
    resolver: zodResolver(experienciaSchema),
    defaultValues: valoresVacios,
  });

  React.useEffect(() => {
    if (experiencia) {
      form.reset(experienciaToFormValues(experiencia));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experiencia]);

  async function onSubmit(datos: ExperienciaFormValues) {
    try {
      if (esEdicion && id) {
        await actualizar.mutateAsync(datos);
        toast.success("Cambios guardados.");
      } else {
        const creada = await crear.mutateAsync(datos);
        toast.success("Experiencia creada.");
        navigate(`/experiencia/${creada.data.id}`, { replace: true });
      }
    } catch (err) {
      if (err instanceof ApiError && err.errors) {
        for (const [campo, mensajes] of Object.entries(err.errors)) {
          form.setError(campo as keyof ExperienciaFormValues, { message: mensajes[0] });
        }
        toast.error("Revisa los campos marcados.");
      } else {
        toast.error(err instanceof ApiError ? err.message : "No se pudo guardar la experiencia.");
      }
    }
  }

  if (esEdicion && isLoading) return <BlockLoadingState lineas={8} />;
  if (esEdicion && error) return <ErrorState error={error} />;

  const guardando = crear.isPending || actualizar.isPending;
  const actual = form.watch("actual");

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{esEdicion ? "Editar experiencia" : "Nueva experiencia"}</h1>
            {esEdicion && experiencia && <p className="text-sm text-muted-foreground">{experiencia.rol}</p>}
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => navigate("/experiencia")}>
              Cancelar
            </Button>
            <Button type="submit" disabled={guardando}>
              {guardando ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Guardar
            </Button>
          </div>
        </div>

        <Tabs defaultValue="general">
          <TabsList>
            {TABS.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="general">
            <FormSection title="Identificación">
              <FormField label="Empleador" htmlFor="organizacion_id" required error={form.formState.errors.organizacion_id?.message}>
                <OrganizacionSelector
                  tipo="empleador"
                  value={form.watch("organizacion_id") || null}
                  onChange={(id) => form.setValue("organizacion_id", id, { shouldValidate: true })}
                />
              </FormField>
              <FormField label="Rol / cargo" htmlFor="rol" required error={form.formState.errors.rol?.message}>
                <Input id="rol" {...form.register("rol")} aria-invalid={Boolean(form.formState.errors.rol)} />
              </FormField>
              <FormField
                label="Resumen"
                htmlFor="resumen"
                required
                hint="Se muestra en la línea de tiempo pública (máx. 300 caracteres)."
                error={form.formState.errors.resumen?.message}
              >
                <Textarea id="resumen" maxLength={300} rows={3} {...form.register("resumen")} />
              </FormField>
              <FormField label="Ubicación" htmlFor="ubicacion">
                <Input id="ubicacion" placeholder="Ej: Lima, Perú" {...form.register("ubicacion")} />
              </FormField>
            </FormSection>

            <FormSection title="Versión en inglés (hire-me)" description='Opcional. Si dejas estos campos vacíos, esta experiencia simplemente no aparece en /hire-me.'>
              <FormField label="Rol / cargo (inglés)" htmlFor="rol_en">
                <Input
                  id="rol_en"
                  value={form.watch("rol_en") ?? ""}
                  onChange={(e) => form.setValue("rol_en", e.target.value || null)}
                />
              </FormField>
              <FormField label="Resumen (inglés)" htmlFor="resumen_en" hint="Máx. 300 caracteres.">
                <Textarea
                  id="resumen_en"
                  maxLength={300}
                  rows={3}
                  value={form.watch("resumen_en") ?? ""}
                  onChange={(e) => form.setValue("resumen_en", e.target.value || null)}
                />
              </FormField>
            </FormSection>

            <FormSection title="Periodo">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Modalidad" htmlFor="modalidad" required>
                  <Select value={form.watch("modalidad")} onValueChange={(v) => form.setValue("modalidad", v as ExperienciaFormValues["modalidad"])}>
                    <SelectTrigger id="modalidad">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="remoto">Remoto</SelectItem>
                      <SelectItem value="presencial">Presencial</SelectItem>
                      <SelectItem value="hibrido">Híbrido</SelectItem>
                      <SelectItem value="freelance">Freelance</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
                <FormField label="Fecha de inicio" htmlFor="fecha_inicio" required error={form.formState.errors.fecha_inicio?.message}>
                  <Input id="fecha_inicio" type="date" {...form.register("fecha_inicio")} />
                </FormField>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="actual"
                  checked={actual}
                  onCheckedChange={(v) => {
                    form.setValue("actual", Boolean(v));
                    if (v) form.setValue("fecha_fin", null);
                  }}
                />
                <Label htmlFor="actual" className="cursor-pointer font-normal">
                  Trabajo actual (sin fecha de fin)
                </Label>
              </div>
              {!actual && (
                <FormField label="Fecha de fin" htmlFor="fecha_fin" error={form.formState.errors.fecha_fin?.message}>
                  <Input id="fecha_fin" type="date" value={form.watch("fecha_fin") ?? ""} onChange={(e) => form.setValue("fecha_fin", e.target.value || null)} />
                </FormField>
              )}
            </FormSection>
          </TabsContent>

          <TabsContent value="descripcion">
            <FormSection title="Descripción" description="Detalle de responsabilidades y contexto del rol.">
              <FormField label="Descripción" htmlFor="descripcion">
                <Textarea id="descripcion" rows={8} {...form.register("descripcion")} />
              </FormField>
            </FormSection>
            <FormSection title="Logros" description="Resultados concretos y medibles, uno por línea.">
              <TextListEditor
                value={form.watch("logros")}
                onChange={(logros) => form.setValue("logros", logros)}
                itemLabel="logro"
                placeholder="Ej: Reduje el tiempo de cierre contable de 5 a 2 días"
              />
            </FormSection>
          </TabsContent>

          <TabsContent value="tecnologias">
            <FormSection title="Tecnologías" description="El stack usado en este rol (opcional).">
              <TechnologySelector
                value={form.watch("tecnologia_ids")}
                onChange={(ids) => form.setValue("tecnologia_ids", ids)}
              />
            </FormSection>
          </TabsContent>

          <TabsContent value="proyectos">
            <FormSection title="Proyectos relacionados" description="Proyectos del portafolio realizados durante esta experiencia.">
              <ProyectoSelector
                value={form.watch("proyecto_ids")}
                onChange={(ids) => form.setValue("proyecto_ids", ids)}
              />
            </FormSection>
          </TabsContent>

          <TabsContent value="publicacion">
            <FormSection title="Visibilidad">
              <div className="flex items-center gap-2">
                <Checkbox id="destacado" checked={form.watch("destacado")} onCheckedChange={(v) => form.setValue("destacado", Boolean(v))} />
                <Label htmlFor="destacado" className="cursor-pointer font-normal">
                  Mostrar como experiencia destacada
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="visible" checked={form.watch("visible")} onCheckedChange={(v) => form.setValue("visible", Boolean(v))} />
                <Label htmlFor="visible" className="cursor-pointer font-normal">
                  Visible en el sitio público
                </Label>
              </div>
              <FormField label="Orden" htmlFor="orden" hint="Menor número aparece primero (dentro del mismo periodo).">
                <Input id="orden" type="number" min={0} {...form.register("orden", { valueAsNumber: true })} className="w-32" />
              </FormField>
            </FormSection>
            {esEdicion && experiencia && (
              <p className="text-sm text-muted-foreground">
                Para publicar o despublicar esta experiencia, usa el menú de acciones desde el listado.
              </p>
            )}
          </TabsContent>
        </Tabs>
      </form>
    </FormProvider>
  );
}
