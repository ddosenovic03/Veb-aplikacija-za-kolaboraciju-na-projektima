import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const ProtectedRoute = () => {

    const { jePrijavljen } = useAuth();
    const location = useLocation();

    if (!jePrijavljen) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return <Outlet />;
};