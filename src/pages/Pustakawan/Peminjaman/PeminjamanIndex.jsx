import { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function PeminjamanIndex() {
    const navigate = useNavigate();
    const [allPeminjaman, setAllPeminjaman] = useState([
    {
        id_peminjaman: 1,
        tanggal_peminjaman: 12-12-2025,
        tanggal_pengembalian: 21-12-2025,
    },
    {
        id_peminjaman: 2,
        tanggal_peminjaman: 13-12-2025,
        tanggal_pengembalian: 19-12-2025,
    },]);

    const handleHapus = (id) => {
        if(window.confirm("Apakah Anda Yakin?")) {
            setAllPeminjaman(allPeminjaman.filter((peminjaman) => peminjaman.id_peminjaman != id));
        }
    };

    return (
        <div className="content-area py-4">
            <div className="container-fluid">
                <div className = "card shadow-lg rounded-4 content-card p-4">
                    <h2 className = "page-title">Peminjaman</h2>

                    <button className="btn btn-primary-tambah" onClick={() => navigate("/peminjaman/create")}>
                        Tambah Peminjaman
                    </button>

                    <div className="table-responsive mt-3">
                        <table className="table-border">
                            <thead className="table-primary">
                                <tr>
                                    <th className="text-center">ID</th>
                                    <th className="text-center">Tanggal Peminjaman</th>
                                    <th className="text-center">Tanggal Pengembalian</th>
                                    <th className="text-center">Aksi</th>
                                   
                                </tr>
                            </thead>
                            <tbody>
                                {allPeminjaman.map((peminjaman) => (
                                    <tr key={peminjaman.id_peminjaman}>
                                        <td className="text-center">{peminjaman.id_peminjaman}</td>
                                        <td className="text-center">{peminjaman.tanggal_peminjaman}</td>
                                        <td className="text-center">{peminjaman.tanggal_pengembalian}</td>
                                        
                                        <td className="text-center">
                                            <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
                                                <button className="btn btn-primary-edit" onClick={() => navigate(`/peminjaman/edit/${peminjaman.id_peminjaman}`)}>
                                                    EDIT
                                                </button>
                                                <button className="btn btn-primary-danger" onClick={() => handleHapus(peminjaman.id_peminjaman)}>
                                                    HAPUS
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {allPeminjaman.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="text-center">
                                    Tidak ada data Peminjaman
                                    </td>
                                </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
