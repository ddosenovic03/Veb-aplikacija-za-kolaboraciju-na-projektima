import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const PublicOnlyRoute = () => {

    const { jePrijavljen } =  useAuth();

    if (jePrijavljen) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};