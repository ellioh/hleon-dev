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
import { OrganizacionSelector } from "@/components/shared/organizacion-selector";
import { TechnologySelector } from "@/components/shared/technology-selector";
import { ImageUploader } from "@/components/shared/image-uploader";
import { GalleryUploader } from "@/components/shared/gallery-uploader";
import { SeoEditor } from "@/components/shared/seo-editor";
import { BlockLoadingState } from "@/components/shared/loading-state";
import { ErrorState } from "@/components/shared/error-state";
import { proyectoSchema, valoresVacios, type ProyectoFormValues } from "@/features/proyectos/proyecto-schema";
import { proyectoToFormValues } from "@/features/proyectos/proyecto-mappers";
import {
  useActualizarProyecto,
  useCrearProyecto,
  useProyecto,
  useSincronizarGaleria,
} from "@/features/proyectos/api";
import { ApiError } from "@/lib/api";
import type { MediaItem } from "@/types/api";

const TABS = [
  { value: "general", label: "General" },
  { value: "caso", label: "Caso de estudio" },
  { value: "tecnologias", label: "Tecnologías" },
  { value: "medios", label: "Medios" },
  { value: "seo", label: "SEO" },
  { value: "publicacion", label: "Publicación" },
] as const;

export function ProyectoFormPage() {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const esEdicion = params.id !== undefined && params.id !== "nuevo";
  const id = esEdicion ? Number(params.id) : undefined;

  const { data: proyecto, isLoading, error } = useProyecto(id);
  const crear = useCrearProyecto();
  const actualizar = useActualizarProyecto(id ?? 0);
  const sincronizarGaleria = useSincronizarGaleria(id ?? 0);

  const form = useForm<ProyectoFormValues>({
    resolver: zodResolver(proyectoSchema),
    defaultValues: valoresVacios,
  });

  const [galeria, setGaleria] = React.useState<MediaItem[]>([]);
  // El formulario solo guarda imagen_principal_id (number); este estado
  // separado es lo único que le da a ImageUploader el objeto MediaItem
  // completo para mostrar la vista previa - evita que quede mostrando el
  // dato viejo de `proyecto` cuando el usuario sube una imagen nueva.
  const [imagenPrincipal, setImagenPrincipal] = React.useState<MediaItem | null>(null);

  React.useEffect(() => {
    if (proyecto) {
      form.reset(proyectoToFormValues(proyecto));
      setGaleria(proyecto.galeria);
      setImagenPrincipal(proyecto.imagenPrincipal);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proyecto]);

  async function onSubmit(datos: ProyectoFormValues) {
    try {
      if (esEdicion && id) {
        await actualizar.mutateAsync(datos);
        toast.success("Cambios guardados.");
      } else {
        const creado = await crear.mutateAsync(datos);
        toast.success("Proyecto creado. Ya puedes agregar la galería.");
        navigate(`/proyectos/${creado.data.id}`, { replace: true });
      }
    } catch (err) {
      if (err instanceof ApiError && err.errors) {
        for (const [campo, mensajes] of Object.entries(err.errors)) {
          form.setError(campo as keyof ProyectoFormValues, { message: mensajes[0] });
        }
        toast.error("Revisa los campos marcados.");
      } else {
        toast.error(err instanceof ApiError ? err.message : "No se pudo guardar el proyecto.");
      }
    }
  }

  async function onGaleriaChange(nueva: MediaItem[]) {
    setGaleria(nueva);
    if (!id) return; // se sincroniza recién cuando el proyecto ya existe
    try {
      await sincronizarGaleria.mutateAsync(nueva.map((m) => m.id));
    } catch {
      toast.error("No se pudo actualizar la galería.");
    }
  }

  if (esEdicion && isLoading) return <BlockLoadingState lineas={8} />;
  if (esEdicion && error) return <ErrorState error={error} />;

  const guardando = crear.isPending || actualizar.isPending;

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{esEdicion ? "Editar proyecto" : "Nuevo proyecto"}</h1>
            {esEdicion && proyecto && <p className="text-sm text-muted-foreground">/{proyecto.slug}</p>}
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => navigate("/proyectos")}>
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
              <FormField label="Nombre" htmlFor="nombre" required error={form.formState.errors.nombre?.message}>
                <Input id="nombre" {...form.register("nombre")} aria-invalid={Boolean(form.formState.errors.nombre)} />
              </FormField>
              <FormField label="Slug" htmlFor="slug" hint="Se genera automáticamente si lo dejas vacío." error={form.formState.errors.slug?.message}>
                <Input id="slug" {...form.register("slug")} />
              </FormField>
              <FormField
                label="Resumen ejecutivo"
                htmlFor="resumen_ejecutivo"
                required
                hint="Se muestra en las tarjetas del listado público (máx. 220 caracteres)."
                error={form.formState.errors.resumen_ejecutivo?.message}
              >
                <Textarea id="resumen_ejecutivo" maxLength={220} rows={3} {...form.register("resumen_ejecutivo")} />
              </FormField>
              <FormField label="Categoría" htmlFor="categoria_id" required error={form.formState.errors.categoria_id?.message}>
                <CategorySelector
                  value={form.watch("categoria_id") || null}
                  onChange={(id) => form.setValue("categoria_id", id, { shouldValidate: true })}
                />
              </FormField>
              <FormField label="URL pública" htmlFor="url_publica" hint="Si el proyecto tiene un sitio en vivo." error={form.formState.errors.url_publica?.message}>
                <Input id="url_publica" type="url" placeholder="https://..." {...form.register("url_publica")} />
              </FormField>
              <FormField label="Organización (cliente)" htmlFor="organizacion_id" hint="Déjalo sin asignar si no aplica.">
                <div className="flex items-center gap-3">
                  <OrganizacionSelector
                    tipo="cliente"
                    value={form.watch("organizacion_id")}
                    onChange={(id) => form.setValue("organizacion_id", id)}
                  />
                  {form.watch("organizacion_id") !== null && (
                    <Button type="button" variant="ghost" size="sm" onClick={() => form.setValue("organizacion_id", null)}>
                      Quitar
                    </Button>
                  )}
                </div>
              </FormField>
            </FormSection>

            <FormSection title="Contexto" description="Datos objetivos, no narrativa - eso va en 'Caso de estudio'.">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Estado" htmlFor="estado" required>
                  <Select value={form.watch("estado")} onValueChange={(v) => form.setValue("estado", v as ProyectoFormValues["estado"])}>
                    <SelectTrigger id="estado">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en_curso">En curso</SelectItem>
                      <SelectItem value="completado">Completado</SelectItem>
                      <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                      <SelectItem value="archivado">Archivado</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
                <FormField label="Modalidad" htmlFor="modalidad" hint="Déjalo vacío si no lo sabes con certeza.">
                  <Select
                    value={form.watch("modalidad") ?? "sin_definir"}
                    onValueChange={(v) => form.setValue("modalidad", v === "sin_definir" ? null : (v as ProyectoFormValues["modalidad"]))}
                  >
                    <SelectTrigger id="modalidad">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sin_definir">Sin definir</SelectItem>
                      <SelectItem value="remoto">Remoto</SelectItem>
                      <SelectItem value="presencial">Presencial</SelectItem>
                      <SelectItem value="hibrido">Híbrido</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Fecha de inicio" htmlFor="fecha_inicio" hint="Déjalo vacío si no la conoces con certeza.">
                  <Input id="fecha_inicio" type="date" {...form.register("fecha_inicio")} />
                </FormField>
                <FormField label="Fecha de fin" htmlFor="fecha_fin" error={form.formState.errors.fecha_fin?.message}>
                  <Input id="fecha_fin" type="date" {...form.register("fecha_fin")} />
                </FormField>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="es_confidencial"
                  checked={form.watch("es_confidencial")}
                  onCheckedChange={(v) => form.setValue("es_confidencial", Boolean(v))}
                />
                <Label htmlFor="es_confidencial" className="cursor-pointer font-normal">
                  Proyecto confidencial (oculta la organización en el sitio público)
                </Label>
              </div>
            </FormSection>
          </TabsContent>

          <TabsContent value="caso">
            <FormSection title="El caso de estudio" description="Esta narrativa es obligatoria para poder publicar el proyecto.">
              <FormField label="El desafío" htmlFor="el_desafio" hint="El contexto/problema de negocio.">
                <Textarea id="el_desafio" rows={6} {...form.register("el_desafio")} />
              </FormField>
              <FormField label="La solución" htmlFor="la_solucion">
                <Textarea id="la_solucion" rows={6} {...form.register("la_solucion")} />
              </FormField>
              <FormField label="Mi rol" htmlFor="mi_rol" hint="Enmárcalo como analista: qué levantaste, qué diseñaste, qué lideraste.">
                <Textarea id="mi_rol" rows={6} {...form.register("mi_rol")} />
              </FormField>
              <FormField label="Arquitectura" htmlFor="arquitectura">
                <Textarea id="arquitectura" rows={4} {...form.register("arquitectura")} />
              </FormField>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Retos" htmlFor="retos">
                  <Textarea id="retos" rows={4} {...form.register("retos")} />
                </FormField>
                <FormField label="Aprendizajes" htmlFor="aprendizajes">
                  <Textarea id="aprendizajes" rows={4} {...form.register("aprendizajes")} />
                </FormField>
              </div>
            </FormSection>
          </TabsContent>

          <TabsContent value="tecnologias">
            <FormSection title="Tecnologías" description="Al menos una es obligatoria.">
              <TechnologySelector
                value={form.watch("tecnologia_ids")}
                onChange={(ids) => form.setValue("tecnologia_ids", ids, { shouldValidate: true })}
              />
              {form.formState.errors.tecnologia_ids && (
                <p className="text-xs text-destructive" role="alert">
                  {form.formState.errors.tecnologia_ids.message}
                </p>
              )}
            </FormSection>
          </TabsContent>

          <TabsContent value="medios">
            <FormSection title="Imagen principal">
              <ImageUploader
                label="imagen principal"
                value={imagenPrincipal}
                onChange={(media) => {
                  setImagenPrincipal(media);
                  form.setValue("imagen_principal_id", media?.id ?? null);
                }}
              />
            </FormSection>
            <FormSection
              title="Galería"
              description={id ? "Los cambios se guardan al instante." : "Guarda el proyecto primero para poder agregar la galería."}
            >
              <GalleryUploader value={galeria} onChange={onGaleriaChange} disabled={!id} />
            </FormSection>
          </TabsContent>

          <TabsContent value="seo">
            <SeoEditor />
          </TabsContent>

          <TabsContent value="publicacion">
            <FormSection title="Visibilidad">
              <div className="flex items-center gap-2">
                <Checkbox id="destacado" checked={form.watch("destacado")} onCheckedChange={(v) => form.setValue("destacado", Boolean(v))} />
                <Label htmlFor="destacado" className="cursor-pointer font-normal">
                  Mostrar como proyecto destacado en el home
                </Label>
              </div>
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
            {esEdicion && proyecto && (
              <p className="text-sm text-muted-foreground">
                Para publicar o despublicar este proyecto, usa el menú de acciones desde el listado.
              </p>
            )}
          </TabsContent>
        </Tabs>
      </form>
    </FormProvider>
  );
}
