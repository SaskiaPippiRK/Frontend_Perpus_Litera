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
        <div className="page-wrapper py-4">
            <div className="container-fluid">
                <div className = "card shadow-lg rounded-4 content-card p-4">
                    <h2 className = "page-title">Buku Tersedia</h2>

                    <button className="btn btn-primary-tambah" onClick={() => navigate("/pustakawan/buku/create")}>
                        Tambah Buku
                    </button>
                    
                    <div className="row mt-4">
                        {buku.map((item) => (
                            <div key={item.id_buku} className="col-12 col-sm-6 col-lg-4 mb-4">
                                <div className="card shadow-sm h-100 rounded-4 border-1 p-3">

                                    <h5 className="fw-bold mb-2">{item.judul}</h5>

                                    <div className="text-muted small mb-1">
                                        Penulis: {item.penulis}
                                    </div>
                                    <div className="text-muted small mb-1">
                                        Penerbit: {item.penerbit}
                                    </div>
                                    <div className="text-muted small mb-1">
                                        Tahun: {item.tahun_terbit}
                                    </div>
                                    <div className="text-muted small mb-1">
                                        Kategori: {item.kategori}
                                    </div>
                                    <div className="text-muted small mb-3">
                                        Lokasi: {item.lokasi_buku}
                                    </div>

                                    <div className="d-flex gap-2 mt-auto">
                                        <Link 
                                            to={`/pustakawan/buku/edit/${item.id_buku}`} 
                                            className="btn btn-primary-edit w-50"
                                        >
                                            EDIT
                                        </Link>

                                        <button 
                                            onClick={() => handleDelete(item.id_buku)} 
                                            className="btn btn-primary-danger w-50"
                                        >
                                            HAPUS
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {buku.length === 0 && (
                            <div className="col-12 text-center text-muted py-5">
                                Tidak ada data buku
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BukuIndex;