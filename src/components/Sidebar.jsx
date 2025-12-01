import { Link, useLocation } from "react-router-dom";
import logo from "../assets/img/LogoLitera.png";
import iconBukuNormal from "../assets/img/iconBukuSaya/TambahBuku_Normal.png";
import iconBukuSelected from "../assets/img/iconBukuSaya/TambahBuku_Selected.png";

import iconPeminjamanNormal from "../assets/img/iconBukuSaya/Peminjaman_Normal.png";
import iconPeminjamanSelected from "../assets/img/iconBukuSaya/Peminjaman_Selected.png";

import iconDetailNormal from "../assets/img/iconBukuSaya/DetailPeminjaman_Normal.png";
import iconDetailSelected from "../assets/img/iconBukuSaya/DetailPeminjaman_Selected.png";

export default function Sidebar() {
    const location = useLocation();
    const role = localStorage.getItem("role");

    const menuPustakawan = [
        {
            path: "/pustakawan/buku",
            label: "Kelola Buku",
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
        }
    ];

    const menuAnggota = [
        {
            path: "/anggota/buku",
            label: "Daftar Buku",
            normal: iconBukuNormal,
            active: iconBukuSelected,
        }
    ];

    const menu = role === "pustakawan" ? menuPustakawan : menuAnggota;

    return (
        <div className="sidebar">
            <img src={logo} alt="Litera Logo" className="logo-img" />

            {menu.map((item) => {
                const active = location.pathname.startsWith(item.path);

                return (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`menu-item ${active ? "active" : ""}`}>

                        <div className="icon-box">
                            <img
                                src={active ? item.active : item.normal}
                                className="icon-img"
                            />
                        </div>
                        <span className="btn-text">{item.label}</span>
                    </Link>
                );
            })}
        </div>
    );
}
