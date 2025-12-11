import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = 'http://localhost:8000/api';

export default function DetailPeminjamanIndex() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [allDetailPeminjaman, setAllDetailPeminjaman] = useState([]);
    const [idPeminjaman, setIdPeminjaman] = useState("");

    const fetchDetailPeminjaman = async () => {
        try  {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem("auth_token");
            const response = await axios.get(`${API_BASE_URL}/detailPeminjaman/peminjaman/${idPeminjaman}`, {
                headers : {
                    "Authorization": `Bearer ${token}`
                }
            });

            setAllDetailPeminjaman(response.data);
        } catch(err)  {
            console.error(err);

            if(err.response?.status === 404) {

                setAllDetailPeminjaman([]);
                setError("Detail Peminjaman tidak ditemukan");
            } else if(err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError("Gagal memuat detail data Peminjaman dari API Laravel.");
            }

             if (err.response?.status !== 200) {
                 setAllDetailPeminjaman([]);
             }
        } finally{
            setLoading(false);
        }
    };


    const handleDelete = async(id) => {
        const token = localStorage.getItem("auth_token");
        if(window.confirm("Apakah Anda yakin ingin menghapus data peminjaman ini?")) {
            try {
                await axios.delete(`${API_BASE_URL}/detailPeminjaman/delete/${id}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                alert("Detail Peminjaman berhasil dihapus!");

                fetchDetailPeminjaman();
            } catch(err) {
                console.error("Gagal menghapus detail peminjaman: ", err);
                alert("Gagal menghapus detail peminjaman. Cek console untuk detail");
            }
        }
    };
    useEffect(() => {
        if (!idPeminjaman) {
            setLoading(false);
            setAllDetailPeminjaman([]);
            return;
        }
    }, []); 
    
    if(loading) return <div className="p-4 text-center">Memuat data...</div>;

    return (
        <div className="page-wrappers py-4">
            <div className="container-fluid">
                <div className = "card shadow-lg rounded-4 content-card p-4">
                    <h2 className = "page-title">Detail Peminjaman</h2>

                    <div className="d-flex gap-2 mb-3 flex-column">
                        <div className="d-flex gap-2 flex-row align-items-center">
                            <input type="text" className="form-control" placeholder="Masukkan ID Peminjaman" value={idPeminjaman} onChange={(e) => setIdPeminjaman(e.target.value)} />
                            <button className="btn btn-secondary" onClick={fetchDetailPeminjaman}>Cari</button>
                            {error && <div className="alert alert-danger mt-4">{error}</div>}
                        </div>
                        
                        <button className="btn btn-primary-tambah" onClick={() => navigate("/pustakawan/detailPeminjaman/create")}>
                            Tambah Peminjaman
                        </button>
                    </div>

                    <div className="row mt-4">
                        {allDetailPeminjaman.map((item) => (
                            <div key={item.id_detail} className="col-12 col-sm-6 col-lg-4 mb-4">
                                <div className="card shadow-sm h-100 rounded-4 border-1 p-3">
                                    <h5 className="fw-bold mb-2 text-truncate" title={item.peminjaman?.user?.nama}>
                                        {item.peminjaman?.user?.nama ?? "-"}
                                    </h5>
                                    
                                    <div className="text-muted small mb-1">
                                        ID: {item.id_detail}
                                    </div>

                                    <div className="text-muted small mb-1 text-truncate" title={item.buku ? item.buku.judul : ""}>
                                        Judul: {item.buku ? item.buku?.judul: "-"}
                                    </div>

                                    <div className="text-muted small mb-1">
                                        Status: {item.status}
                                    </div>

                                    <div className="text-muted small mb-1">
                                        Jumlah: {item.jumlah}
                                    </div>

                                    <div className="text-muted small mb-1">
                                        Denda: Rp {item.denda},00
                                    </div>

                                    {error && <div className="alert alert-danger">{error}</div>}

                                    <div className="d-flex gap-2 mt-auto pt-3">
                                        <Link 
                                            to={`/pustakawan/detailPeminjaman/edit/${item.id_detail}`} 
                                            className="btn btn-primary-edit flex-fill text-center"
                                        >
                                            EDIT
                                        </Link>

                                        <button 
                                            onClick={() => handleDelete(item.id_detail)} 
                                            className="btn btn-primary-danger flex-fill"
                                        >
                                            HAPUS
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {allDetailPeminjaman.length == 0 && (
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