import { Link, useNavigate } from "react-router-dom";
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
        <div className="page-wrapper py-4">
            <div className="container-fluid">
                <div className = "card shadow-lg rounded-4 content-card p-4">
                    <h2 className = "page-title">Daftar Peminjaman</h2>

                    <button className="btn btn-primary-tambah" onClick={() => navigate("/pustakawan/peminjaman/create")}>
                        Tambah Peminjaman
                    </button>

                    <div className="row mt-4">
                        {allPeminjaman.map((item) => (
                            <div key={item.id_peminjaman} className="col-12 col-sm-6 col-lg-4 mb-4">
                                <div className="card shadow-sm h-100 rounded-4 border-1 p-3">
                                    <h5 className="fw-bold mb-2">{item.user ? item.user.nama : "-"}</h5>

                                    <div className="text-muted small mb-1">
                                        ID: {item.id_peminjaman}
                                    </div>

                                    <div className="text-muted small mb-1">
                                        Tanggal Peminjaman: {item.tanggal_peminjaman}
                                    </div>

                                    <div className="text-muted small mb-1">
                                        Tanggal Pengembalian: {item.tanggal_pengembalian}
                                    </div>

                                    <div className="d-flex gap-2 mt-auto">
                                            <Link 
                                                to={`/pustakawan/peminjaman/edit/${item.id_peminjaman}`} 
                                                className="btn btn-primary-edit w-50"
                                            >
                                                EDIT
                                            </Link>

                                            <button 
                                                onClick={() => handleDelete(item.id_peminjaman)} 
                                                className="btn btn-primary-danger w-50"
                                            >
                                                HAPUS
                                            </button>
                                        </div>

                                </div>
                            </div>
                            
                        ))}

                        {allPeminjaman.length == 0 && (
                            <div className="col-12 text-center text-muted py-5">
                                Tidak ada data Peminjam
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
