import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "@/features/auth/login-page";
import { ProtectedRoute } from "@/components/layout/protected-route";
import { DashboardPage } from "@/features/dashboard/dashboard-page";
import { ProyectosListPage } from "@/features/proyectos/proyectos-list-page";
import { ProyectoFormPage } from "@/features/proyectos/proyecto-form-page";
import { ExperienciasListPage } from "@/features/experiencia/experiencias-list-page";
import { ExperienciaFormPage } from "@/features/experiencia/experiencia-form-page";
import { PerfilPage } from "@/features/perfil/perfil-page";
import { PostsListPage } from "@/features/blog/posts-list-page";
import { PostFormPage } from "@/features/blog/post-form-page";
import { ServiciosListPage } from "@/features/servicios/servicios-list-page";
import { ServicioFormPage } from "@/features/servicios/servicio-form-page";
import { CertificacionesListPage } from "@/features/certificaciones/certificaciones-list-page";
import { CertificacionFormPage } from "@/features/certificaciones/certificacion-form-page";
import { EducacionesListPage } from "@/features/educacion/educaciones-list-page";
import { EducacionFormPage } from "@/features/educacion/educacion-form-page";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/proyectos" element={<ProyectosListPage />} />
        <Route path="/proyectos/nuevo" element={<ProyectoFormPage />} />
        <Route path="/proyectos/:id" element={<ProyectoFormPage />} />
        <Route path="/experiencia" element={<ExperienciasListPage />} />
        <Route path="/experiencia/nuevo" element={<ExperienciaFormPage />} />
        <Route path="/experiencia/:id" element={<ExperienciaFormPage />} />
        <Route path="/blog" element={<PostsListPage />} />
        <Route path="/blog/nuevo" element={<PostFormPage />} />
        <Route path="/blog/:id" element={<PostFormPage />} />
        <Route path="/servicios" element={<ServiciosListPage />} />
        <Route path="/servicios/nuevo" element={<ServicioFormPage />} />
        <Route path="/servicios/:id" element={<ServicioFormPage />} />
        <Route path="/certificaciones" element={<CertificacionesListPage />} />
        <Route path="/certificaciones/nuevo" element={<CertificacionFormPage />} />
        <Route path="/certificaciones/:id" element={<CertificacionFormPage />} />
        <Route path="/educacion" element={<EducacionesListPage />} />
        <Route path="/educacion/nuevo" element={<EducacionFormPage />} />
        <Route path="/educacion/:id" element={<EducacionFormPage />} />
        <Route path="/perfil" element={<PerfilPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
