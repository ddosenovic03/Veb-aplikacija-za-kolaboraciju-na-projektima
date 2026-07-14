import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

export const AppLayout = () => {

    return (
        <div className="app-shell">
            <Sidebar />
            <main className="main-area">
                <Header />
                <div className="page-content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};