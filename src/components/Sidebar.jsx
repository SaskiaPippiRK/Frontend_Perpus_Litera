import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/img/LogoLitera.png";
import iconBukuNormal from "../assets/img/iconBukuSaya/TambahBuku_Normal.png";
import iconBukuSelected from "../assets/img/iconBukuSaya/TambahBuku_Selected.png";
import iconPeminjamanNormal from "../assets/img/iconBukuSaya/Peminjaman_Normal.png";
import iconPeminjamanSelected from "../assets/img/iconBukuSaya/Peminjaman_Selected.png";
import iconDetailNormal from "../assets/img/iconBukuSaya/DetailPeminjaman_Normal.png";
import iconDetailSelected from "../assets/img/iconBukuSaya/DetailPeminjaman_Selected.png";
import iconLaporanNormal from "../assets/img/iconBukuSaya/Laporan_Normal.png";
import iconLaporanSelected from "../assets/img/iconBukuSaya/Laporan_Selected.png";

export default function Sidebar({ collapsed, setCollapsed }) {
    const location = useLocation();
    const navigate = useNavigate();
    const role = localStorage.getItem("role");

    const menuPustakawan = [
        {
            path: "/pustakawan/buku",
            label: "Buku Tersedia",
            normal: iconBukuNormal,
            active: iconBukuSelected,
        },
        {
            path: "/pustakawan/peminjaman",
            label: "Peminjaman",
            normal: iconPeminjamanNormal,
            active: iconPeminjamanSelected,
        },
        {
            path: "/pustakawan/detailPeminjaman",
            label: "Detail",
            normal: iconDetailNormal,
            active: iconDetailSelected,
        },
        {
            path: "/pustakawan/laporan",
            label: "Laporan",
            normal: iconLaporanNormal,
            active: iconLaporanSelected,
        }
    ];

    const menuAnggota = [
        {
            path: "/anggota/buku",
            label: "Daftar Buku",
            normal: iconBukuNormal,
            active: iconBukuSelected,
        },
       
        {
            path: "/anggota/peminjaman", 
            label: "Buku Saya", 
            normal: iconPeminjamanNormal, 
            active: iconPeminjamanSelected,
        }
       
    ];

    const handleLogout = () => {
        localStorage.removeItem("auth_token");
        navigate("/login");
    };

    const menu = role === "pustakawan" ? menuPustakawan : menuAnggota;

    return (
<div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
    <img src={logo} alt="Litera Logo" className= {`sidebar-logo ${collapsed ? "collapsed" : ""}`} />

    <div className="menu-items">
        {menu.map((item) => {
            const active = location.pathname.startsWith(item.path);

            return (
                <Link
                    key={item.path}
                    to={item.path}
                    className={`menu-item ${active ? "active" : ""}`}>

                    <div className="icon-box">
                        <img src={active ? item.active : item.normal} className="icon-img" />
                    </div>

                    {!collapsed && (<span className="btn-text">{item.label}</span>)}                
                </Link>
            );
        })}
        <div className="logout-button">
            <button onClick={handleLogout} className={`btn ${collapsed ? "collapsed" : ""}`}>
                {!collapsed ? "Logout" : "O"}
            </button>
        </div>
    </div>
</div>
    );
}