import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

export default function MainLayout({ children }) {
    return (
        <div className="layout-container">
            <Sidebar />
            
            <div className="content-area">
                <Outlet />
            </div>
        </div>
    );
}
