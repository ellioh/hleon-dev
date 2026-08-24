import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField, FormSection } from "@/components/shared/form-section";
import { ImageUploader } from "@/components/shared/image-uploader";
import { BlockLoadingState } from "@/components/shared/loading-state";
import { ErrorState } from "@/components/shared/error-state";
import { perfilSchema, valoresVacios, type PerfilFormValues } from "@/features/perfil/perfil-schema";
import { perfilToFormValues } from "@/features/perfil/perfil-mappers";
import { useGuardarPerfil, usePerfil } from "@/features/perfil/api";
import { ApiError } from "@/lib/api";
import type { MediaItem } from "@/types/api";

/**
 * Singleton: un solo formulario, sin listado ni id en la URL. Es el
 * prerequisito real para poder crear Posts (autor_id se resuelve del
 * lado del servidor a partir de este perfil - ver PostService::crear).
 */
export function PerfilPage() {
  const { data: perfil, isLoading, error } = usePerfil();
  const guardar = useGuardarPerfil();

  const form = useForm<PerfilFormValues>({
    resolver: zodResolver(perfilSchema),
    defaultValues: valoresVacios,
  });

  const [foto, setFoto] = React.useState<MediaItem | null>(null);

  React.useEffect(() => {
    if (perfil) {
      form.reset(perfilToFormValues(perfil));
      setFoto(perfil.foto);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [perfil]);

  async function onSubmit(datos: PerfilFormValues) {
    try {
      await guardar.mutateAsync(datos);
      toast.success("Perfil guardado.");
    } catch (err) {
      if (err instanceof ApiError && err.errors) {
        for (const [campo, mensajes] of Object.entries(err.errors)) {
          form.setError(campo as keyof PerfilFormValues, { message: mensajes[0] });
        }
        toast.error("Revisa los campos marcados.");
      } else {
        toast.error(err instanceof ApiError ? err.message : "No se pudo guardar el perfil.");
      }
    }
  }

  if (isLoading) return <BlockLoadingState lineas={8} />;
  if (error) return <ErrorState error={error} />;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mi perfil</h1>
          <p className="text-sm text-muted-foreground">
            {perfil ? "Se usa como autor de tus artículos del blog." : "Complétalo para poder publicar artículos."}
          </p>
        </div>
        <Button type="submit" disabled={guardar.isPending}>
          {guardar.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Guardar
        </Button>
      </div>

      <FormSection title="Identidad">
        <FormField label="Nombre completo" htmlFor="nombre_completo" required error={form.formState.errors.nombre_completo?.message}>
          <Input id="nombre_completo" {...form.register("nombre_completo")} />
        </FormField>
        <FormField label="Nombre público" htmlFor="nombre_publico" hint="Si lo dejas vacío, se usa el nombre completo.">
          <Input
            id="nombre_publico"
            value={form.watch("nombre_publico") ?? ""}
            onChange={(e) => form.setValue("nombre_publico", e.target.value || null)}
          />
        </FormField>
        <FormField label="Título profesional" htmlFor="titulo_profesional" required error={form.formState.errors.titulo_profesional?.message}>
          <Input id="titulo_profesional" {...form.register("titulo_profesional")} />
        </FormField>
        <FormField label="Email" htmlFor="email" required error={form.formState.errors.email?.message}>
          <Input id="email" type="email" {...form.register("email")} />
        </FormField>
        <FormField label="Ubicación" htmlFor="ubicacion" required error={form.formState.errors.ubicacion?.message}>
          <Input id="ubicacion" {...form.register("ubicacion")} />
        </FormField>
      </FormSection>

      <FormSection title="Biografía">
        <FormField label="Bio corta" htmlFor="bio_corta" required hint="Máx. 200 caracteres." error={form.formState.errors.bio_corta?.message}>
          <Textarea id="bio_corta" maxLength={200} rows={2} {...form.register("bio_corta")} />
        </FormField>
        <FormField label="Bio larga" htmlFor="bio_larga" required error={form.formState.errors.bio_larga?.message}>
          <Textarea id="bio_larga" rows={8} {...form.register("bio_larga")} />
        </FormField>
        <FormField label="Foto" htmlFor="foto">
          <ImageUploader
            label="foto de perfil"
            value={foto}
            onChange={(media) => {
              setFoto(media);
              form.setValue("foto_media_id", media?.id ?? null);
            }}
          />
        </FormField>
      </FormSection>

      <FormSection title="Disponibilidad">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Nivel de inglés" htmlFor="nivel_ingles" required>
            <Select value={form.watch("nivel_ingles")} onValueChange={(v) => form.setValue("nivel_ingles", v as PerfilFormValues["nivel_ingles"])}>
              <SelectTrigger id="nivel_ingles">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basico">Básico</SelectItem>
                <SelectItem value="intermedio">Intermedio</SelectItem>
                <SelectItem value="avanzado">Avanzado</SelectItem>
                <SelectItem value="profesional">Profesional</SelectItem>
                <SelectItem value="nativo">Nativo</SelectItem>
              </SelectContent>
            </Select>
          </FormField>
          <FormField label="Años de experiencia" htmlFor="anos_experiencia" required>
            <Input
              id="anos_experiencia"
              type="number"
              min={0}
              {...form.register("anos_experiencia", { valueAsNumber: true })}
            />
          </FormField>
        </div>
        <FormField label="Disponibilidad" htmlFor="disponibilidad" required>
          <Select value={form.watch("disponibilidad")} onValueChange={(v) => form.setValue("disponibilidad", v as PerfilFormValues["disponibilidad"])}>
            <SelectTrigger id="disponibilidad">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="abierto_remoto">Abierto a trabajo remoto</SelectItem>
              <SelectItem value="abierto_proyectos">Abierto a proyectos</SelectItem>
              <SelectItem value="abierto_ambos">Abierto a ambos</SelectItem>
              <SelectItem value="no_disponible">No disponible</SelectItem>
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="Mensaje de disponibilidad" htmlFor="mensaje_disponibilidad" hint="Opcional, se muestra junto al estado.">
          <Input
            id="mensaje_disponibilidad"
            value={form.watch("mensaje_disponibilidad") ?? ""}
            onChange={(e) => form.setValue("mensaje_disponibilidad", e.target.value || null)}
          />
        </FormField>
      </FormSection>
    </form>
  );
}
