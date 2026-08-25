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
import { CategorySelector } from "@/components/shared/category-selector";
import { TextListEditor } from "@/components/shared/text-list-editor";
import { SeoEditor } from "@/components/shared/seo-editor";
import { BlockLoadingState } from "@/components/shared/loading-state";
import { ErrorState } from "@/components/shared/error-state";
import { ProyectoEjemploSelector } from "@/features/servicios/proyecto-ejemplo-selector";
import { servicioSchema, valoresVacios, type ServicioFormValues } from "@/features/servicios/servicio-schema";
import { servicioToFormValues } from "@/features/servicios/servicio-mappers";
import { useActualizarServicio, useCrearServicio, useServicio } from "@/features/servicios/api";
import { ApiError } from "@/lib/api";

const TABS = [
  { value: "general", label: "General" },
  { value: "descripcion", label: "Descripción y entregables" },
  { value: "seo", label: "SEO" },
  { value: "publicacion", label: "Publicación" },
] as const;

export function ServicioFormPage() {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const esEdicion = params.id !== undefined && params.id !== "nuevo";
  const id = esEdicion ? Number(params.id) : undefined;

  const { data: servicio, isLoading, error } = useServicio(id);
  const crear = useCrearServicio();
  const actualizar = useActualizarServicio(id ?? 0);

  const form = useForm<ServicioFormValues>({
    resolver: zodResolver(servicioSchema),
    defaultValues: valoresVacios,
  });

  React.useEffect(() => {
    if (servicio) {
      form.reset(servicioToFormValues(servicio));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [servicio]);

  async function onSubmit(datos: ServicioFormValues) {
    try {
      if (esEdicion && id) {
        await actualizar.mutateAsync(datos);
        toast.success("Cambios guardados.");
      } else {
        const creado = await crear.mutateAsync(datos);
        toast.success("Servicio creado.");
        navigate(`/servicios/${creado.data.id}`, { replace: true });
      }
    } catch (err) {
      if (err instanceof ApiError && err.errors) {
        for (const [campo, mensajes] of Object.entries(err.errors)) {
          form.setError(campo as keyof ServicioFormValues, { message: mensajes[0] });
        }
        toast.error("Revisa los campos marcados.");
      } else {
        toast.error(err instanceof ApiError ? err.message : "No se pudo guardar el servicio.");
      }
    }
  }

  if (esEdicion && isLoading) return <BlockLoadingState lineas={8} />;
  if (esEdicion && error) return <ErrorState error={error} />;

  const guardando = crear.isPending || actualizar.isPending;
  const tieneRangoPrecio = form.watch("rango_precio_min") !== null || form.watch("rango_precio_max") !== null;

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{esEdicion ? "Editar servicio" : "Nuevo servicio"}</h1>
            {esEdicion && servicio && <p className="text-sm text-muted-foreground">/{servicio.slug}</p>}
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => navigate("/servicios")}>
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
              <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
                <FormField label="Nombre" htmlFor="nombre" required error={form.formState.errors.nombre?.message}>
                  <Input id="nombre" {...form.register("nombre")} aria-invalid={Boolean(form.formState.errors.nombre)} />
                </FormField>
                <FormField label="Ícono" htmlFor="icono_emoji" hint="Un emoji.">
                  <Input
                    id="icono_emoji"
                    className="w-20 text-center text-lg"
                    value={form.watch("icono_emoji") ?? ""}
                    onChange={(e) => form.setValue("icono_emoji", e.target.value || null)}
                  />
                </FormField>
              </div>
              <FormField label="Slug" htmlFor="slug" hint="Se genera automáticamente si lo dejas vacío." error={form.formState.errors.slug?.message}>
                <Input id="slug" {...form.register("slug")} />
              </FormField>
              <FormField
                label="Resumen breve"
                htmlFor="resumen_breve"
                required
                hint="Se muestra en las tarjetas del listado público (máx. 150 caracteres)."
                error={form.formState.errors.resumen_breve?.message}
              >
                <Textarea id="resumen_breve" maxLength={150} rows={2} {...form.register("resumen_breve")} />
              </FormField>
              <FormField label="Categoría" htmlFor="categoria_id" required error={form.formState.errors.categoria_id?.message}>
                <CategorySelector
                  value={form.watch("categoria_id") || null}
                  onChange={(id) => form.setValue("categoria_id", id, { shouldValidate: true })}
                />
              </FormField>
              <FormField label="Proyecto de ejemplo" htmlFor="proyecto_ejemplo_id" hint="Se oculta en el sitio público si el proyecto no está publicado.">
                <ProyectoEjemploSelector
                  value={form.watch("proyecto_ejemplo_id")}
                  onChange={(id) => form.setValue("proyecto_ejemplo_id", id)}
                />
              </FormField>
            </FormSection>

            <FormSection title="Precio y tiempo estimado" description="Opcional - déjalo vacío si prefieres cotizar caso por caso.">
              <div className="grid gap-4 sm:grid-cols-3">
                <FormField label="Precio mínimo" htmlFor="rango_precio_min" error={form.formState.errors.rango_precio_min?.message}>
                  <Input
                    id="rango_precio_min"
                    type="number"
                    min={0}
                    value={form.watch("rango_precio_min") ?? ""}
                    onChange={(e) => form.setValue("rango_precio_min", e.target.value === "" ? null : Number(e.target.value))}
                  />
                </FormField>
                <FormField label="Precio máximo" htmlFor="rango_precio_max" error={form.formState.errors.rango_precio_max?.message}>
                  <Input
                    id="rango_precio_max"
                    type="number"
                    min={0}
                    value={form.watch("rango_precio_max") ?? ""}
                    onChange={(e) => form.setValue("rango_precio_max", e.target.value === "" ? null : Number(e.target.value))}
                  />
                </FormField>
                <FormField label="Moneda" htmlFor="moneda" required={tieneRangoPrecio} error={form.formState.errors.moneda?.message}>
                  <Select
                    value={form.watch("moneda") ?? "sin_definir"}
                    onValueChange={(v) => form.setValue("moneda", v === "sin_definir" ? null : (v as ServicioFormValues["moneda"]))}
                  >
                    <SelectTrigger id="moneda">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sin_definir">Sin definir</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="PEN">PEN</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
              </div>
              <FormField label="Tiempo estimado" htmlFor="tiempo_estimado" hint='Ej: "2-4 semanas".'>
                <Input
                  id="tiempo_estimado"
                  value={form.watch("tiempo_estimado") ?? ""}
                  onChange={(e) => form.setValue("tiempo_estimado", e.target.value || null)}
                />
              </FormField>
            </FormSection>
          </TabsContent>

          <TabsContent value="descripcion">
            <FormSection title="Descripción completa" description="Se muestra en la página propia del servicio.">
              <FormField label="Descripción completa" htmlFor="descripcion_completa" required error={form.formState.errors.descripcion_completa?.message}>
                <Textarea id="descripcion_completa" rows={10} {...form.register("descripcion_completa")} />
              </FormField>
            </FormSection>
            <FormSection title="Entregables típicos" description="Lo que incluye este servicio, uno por línea.">
              <TextListEditor
                value={form.watch("entregables")}
                onChange={(entregables) => form.setValue("entregables", entregables)}
                itemLabel="entregable"
                placeholder="Ej: Documento de arquitectura del sistema"
              />
            </FormSection>
          </TabsContent>

          <TabsContent value="seo">
            <SeoEditor />
          </TabsContent>

          <TabsContent value="publicacion">
            <FormSection title="Visibilidad" description="Servicio no tiene borrador/publicado: este toggle controla la visibilidad directamente.">
              <div className="flex items-center gap-2">
                <Checkbox id="visible" checked={form.watch("visible")} onCheckedChange={(v) => form.setValue("visible", Boolean(v))} />
                <Label htmlFor="visible" className="cursor-pointer font-normal">
                  Visible en el sitio público
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="destacado" checked={form.watch("destacado")} onCheckedChange={(v) => form.setValue("destacado", Boolean(v))} />
                <Label htmlFor="destacado" className="cursor-pointer font-normal">
                  Mostrar como servicio destacado
                </Label>
              </div>
              <FormField label="Orden" htmlFor="orden" hint="Menor número aparece primero.">
                <Input id="orden" type="number" min={0} {...form.register("orden", { valueAsNumber: true })} className="w-32" />
              </FormField>
            </FormSection>
          </TabsContent>
        </Tabs>
      </form>
    </FormProvider>
  );
}
