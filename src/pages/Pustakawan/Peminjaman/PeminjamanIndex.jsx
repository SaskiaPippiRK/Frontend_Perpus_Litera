import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

export default function PeminjamanIndex() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [allPeminjaman, setAllPeminjaman] = useState([]);

    const fetchPeminjaman = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("auth_token");
            
            const response = await axios.get(`${API_BASE_URL}/peminjaman`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            
            setAllPeminjaman(response.data);
            setError(null);
        } catch(err) {
            console.error("Error fetching peminjaman:", err);
        if (err.response?.status === 401) {
                setError("Sesi telah berakhir. Silakan login kembali.");
            } else if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError("Gagal memuat data peminjaman. Silakan coba lagi.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPeminjaman();
    }, []);

    const handleDelete = async(id) => {
        if(window.confirm("Apakah Anda yakin ingin menghapus data peminjaman ini?")) {
            try {
                await axios.delete(`${API_BASE_URL}/peminjaman/delete/${id}`);
                alert("Peminjaman berhasil dihapus!");

                fetchPeminjaman();
            } catch(err) {
                console.error("Gagal menghapus peminjaman: ", err);
                alert("Gagal menghapus peminjaman. Cek console untuk detail");
            }
        }
    };

    if(loading) return <div className="p-4 text-center">Memuat data...</div>;
    if(error) return <div className="p-4 alert alert-danger">{error}</div>;

    return (
        <div className="content-area py-4">
            <div className="container-fluid">
                <div className = "card shadow-lg rounded-4 content-card p-4">
                    <h2 className = "page-title">Peminjaman</h2>

                    <button className="btn btn-primary-tambah" onClick={() => navigate("/pustakawan/peminjaman/create")}>
                        Tambah Peminjaman
                    </button>

                    <div className="table-responsive mt-3">
                        <table className="table-border">
                            <thead className="table-primary">
                                <tr>
                                    <th className="text-center">ID</th>
                                    <th className="text-center">Nama Peminjam</th>
                                    <th className="text-center">Tanggal Peminjaman</th>
                                    <th className="text-center">Tanggal Pengembalian</th>
                                    <th className="text-center">Aksi</th>
                                   
                                </tr>
                            </thead>
                            <tbody>
                                {allPeminjaman.map((peminjaman) => (
                                    <tr key={peminjaman.id_peminjaman}>
                                        <td className="text-center">{peminjaman.id_peminjaman}</td>
                                        <td className="text-center">{peminjaman.user ? peminjaman.user.nama : "-"}</td>
                                        <td className="text-center">{peminjaman.tanggal_peminjaman}</td>
                                        <td className="text-center">{peminjaman.tanggal_pengembalian}</td>
                                        
                                        <td className="text-center">
                                            <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
                                                <button className="btn btn-primary-edit" onClick={() => navigate(`/pustakawan/peminjaman/edit/${peminjaman.id_peminjaman}`)}>
                                                    EDIT
                                                </button>
                                                <button className="btn btn-primary-danger" onClick={() => handleDelete(peminjaman.id_peminjaman)}>
                                                    HAPUS
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {allPeminjaman.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-center">
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
