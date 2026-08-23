import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField, FormSection } from "@/components/shared/form-section";

/**
 * Pestaña SEO reutilizable - meta título/descripción, canonical,
 * indexación, Open Graph y Twitter Cards. Pensada para montarse tal cual
 * en el formulario de Post/Servicio cuando existan (misma forma
 * `seo_metadata` polimórfica del backend, ver ADR 0006). Requiere que el
 * formulario padre use <FormProvider> de react-hook-form.
 */
export function SeoEditor() {
  const { register, watch, setValue } = useFormContext();

  const robotsIndex = watch("seo.robotsIndex") ?? true;
  const robotsFollow = watch("seo.robotsFollow") ?? true;
  const twitterCard = watch("seo.twitterCard") ?? "summary_large_image";
  const metaDescripcion: string = watch("seo.metaDescripcion") ?? "";

  return (
    <div className="space-y-8">
      <FormSection title="Meta tags" description="Si se dejan vacíos, el sitio público usa el nombre y el resumen ejecutivo por defecto.">
        <FormField label="Meta título" htmlFor="seo-meta-titulo">
          <Input id="seo-meta-titulo" maxLength={160} {...register("seo.metaTitulo")} />
        </FormField>
        <FormField label="Meta descripción" htmlFor="seo-meta-descripcion" hint={`${metaDescripcion.length}/160 caracteres`}>
          <Textarea id="seo-meta-descripcion" maxLength={160} rows={3} {...register("seo.metaDescripcion")} />
        </FormField>
        <FormField label="URL canónica" htmlFor="seo-canonical" hint="Déjalo vacío salvo que este contenido exista también en otra URL.">
          <Input id="seo-canonical" type="url" placeholder="https://hleon.dev/..." {...register("seo.canonicalUrl")} />
        </FormField>
      </FormSection>

      <FormSection title="Indexación">
        <div className="flex items-center gap-2">
          <Checkbox id="seo-robots-index" checked={robotsIndex} onCheckedChange={(v) => setValue("seo.robotsIndex", Boolean(v))} />
          <Label htmlFor="seo-robots-index" className="cursor-pointer font-normal">
            Permitir que los buscadores indexen esta página
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="seo-robots-follow" checked={robotsFollow} onCheckedChange={(v) => setValue("seo.robotsFollow", Boolean(v))} />
          <Label htmlFor="seo-robots-follow" className="cursor-pointer font-normal">
            Permitir seguir los enlaces de esta página
          </Label>
        </div>
      </FormSection>

      <FormSection title="Open Graph" description="Cómo se ve al compartir en redes sociales.">
        <FormField label="Título OG" htmlFor="seo-og-titulo">
          <Input id="seo-og-titulo" maxLength={160} {...register("seo.ogTitulo")} />
        </FormField>
        <FormField label="Descripción OG" htmlFor="seo-og-descripcion">
          <Textarea id="seo-og-descripcion" maxLength={200} rows={2} {...register("seo.ogDescripcion")} />
        </FormField>
      </FormSection>

      <FormSection title="Twitter Card">
        <FormField label="Tipo de tarjeta" htmlFor="seo-twitter-card">
          <Select value={twitterCard} onValueChange={(v) => setValue("seo.twitterCard", v)}>
            <SelectTrigger id="seo-twitter-card">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="summary_large_image">Imagen grande</SelectItem>
              <SelectItem value="summary">Resumen</SelectItem>
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="Título Twitter" htmlFor="seo-twitter-titulo">
          <Input id="seo-twitter-titulo" maxLength={160} {...register("seo.twitterTitulo")} />
        </FormField>
        <FormField label="Descripción Twitter" htmlFor="seo-twitter-descripcion">
          <Textarea id="seo-twitter-descripcion" maxLength={200} rows={2} {...register("seo.twitterDescripcion")} />
        </FormField>
      </FormSection>
    </div>
  );
}
