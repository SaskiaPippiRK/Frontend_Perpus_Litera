import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { useParams, useNavigate, Link } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:8000/api'; 

const DetailPeminjamanEdit = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const [allBuku, setAllBuku] = useState([]);
    const [allPeminjaman, setAllPeminjaman] = useState([]);

    const [formData, setFormData] = useState({
        id_detailPeminjaman: '',
        id_peminjaman: '',
        id_buku: '',
        jumlah: '',
        status: '',
        denda: '',
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDetailPeminjamanData = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/detailPeminjaman/${id}`);
                const detailPeminjaman = response.data.data ?? response.data;
                
                response = await axios.get(`${API_BASE_URL}/buku/${detailPeminjaman.id_buku}`);
                const buku = response.data.data ?? response.data;
                response = await axios.get(`${API_BASE_URL}/peminjaman/${detailPeminjaman.id_peminjaman}`);
                const peminjaman = response.data.data ?? response.data;

                setFormData({
                    id_detailPeminjaman: detailPeminjaman.id_detailPeminjaman || "",
                    id_peminjaman: peminjaman.id_peminjaman || "",
                    id_buku: buku.id_buku || "",
                    jumlah: detailPeminjaman.jumlah || "",
                    status: detailPeminjaman.status || "",
                    denda: detailPeminjaman.denda || "",
                });
                setLoading(false);
            } catch(err)
            {
                console.error("Gagal memuat data detail Peminjaman: ", err);
                setError("Gagal memuat data peminjaman. Pastikan ID Detail Peminjaman benar dan API berfungsi.");
                setLoading(false);
            }
        };
        fetchDetailPeminjamanData();
    }, [id]);

    useEffect(() => {
        const fetchDatas = async () => {
            const response = await axios.get(`${API_BASE_URL}/peminjaman`);
            setAllPeminjaman(response.data.data ?? response.data);
            response = await axios.get(`${API_BASE_URL}/buku`);
            setAllBuku(response.data.data ?? response.data);
        };
        fetchDatas();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try{
            await axios.post(
                `${API_BASE_URL}/detailPeminjaman/update/${id}`,
                formData,
                { headers: { "Content-Type": "application/json" } }
            );

            alert("Detail Data peminjaman berhasil diperbarui!");
            navigate('/pustakawan/detailPeminjaman');
        } catch(err) {
            console.error("Gagal memperbarui detail peminjaman: ", err.response ? err.response.data : err.message);
            const serverError = err.response?.data?.message || "Kesalahan koneksi atau validasi";
            setError(`Gagal memperbarui peminjaman: ${serverError}`);
        }
    };

    if (loading) return <div className="p-4 text-center">Memuat data peminjaman...</div>;
    if (error) return <div className="p-4 alert alert-danger">{error}</div>;

    return (
        <div className="content-area py-4">
            <div className="container-fluid">
                <div className="card shadow-lg rounded-4 content-card p-4">
                    <h2 className="page-title">Update Peminjaman</h2>

                    <form onSubmit={handleSubmit} className="mt-3">
                        <div className="mb-3">
                            <label className="form-label">Nama Peminjam</label>
                            <select
                                name="id_users"
                                className="form-control"
                                value={formData.id_users}
                                onChange={handleChange}
                                required>

                                <option value="">-- Pilih Peminjam --</option>
                                {allPeminjaman.map((peminjam) => (
                                    <option key={peminjam.user.id_users} value={peminjam.user.id_users}>
                                        {peminjam.user.nama} - {new Date(peminjam.tanggal_peminjaman).toLocaleDateString()}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Buku yang dipinjam</label>
                            <select
                                name="id_buku"
                                className="form-control"
                                value={formData.id_buku}
                                onChange={handleChange}
                                required>

                                <option value="">-- Pilih Buku --</option>
                                {allBuku.map((buku) => (
                                    <option key={buku.id_buku} value={buku.id_buku}>
                                        {buku.judul}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Jumlah Peminjaman</label>
                            <input 
                                type="number"
                                name="jumlah" 
                                className="form-control"
                                value={formData.jumlah}
                                onChange={handleChange}
                                required 
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Denda</label>
                            <input 
                                type="float" 
                                name="tanggal_pengembalian" 
                                className="form-control"
                                value={formData.tanggal_pengembalian}
                                onChange={handleChange}
                                readOnly
                            />
                        </div>

                        <div className="button-group">
                            <button type="submit" className="btn btn-primary-tambah">
                                Simpan
                            </button>
                        
                            <Link to={`/pustakawan/peminjaman/`} className="btn btn-secondary">
                                <i ></i> BATAL
                            </Link>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    )
}

export default DetailPeminjamanEdit;

