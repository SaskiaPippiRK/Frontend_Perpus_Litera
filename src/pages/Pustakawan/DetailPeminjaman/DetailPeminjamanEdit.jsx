import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { useParams, useNavigate, Link } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:8000/api'; 

const DetailPeminjamanEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        id_peminjaman: '',
        id_buku: '',
        jumlah: 1,
        status: 'Dipinjam',
        denda: 0,
    });

    const [targetPeminjaman, setTargetPeminjaman] = useState(null);
    const [allPeminjaman, setAllPeminjaman] = useState([]);
    const [allBuku, setAllBuku] = useState([]);
    const [selectedBuku, setSelectedBuku] = useState(null);
    const [dendaAkhir, setDendaAkhir] = useState(0);
    const [statusAkhir, setStatusAkhir] = useState("-");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("auth_token");
                
                const detailResponse = await axios.get(`${API_BASE_URL}/detailPeminjaman`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                
                const detail = detailResponse.data.find(data => data.id_detail == id);
                
                if (!detail) {
                    setError("Detail peminjaman tidak ditemukan");
                    setLoading(false);
                    return;
                }
                
                setFormData({
                    id_peminjaman: detail.id_peminjaman || "",
                    id_buku: detail.id_buku || "",
                    jumlah: detail.jumlah || 0,
                    status: detail.status || '-',
                    denda: detail.denda || 0,
                });

                const peminjamanResponse = await axios.get(`${API_BASE_URL}/peminjaman`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                setAllPeminjaman(peminjamanResponse.data);

                const bukuResponse = await axios.get(`${API_BASE_URL}/buku`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                setAllBuku(bukuResponse.data);

                const peminjaman = peminjamanResponse.data.find(peminjaman => peminjaman.id_peminjaman == detail.id_peminjaman);
                setTargetPeminjaman(peminjaman);

                const buku = bukuResponse.data.find(buku => buku.id_buku == detail.id_buku);
                setSelectedBuku(buku);

                if (peminjaman) {
                    const { denda, status } = calculateDendaStatus(peminjaman, detail.jumlah);
                    setDendaAkhir(denda);
                    setStatusAkhir(status);
                }

                setLoading(false);
            } catch(err) {
                console.error("Gagal memuat data Detail Peminjaman: ", err);
                setError("Gagal memuat data detail peminjaman.");
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    useEffect(() => {
        if (targetPeminjaman) {
            const { denda, status } = calculateDendaStatus(targetPeminjaman, formData.jumlah);
            setDendaAkhir(denda);
            setStatusAkhir(status);
        }
    }, [targetPeminjaman, formData.jumlah]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const newValue = name === 'jumlah' || name === 'denda' ? parseInt(value) : value;
        
        setFormData(prevData => ({ 
            ...prevData, 
            [name]: newValue 
        }));
        
        if (name === 'jumlah' && targetPeminjaman) {
            const { denda, status } = calculateDendaStatus(targetPeminjaman, newValue);
            setDendaAkhir(denda);
            setStatusAkhir(status);
        }
    };

    const handleChangePeminjaman = (e) => {
        const value = e.target.value;
        setFormData(prevData => ({ ...prevData, id_peminjaman: value }));
        
        const peminjaman = allPeminjaman.find(p => p.id_peminjaman == value);
        setTargetPeminjaman(peminjaman);
        
        if (peminjaman) {
            const { denda, status } = calculateDendaStatus(peminjaman, formData.jumlah);
            setDendaAkhir(denda);
            setStatusAkhir(status);
        }
    };

    const handleChangeBuku = (e) => {
        const value = e.target.value;
        setFormData(prevData => ({ ...prevData, id_buku: value }));
        
        const buku = allBuku.find(b => b.id_buku == value);
        setSelectedBuku(buku);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const token = localStorage.getItem("auth_token");
            
            const updateData = {
                ...formData,
                jumlah: parseInt(formData.jumlah),
                denda: parseInt(formData.denda)
            };

            await axios.post(
                `${API_BASE_URL}/detailPeminjaman/update/${id}`,
                updateData,
                { 
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    } 
                }
            );

            alert("Detail peminjaman berhasil diperbarui!");
            navigate('/pustakawan/detailPeminjaman');
        } catch(err) {
            console.error("Gagal memperbarui detail peminjaman: ", err);
            setError(err.response?.data?.message || "Gagal memperbarui detail peminjaman.");
        }
    };

    const calculateDendaStatus = (dataPeminjaman, jumlah) => {
        if (!dataPeminjaman) return { denda: 0, status: "-", tanggal_batas: new Date()};
        const max_peminjaman = 7;
        const tanggal_peminjaman = new Date(dataPeminjaman.tanggal_peminjaman);
        const tanggal_pengembalian = new Date(dataPeminjaman.tanggal_pengembalian);
        
        const tanggal_batas_pengembalian = new Date(tanggal_peminjaman);
        tanggal_batas_pengembalian.setDate(tanggal_batas_pengembalian.getDate() + max_peminjaman);
        
        if (jumlah === 0) return { denda: 0, status: "-", tanggal_batas: tanggal_batas_pengembalian};
        
        const denda_awal = 500;
        const hari_keterlambatan = Math.max(0, Math.floor((tanggal_pengembalian - tanggal_batas_pengembalian) / (1000 * 60 * 60 * 24)));
        const totalDenda = hari_keterlambatan * denda_awal * jumlah;
        
        if(totalDenda > 0) {
            return { 
                denda: totalDenda || 0, 
                status: "Terlambat",
                tanggal_batas: tanggal_batas_pengembalian,
            };
        } else {
            return { 
                denda: 0, 
                status: "Dipinjam",
                tanggal_batas: tanggal_batas_pengembalian,
            };
        }
    };

    const dendaInfo = calculateDendaStatus(targetPeminjaman);

    if (loading) return <div className="p-4 text-center">Memuat data detail peminjaman...</div>;
    if (error) return <div className="p-4 alert alert-danger">{error}</div>;

    return (
        <div className="content-area py-4">
            <div className="container-fluid">
                <div className="card shadow-lg rounded-4 content-card p-4">
                    <h2 className="page-title">Edit Detail Peminjaman</h2>

                    <form onSubmit={handleSubmit} className="mt-3">
                        <div className="mb-3">
                            <label className="form-label">ID Peminjam</label>
                            <input 
                                type="text"
                                name="id_peminjaman"
                                className="form-control"
                                value={formData.id_peminjaman}
                                onChange={handleChangePeminjaman}
                                required
                                readOnly
                            >  </input>
                        </div>

                        {targetPeminjaman && (
                            <div className="alert alert-info mb-3">
                                <strong>Data:</strong><br />
                                Peminjam: {targetPeminjaman.user?.nama || '-'}<br />
                                Tanggal Pinjam: {new Date(targetPeminjaman.tanggal_peminjaman).toLocaleDateString()}<br />
                                Tanggal Pengembalian: {new Date(targetPeminjaman.tanggal_pengembalian).toLocaleDateString()}<br />
                                Batas Pengembalian: {new Date(calculateDendaStatus(targetPeminjaman, formData.jumlah).tanggal_batas).toLocaleDateString()}<br />
                                <strong>Status: {calculateDendaStatus(targetPeminjaman, formData.jumlah).status}</strong>
                            </div>
                        )}

                        <div className="mb-3">
                            <label className="form-label">Buku yang dipinjam</label>
                            <select
                                name="id_buku"
                                className="form-control"
                                value={formData.id_buku}
                                onChange={handleChangeBuku}
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
                            <label className="form-label">Jumlah Buku</label>
                            <input 
                                type="number"
                                name="jumlah" 
                                className="form-control"
                                value={formData.jumlah}
                                onChange={handleChange}
                                min="1"
                                required 
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Denda</label>
                            <div className="input-group">
                                <input 
                                    type="text" 
                                    className="form-control"
                                    value={dendaAkhir.toLocaleString('id-ID')}
                                    readOnly
                                />
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Status</label>
                            <div className={`alert alert-success`}>
                                <strong>{statusAkhir}</strong>
                            </div>
                        </div>

                        <div className="d-flex gap-2">
                            <button type="submit" className="btn btn-primary-tambah">
                                Simpan
                            </button>
                            <button type="button" className="btn btn-secondary" onClick={() => navigate("/detailPeminjaman")}>
                                Batal
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default DetailPeminjamanEdit;