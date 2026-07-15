import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { DashboardPage } from "./pages/dashboard/DashboardPage";
import { NotFoundPage } from "./pages/common/NotFoundPage";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { PublicOnlyRoute } from "./routes/PublicOnlyRoute";
import { ProjektiPage } from "./pages/projekti/ProjektiPage";
import { KreiranjeProjektaPage } from "./pages/projekti/KreiranjeProjektaPage";
import { ProjekatDetaljiPage } from "./pages/projekti/ProjekatDetaljiPage";
import { IzmjenaProjektaPage } from "./pages/projekti/IzmjenaProjektaPage";
import { PoziviPage } from "./pages/pozivi/PoziviPage";
import { KreiranjePoslaPage } from "./pages/poslovi/KreiranjePoslaPage";
import { PosaoDetaljiPage } from "./pages/poslovi/PosaoDetaljiPage";
import { IzmjenaPoslaPage } from "./pages/poslovi/IzmjenaPoslaPage";
import { MojiPosloviPage } from "./pages/poslovi/MojiPosloviPage";
import { KreiraniPosloviPage } from "./pages/poslovi/KreiraniPosloviPage";

function App() {

  return ( 
    <Routes>
      <Route element={<PublicOnlyRoute />} >
        <Route path="/login" element={<LoginPage />} />
        <Route path="registracija" element={<RegisterPage />} />
      </Route>

      <Route element={<ProtectedRoute />} >
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          
          <Route path="/projekti" element={<ProjektiPage />} />
          <Route path="/projekti/novi" element={<KreiranjeProjektaPage />} />
          <Route path="/projekti/:projekatId" element={<ProjekatDetaljiPage />} />
          <Route path="/projekti/:projekatId/izmena" element={<IzmjenaProjektaPage />} />
          <Route path="projekti/:projekatId/poslovi/novi" element={<KreiranjePoslaPage />} />

          <Route path="/pozivi" element={<PoziviPage />} />

          <Route path="/poslovi/:posaoId" element={<PosaoDetaljiPage />} />
          <Route path="/poslovi/:posaoId/izmena" element={<IzmjenaPoslaPage />} />
          <Route path="/moji-poslovi" element={<MojiPosloviPage />} />
          <Route path="/kreirani-poslovi" element={<KreiraniPosloviPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;