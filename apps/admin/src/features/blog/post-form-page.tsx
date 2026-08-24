import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormField, FormSection } from "@/components/shared/form-section";
import { CategorySelector } from "@/components/shared/category-selector";
import { ImageUploader } from "@/components/shared/image-uploader";
import { SeoEditor } from "@/components/shared/seo-editor";
import { BlockLoadingState } from "@/components/shared/loading-state";
import { ErrorState } from "@/components/shared/error-state";
import { TagsEditor } from "@/features/blog/tags-editor";
import { postSchema, valoresVacios, type PostFormValues } from "@/features/blog/post-schema";
import { postToFormValues } from "@/features/blog/post-mappers";
import { useActualizarPost, useCrearPost, usePost } from "@/features/blog/api";
import { ApiError } from "@/lib/api";
import type { MediaItem } from "@/types/api";

const TABS = [
  { value: "general", label: "General" },
  { value: "contenido", label: "Contenido" },
  { value: "seo", label: "SEO" },
  { value: "publicacion", label: "Publicación" },
] as const;

export function PostFormPage() {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const esEdicion = params.id !== undefined && params.id !== "nuevo";
  const id = esEdicion ? Number(params.id) : undefined;

  const { data: post, isLoading, error } = usePost(id);
  const crear = useCrearPost();
  const actualizar = useActualizarPost(id ?? 0);

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: valoresVacios,
  });

  const [imagenDestacada, setImagenDestacada] = React.useState<MediaItem | null>(null);

  React.useEffect(() => {
    if (post) {
      form.reset(postToFormValues(post));
      setImagenDestacada(post.imagenDestacada);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post]);

  async function onSubmit(datos: PostFormValues) {
    try {
      if (esEdicion && id) {
        await actualizar.mutateAsync(datos);
        toast.success("Cambios guardados.");
      } else {
        const creado = await crear.mutateAsync(datos);
        toast.success("Artículo creado.");
        navigate(`/blog/${creado.data.id}`, { replace: true });
      }
    } catch (err) {
      if (err instanceof ApiError && err.errors) {
        for (const [campo, mensajes] of Object.entries(err.errors)) {
          form.setError(campo as keyof PostFormValues, { message: mensajes[0] });
        }
        toast.error("Revisa los campos marcados.");
      } else {
        toast.error(err instanceof ApiError ? err.message : "No se pudo guardar el artículo.");
      }
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
            <h1 className="text-2xl font-bold text-foreground">{esEdicion ? "Editar artículo" : "Nuevo artículo"}</h1>
            {esEdicion && post && <p className="text-sm text-muted-foreground">/{post.slug}</p>}
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => navigate("/blog")}>
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
              <FormField label="Título" htmlFor="titulo" required error={form.formState.errors.titulo?.message}>
                <Input id="titulo" {...form.register("titulo")} aria-invalid={Boolean(form.formState.errors.titulo)} />
              </FormField>
              <FormField label="Slug" htmlFor="slug" hint="Se genera automáticamente si lo dejas vacío." error={form.formState.errors.slug?.message}>
                <Input id="slug" {...form.register("slug")} />
              </FormField>
              <FormField
                label="Resumen"
                htmlFor="resumen"
                required
                hint="Se muestra en las tarjetas del listado público (máx. 300 caracteres)."
                error={form.formState.errors.resumen?.message}
              >
                <Textarea id="resumen" maxLength={300} rows={3} {...form.register("resumen")} />
              </FormField>
              <FormField label="Categoría" htmlFor="categoria_id" required error={form.formState.errors.categoria_id?.message}>
                <CategorySelector
                  value={form.watch("categoria_id") || null}
                  onChange={(id) => form.setValue("categoria_id", id, { shouldValidate: true })}
                />
              </FormField>
              <FormField label="Audiencia" htmlFor="tipo_audiencia" required hint="Determina el CTA que se muestra al final del artículo.">
                <Select
                  value={form.watch("tipo_audiencia")}
                  onValueChange={(v) => form.setValue("tipo_audiencia", v as PostFormValues["tipo_audiencia"])}
                >
                  <SelectTrigger id="tipo_audiencia">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="consultoria">Consultoría (clientes)</SelectItem>
                    <SelectItem value="carrera_arquitectura">Carrera / reclutadores</SelectItem>
                    <SelectItem value="ambos">Ambos</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Tags" htmlFor="tags">
                <TagsEditor value={form.watch("tags")} onChange={(tags) => form.setValue("tags", tags)} />
              </FormField>
            </FormSection>

            <FormSection title="Imagen destacada">
              <ImageUploader
                label="imagen destacada"
                value={imagenDestacada}
                onChange={(media) => {
                  setImagenDestacada(media);
                  form.setValue("imagen_destacada_id", media?.id ?? null);
                }}
              />
            </FormSection>
          </TabsContent>

          <TabsContent value="contenido">
            <FormSection title="Contenido" description="Markdown. Se renderiza con el mismo formato que el resto del blog.">
              <FormField label="Contenido" htmlFor="post-contenido" required error={form.formState.errors.contenido?.message}>
                <Textarea id="post-contenido" rows={24} className="font-mono text-sm" {...form.register("contenido")} />
              </FormField>
            </FormSection>
          </TabsContent>

          <TabsContent value="seo">
            <SeoEditor />
          </TabsContent>

          <TabsContent value="publicacion">
            <FormSection title="Publicación">
              <FormField
                label="Fecha de publicación"
                htmlFor="fecha_publicacion"
                hint="Déjalo vacío para publicar con la fecha de hoy. Una fecha futura programa la publicación."
              >
                <Input
                  id="fecha_publicacion"
                  type="datetime-local"
                  value={form.watch("fecha_publicacion")?.slice(0, 16) ?? ""}
                  onChange={(e) => form.setValue("fecha_publicacion", e.target.value || null)}
                />
              </FormField>
            </FormSection>
            {esEdicion && post && (
              <p className="text-sm text-muted-foreground">
                Para publicar o despublicar este artículo, usa el menú de acciones desde el listado.
              </p>
            )}
          </TabsContent>
        </Tabs>
      </form>
    </FormProvider>
  );
}
