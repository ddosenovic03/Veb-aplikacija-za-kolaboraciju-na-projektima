import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { DashboardPage } from "./pages/dashboard/DashboardPage";
import { NotFoundPage } from "./pages/common/NotFoundPage";
import { PlaceholderPage } from "./pages/common/PlaceholderPage";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { PublicOnlyRoute } from "./routes/PublicOnlyRoute";

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
          <Route path="/projekti" element={<PlaceholderPage title="Projekti" description="Lista projekata ce biti implementirana u buducnosti."/>} />
          <Route path="/pozivi" element={<PlaceholderPage title="Pozivi" description="Lista poziva ce biti implementirana u buducnosti."/>} />
          <Route path="/moji-poslovi" element={<PlaceholderPage title="Moji poslovi" description="Lista mojih poslova ce biti implementirana u buducnosti."/>} />
          <Route path="/kreirani-poslovi" element={<PlaceholderPage title="Kreirani poslovi" description="Lista kreiranih poslova ce biti implementirana u buducnosti."/>} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;