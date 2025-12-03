import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const BukuIndex = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [buku, setBuku] = useState([]);

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

    const handleDelete = async(id) => {
        if(window.confirm("Apakah Anda yakin ingin menghapus buku ini?"))
        {
            try
            {
                await axios.delete(`${API_BASE_URL}/buku/delete/${id}`);
                alert("Buku berhasil dihapus!");

                fetchBuku();
            } catch(err)
            {
                console.error("Gagal menghapus buku: ", err);
                alert("Gagal menghapus buku. Cek console untuk detail");
            }
        }
    };

    if(loading) return <div className="p-4 text-center">Memuat data...</div>;
    if(error) return <div className="p-4 alert alert-danger">{error}</div>;

    return (
        <div className="content-area py-4">
            <div className="container-fluid">
                <div className = "card shadow-lg rounded-4 content-card p-4">
                    <h2 className = "page-title">Buku ANGGOTA</h2>

                    <button className="btn btn-primary-tambah" onClick={() => navigate("/pustakawan/buku/create")}>
                        Tambah Buku
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
                                    <th className="text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {buku.map((buku, index) => (
                                    <tr key={buku.id_buku}>
                                        <td className="text-center">{buku.judul}</td>
                                        <td className="text-center">{buku.penulis}</td>
                                        <td className="text-center">{buku.penerbit}</td>
                                        <td className="text-center">{buku.tahun_terbit}</td>
                                        <td className="text-center">{buku.kategori}</td>
                                        <td className="text-center">{buku.lokasi_buku}</td>
                                        <td className="text-center">
                                            <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", gap: "8px" }}>
                                                <Link to={`/pustakawan/buku/edit/${buku.id_buku}`} className="btn btn-primary-edit">
                                                    <i ></i> EDIT
                                                </Link>

                                                <button onClick={() => handleDelete(buku.id_buku)} className="btn btn-primary-danger">
                                                        <i></i> HAPUS
                                                    </button>
                                        
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {buku.length === 0 && (
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

export default BukuIndex;