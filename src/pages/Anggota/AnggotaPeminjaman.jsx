import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = 'http://localhost:8000/api';

export default function AnggotaPeminjaman() {
    const [myBooks, setMyBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchMyBooks();
    }, []);

    const fetchMyBooks = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("auth_token");
            const response = await axios.get(`${API_BASE_URL}/detailPeminjaman/my-books`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            setMyBooks(response.data);
            setLoading(false);
        } catch (err) {
            console.error("Gagal ambil data:", err);
            setError("Gagal memuat daftar buku pinjaman Anda.");
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="card shadow-sm rounded-4 border-0">
                <div className="card-body p-4">
                    <h3 className="mb-4 fw-bold">Buku yang Kamu Pinjam</h3>
                    {loading && <div className="text-center py-4">Sedang memuat data...</div>}
                    {error && <div className="alert alert-danger">{error}</div>}
                    {!loading && !error && (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th className="py-3">No</th>
                                        <th className="py-3">Judul Buku</th>
                                        <th className="py-3">Penulis</th>
                                        <th className="py-3">Tanggal Pinjam</th>
                                        <th className="py-3">Status</th>
                                        <th className="py-3">Denda</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {myBooks.length > 0 ? (
                                        myBooks.map((item, index) => (
                                            <tr key={item.id_detail}>
                                                <td>{index + 1}</td>

                                                <td className="fw-bold text-primary">
                                                    {item.buku ? item.buku.judul : <span className="text-danger">Buku Dihapus</span>}
                                                </td>

                                                <td>
                                                    {item.buku ? item.buku.penulis : "-"}
                                                </td>

                                                <td className="text-center">
                                                    {item.peminjaman?.tanggal_peminjaman || "-"}
                                                </td>

                                                <td>
                                                    <span className={`badge ${item.status === 'Dipinjam' ? 'bg-warning text-dark' : 'bg-success'} px-3 py-2 rounded-pill`}>
                                                        {item.status}
                                                    </span>
                                                </td>

                                                <td className="fw-bold text-danger">
                                                    Rp {parseFloat(item.denda).toLocaleString('id-ID')}
                                                </td>

                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="text-center py-5 text-muted">
                                                Kamu belum meminjam buku apapun saat ini.
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