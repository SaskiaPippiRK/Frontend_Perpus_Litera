import { useNavigate } from "react-router-dom";
<<<<<<< Updated upstream
import { useState, useEffect } from "react";
import axios from 'axios';
=======
import axios from "axios";
>>>>>>> Stashed changes

const API_BASE_URL = 'http://localhost:8000/api';

export default function DetailPeminjamanIndex() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [allDetailPeminjaman, setAllDetailPeminjaman] = useState([]);

    const fetchDetailPeminjaman = async () => {
        try  {
            const response = await axios.get(`${API_BASE_URL}/detailPeminjaman`);
            setAllDetailPeminjaman(response.data);
            setLoading(false);
        } catch(err)  {
            setError("Gagal memuat detail data Peminjaman dari API Laravel.");
            setLoading(false);
        }
    };

    const handleDelete = async(id) => {
<<<<<<< Updated upstream
        if(window.confirm("Apakah Anda yakin ingin menghapus detail data peminjaman ini?")) {
            try {
                await axios.delete(`${API_BASE_URL}/detailPeminjaman/delete/${id}`);
                alert("Detail peminjaman berhasil dihapus!");

                fetchDetailPeminjaman();
            } catch(err) {
                console.error("Gagal menghapus detail data peminjaman: ", err);
                alert("Gagal menghapus detail data peminjaman. Cek console untuk detail");
=======
        if(window.confirm("Apakah Anda yakin ingin menghapus data peminjaman ini?")) {
            try {
                await axios.delete(`${API_BASE_URL}/detailPeminjaman/delete/${id}`);
                alert("Detail Peminjaman berhasil dihapus!");

                fetchDetailPeminjaman();
            } catch(err) {
                console.error("Gagal menghapus detail peminjaman: ", err);
                alert("Gagal menghapus detail peminjaman. Cek console untuk detail");
>>>>>>> Stashed changes
            }
        }
    };

    if(loading) return <div className="p-4 text-center">Memuat data...</div>;
    if(error) return <div className="p-4 alert alert-danger">{error}</div>;

    useEffect(() => {
<<<<<<< Updated upstream
        const fetchDetailPeminjaman = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/detailPeminjaman`, {
=======
        const fetchPeminjaman = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/peminjaman`, {
>>>>>>> Stashed changes
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("token")
                    }
                });

                const data = await response.json();
<<<<<<< Updated upstream
                setAllDetailPeminjaman(data);
=======
                setAllPeminjaman(data);
>>>>>>> Stashed changes
            } catch (error) {
                console.error(error);
            }
        };

<<<<<<< Updated upstream
        fetchDetailPeminjaman();
=======
        fetchPeminjaman();
>>>>>>> Stashed changes
    }, []);

    return (
        <div className="content-area py-4">
            <div className="container-fluid">
                <div className = "card shadow-lg rounded-4 content-card p-4">
                    <h2 className = "page-title">Detail Peminjaman</h2>

                    <button className="btn btn-primary-tambah" onClick={() => navigate("/detailPeminjaman/create")}>
                        Tambah Peminjaman
                    </button>

                    <div className="table-responsive mt-3">
                        <table className="table-border">
                            <thead className="table-primary">
                                <tr>
                                    <th className="text-center">ID</th>
                                    <th className="text-center">Nama Peminjam</th>
<<<<<<< Updated upstream
                                    <th className="text-center">Buku</th>
                                    <th className="text-center">Status</th>
                                    <th className="text-center">Jumlah</th>
=======
                                    <th className="text-center">Judul Buku</th>
                                    <th className="text-center">Jumlah</th>
                                    <th className="text-center">Status</th>
>>>>>>> Stashed changes
                                    <th className="text-center">Denda</th>
                                    <th className="text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allDetailPeminjaman.map((detailPeminjaman) => (
                                    <tr key={detailPeminjaman.id_detailPeminjaman}>
<<<<<<< Updated upstream
                                        <td className="text-center">{detailPeminjaman.id_detailPeminjaman}</td>
                                        <td className="text-center">{detailPeminjaman.peminjaman.user ? detailPeminjaman.peminjaman.user.nama : "-"}</td>
                                        <td className="text-center">{detailPeminjaman.buku.judul}</td>
                                        <td className="text-center">{detailPeminjaman.status}</td>
                                        <td className="text-center">{detailPeminjaman.jumlah}</td>
                                        <td className="text-center">{detailPeminjaman.denda}</td>

                                        <td className="text-center">
                                            <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
                                                <button className="btn btn-primary-edit" onClick={() => navigate(`/detailPeminjaman/edit/${detailPeminjaman.id_detailPeminjaman}`)}>
=======
                                        <td className="text-center">{detailPeminjaman.detailPeminjaman}</td>
                                        <td className="text-center">{detailPeminjaman.peminjaman.user ? detailPeminjaman.peminjaman.user.nama : "-"}</td>
                                        <td className="text-center">{detailPeminjaman.buku ? detailPeminjaman.buku.judul : "-"}</td>
                                        <td className="text-center">{detailPeminjaman.status}</td>
                                        <td className="text-center">{detailPeminjaman.denda}</td>
                                        
                                        <td className="text-center">
                                            <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
                                                <button className="btn btn-primary-edit" onClick={() => navigate(`/peminjaman/edit/${detailPeminjaman.id_detailPeminjaman}`)}>
>>>>>>> Stashed changes
                                                    EDIT
                                                </button>
                                                <button className="btn btn-primary-danger" onClick={() => handleDelete(detailPeminjaman.id_detailPeminjaman)}>
                                                    HAPUS
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {allDetailPeminjaman.length === 0 && (
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
