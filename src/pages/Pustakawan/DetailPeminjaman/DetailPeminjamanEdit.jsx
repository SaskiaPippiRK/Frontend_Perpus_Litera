import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { useParams, useNavigate, Link } from 'react-router-dom';
import { validateDetailPeminjamanEdit } from '../../../js/script';

const API_BASE_URL = 'http://localhost:8000/api'; 

const DetailPeminjamanEdit = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    
    const [allBuku, setAllBuku] = useState([]);
    const [allPeminjaman, setAllPeminjaman] = useState([]);

    const [formData, setFormData] = useState({
        id_detail: '',
        id_peminjaman: '',
        id_buku: '',
        jumlah: '',
        status: '',
        denda: '',
        id_users: '' 
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDetailPeminjamanData = async () => {
            
            try {
                const token = localStorage.getItem("auth_token");

                const resDetail = await axios.get(`${API_BASE_URL}/detailPeminjaman/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const detailData = resDetail.data.data ?? resDetail.data;
                
                const resBuku = await axios.get(`${API_BASE_URL}/buku/${detailData.id_buku}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const bukuData = resBuku.data.data ?? resBuku.data;
                
                const resPinjam = await axios.get(`${API_BASE_URL}/peminjaman/${detailData.id_peminjaman}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const pinjamData = resPinjam.data.data ?? resPinjam.data;

                setFormData({
                    id_detail: detailData.id_detail || "",
                    id_peminjaman: pinjamData.id_peminjaman || "",
                    id_buku: bukuData.id_buku || "",
                    jumlah: detailData.jumlah || "",
                    status: detailData.status || "",
                    denda: detailData.denda || "",
                    id_users: pinjamData.id_users || "" 
                });
                setLoading(false);
            } catch(err) {
                console.error("Gagal memuat data:", err);
                setError("Gagal memuat data detail peminjaman.");
                setLoading(false);
            }
        };
        fetchDetailPeminjamanData();
    }, [id]);

    useEffect(() => {
        const fetchMasterData = async () => {
            const token = localStorage.getItem("auth_token");
            try {
                const resPinjamMaster = await axios.get(`${API_BASE_URL}/peminjaman`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAllPeminjaman(resPinjamMaster.data.data ?? resPinjamMaster.data);

                const resBukuMaster = await axios.get(`${API_BASE_URL}/buku`, {
                    headers: { Authorization: `Bearer ${token}` }
                }); 
                setAllBuku(resBukuMaster.data.data ?? resBukuMaster.data);
            } catch (err) {
                console.error("Gagal memuat data master:", err);
            }
        };
        fetchMasterData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const validationError = validateDetailPeminjamanEdit({
            id_peminjaman: formData.id_peminjaman,
            id_buku: formData.id_buku,
            jumlah: formData.jumlah,
            denda: formData.denda
        });
        
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            await axios.post(
                `${API_BASE_URL}/detailPeminjaman/update/${id}`,
                formData,
                { headers: { "Content-Type": "application/json" } }
            );

            alert("Detail Data peminjaman berhasil diperbarui!");
            navigate('/pustakawan/detailPeminjaman');
        } catch(err) {
            console.error("Gagal update:", err);
            setError("Gagal memperbarui peminjaman. Cek koneksi.");
        }
    };

    if (loading) return <div className="p-4 text-center">Memuat data...</div>;

    return (
        <div className="page-wrappers py-4">
            <div className="container-fluid">
                <div className="card shadow-lg rounded-4 content-card p-4">
                    <h2 className="page-title">Update Detail Peminjaman</h2>

                    <form onSubmit={handleSubmit} className="mt-3">
                        <div className="input-group">
                            <label className="form-label">ID Peminjaman (User)</label>
                            <select
                                name="id_peminjaman"
                                className="form-control"
                                value={formData.id_peminjaman}
                                disabled>
                                <option value="">-- Pilih Peminjaman --</option>
                                {allPeminjaman.map((peminjam) => (
                                    <option key={peminjam.id_peminjaman} value={peminjam.id_peminjaman}>
                                        ID: {peminjam.id_peminjaman} - {peminjam.user?.nama || "User"}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="input-group">
                            <label className="form-label">Buku yang dipinjam</label>
                            <select
                                name="id_buku"
                                className="form-control"
                                value={formData.id_buku}
                                onChange={handleChange}
                                >
                                <option value="">-- Pilih Buku --</option>
                                {allBuku.map((buku) => (
                                    <option key={buku.id_buku} value={buku.id_buku}>
                                        {buku.judul}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="input-group">
                            <label className="form-label">Jumlah Peminjaman</label>
                            <input 
                                type="number"
                                name="jumlah" 
                                className="form-control"
                                value={formData.jumlah}
                                onChange={handleChange}
                                 
                            />
                        </div>

                        <div className="input-group">
                            <label className="form-label">Status</label>
                            <select 
                                name="status"
                                className="form-control"
                                value={formData.status}
                                onChange={handleChange}
                                
                            >
                                <option value="Dipinjam">Dipinjam</option>
                                <option value="Kembali">Kembali</option>
                            </select>
                        </div>

                        <div className="input-group">
                            <label className="form-label">Denda</label>
                            <input 
                                type="number" 
                                name="denda" 
                                className="form-control"
                                value={formData.denda}
                                onChange={handleChange}
                            />
                        </div>

                        {error && <div className="alert alert-danger">{error}</div>}

                        <div className="button-group">
                            <button type="submit" className="btn btn-primary-tambah">
                                Simpan
                            </button>
                        
                            <Link to={`/pustakawan/detailPeminjaman/`} className="btn btn-secondary">
                                BATAL
                            </Link>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    )
}

export default DetailPeminjamanEdit;