import Sidebar from "../components/Sidebar";
import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

export default function MainLayout({ children }) {
    const token = localStorage.getItem('auth_token');
    const isAuthenticated = token && token.length > 5;
    const [collapsed, setCollapsed] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if(window.innerWidth <= 768)
            {
                setCollapsed(true);
            } else{
                setCollapsed(false);
            }
        };
        handleResize();
        window.addEventListener("resize", handleResize);

        return() => window.removeEventListener("resize", handleResize);
    }, []);

    if(!isAuthenticated)
    {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="layout-container">
            <button className="hamburger-btn" onClick={() => setCollapsed(!collapsed)}>☰</button>
            <Sidebar collapsed={collapsed} />
            
            <div className={`content-area ${collapsed ? "collapsed" : ""}`}>
                <Outlet />
            </div>
        </div>
    );
}