import { useState, useEffect } from "react";
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

export default function AnggotaPeminjaman() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [peminjamanSaya, setPeminjamanSaya] = useState([]);

    const fetchPeminjamanSaya = async () => {
        try {
            const token = localStorage.getItem("auth_token");
            const response = await axios.get(`${API_BASE_URL}/detailPeminjaman/me`, { 
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            setPeminjamanSaya(response.data.data || response.data);
            setLoading(false);
        } catch(err) {
            console.error("Error:", err);
            if (err.response && err.response.status === 404) {
                setPeminjamanSaya([]);
            } else {
                setError("Gagal memuat data. Pastikan Backend berjalan.");
            }
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPeminjamanSaya();
    }, []);

    return (
        <div className="content-area py-4">
            <div className="container-fluid">
                <div className="card shadow-lg rounded-4 content-card p-4">
                    <h2 className="page-title mb-4">Buku yang Kamu Pinjam</h2>
                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className="mt-2">Memuat data peminjaman...</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-bordered table-hover align-middle">
                                <thead className="table-primary text-center">
                                    <tr>
                                        <th>Judul Buku</th>
                                        <th>Penulis</th>
                                        <th>Tanggal Pinjam</th>
                                        <th>Status</th>
                                        <th>Denda</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* --- SLOT KOSONG --- */}
                                    {peminjamanSaya.length > 0 ? (
                                        peminjamanSaya.map((item, index) => (
                                            <tr key={index}>
                                                <td className="fw-bold">{item.buku?.judul || "-"}</td>
                                                <td>{item.buku?.penulis || "-"}</td>
                                                <td className="text-center">{item.peminjaman?.tanggal_pinjam || "-"}</td>
                                                <td className="text-center">
                                                    <span className={`badge ${item.status === 'Kembali' ? 'bg-success' : 'bg-warning text-dark'}`}>
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td className="text-center text-danger">
                                                    {item.denda > 0 ? `Rp ${item.denda}` : '-'}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="text-center py-5 text-muted">
                                                <i className="bi bi-journal-x" style={{ fontSize: '2rem' }}></i>
                                                <p className="mt-2 mb-0">Kamu belum meminjam buku apapun saat ini.</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}