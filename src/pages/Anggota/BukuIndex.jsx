import { useState, useEffect } from "react";
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

export default function BukuIndexAnggota() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [allBuku, setBuku] = useState([]);

    const fetchBuku = async () => {
        try 
        {
            const response = await axios.get(`${API_BASE_URL}/buku`);
            setBuku(response.data);
            setLoading(false);
        } catch(err) 
        {
            setError("Gagal memuat data Buku dari API Laravel.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBuku();
    }, []);

    if (loading) return <div className="p-4 text-center">Memuat data buku...</div>;
    if (error) return <div className="p-4 alert alert-danger">{error}</div>;

    return (
        <div className="content-area py-4">
            <div className="container-fluid">
                <div className = "card shadow-lg rounded-4 content-card p-4">
                    <h2 className = "page-title">Buku yang tersedia</h2>

                    <button className="btn btn-primary-tambah" onClick={() => fetchBuku()}>
                        Refresh
                    </button>

                    <div className="table-responsive mt-3">
                        <table className="table-border">
                            <thead className="table-primary">
                                <tr>
                                    <th className="text-center">Judul Buku</th>
                                    <th className="text-center">Penulis</th>
                                    <th className="text-center">Penerbit</th>
                                    <th className="text-center">Tahun Terbit</th>
                                    <th className="text-center">Kategori</th>
                                    <th className="text-center">Lokasi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allBuku.map((buku) => (
                                    <tr key={buku.id_buku}>
                                        <td className="text-center">{buku.judul}</td>
                                        <td className="text-center">{buku.penulis}</td>
                                        <td className="text-center">{buku.penerbit}</td>
                                        <td className="text-center">{buku.tahun_terbit}</td>
                                        <td className="text-center">{buku.kategori}</td>
                                        <td className="text-center">{buku.lokasi_buku}</td>
                                    </tr>
                                ))}
                                {allBuku.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="text-center">
                                    Tidak ada data buku
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
