import Sidebar from "../components/Sidebar";
import { Navigate, Outlet } from "react-router-dom";

export default function MainLayout({ children }) {
    const token = localStorage.getItem('auth_token');
    const isAuthenticated = token && token.length > 5;

    if(!isAuthenticated)
    {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="layout-container">
            <Sidebar />
            
            <div className="content-area">
                <Outlet />
            </div>
        </div>
    );
}