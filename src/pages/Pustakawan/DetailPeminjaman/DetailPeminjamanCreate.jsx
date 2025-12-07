import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = 'http://localhost:8000/api';

export default function DetailPeminjamanCreate() {
    const navigate = useNavigate();
    const [allBuku, setAllBuku] = useState([]);
    const [allPeminjaman, setAllPeminjaman] = useState([]);
    const [targetPeminjaman, setTargetPeminjaman] = useState(null);
    const [dendaAkhir, setDendaAkhir] = useState(0);
    const [statusAkhir, setStatusAkhir] = useState("-");

    const [formData, setFormData] = useState({
        id_peminjaman: '',
        id_buku: '',
        jumlah: 0,
        status: '-',
        denda: 0,
    });

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
                denda: totalDenda, 
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

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

        if (name === 'jumlah' && targetPeminjaman) {
            const details = calculateDendaStatus(targetPeminjaman, value);
            setDendaAkhir(details.denda);
            setStatusAkhir(details.status);
        }
    };

    const handleChangePeminjaman = (e) => {
        const id = e.target.value;
        const peminjaman = allPeminjaman.find(p => p.id_peminjaman == id);
        
        setTargetPeminjaman(peminjaman);
        
        setFormData({
            ...formData,
            id_peminjaman: id,
        });

        if (peminjaman) {
            const dendaStatus = calculateDendaStatus(peminjaman, formData.jumlah || 1);
            setDendaAkhir(dendaStatus.denda);
            setStatusAkhir(dendaStatus.status);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${API_BASE_URL}/detailPeminjaman/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("auth_token"),
                },
                
                body: JSON.stringify({
                    ...formData,
                    denda: dendaAkhir,
                    status: statusAkhir
                }),
            });

            if (!response.ok) {
                throw new Error('Gagal menambahkan detail peminjaman');
            }

            alert("Detail Peminjaman berhasil ditambahkan.");
            navigate("/pustakawan/detailPeminjaman");
        } catch (error) {
            console.error("Error:", error);
            alert("Gagal menambahkan detail peminjaman. " + error.message);
        }
    };

    useEffect(() => {
        const fetchPeminjaman = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/peminjaman`, {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("auth_token"),
                    },
                });

                if (!response.ok) {
                    throw new Error('Gagal mendapatkan data peminjaman');
                }

                const data = await response.json();
                setAllPeminjaman(data);
            } catch (err) {
                console.error("Gagal mendapatkan data peminjaman:", err);
            }
        };

        fetchPeminjaman();
    }, []);

    useEffect(() => {
        const fetchBuku = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/buku`, {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("auth_token"),
                    },
                });

                if (!response.ok) {
                    throw new Error('Gagal mendapatkan data buku');
                }

                const data = await response.json();
                setAllBuku(data);
            } catch (err) {
                console.error("Gagal mendapatkan data buku:", err);
            }
        };

        fetchBuku();
    }, []);

    return (
        <div className="content-area py-4">
            <div className="container-fluid">
                <div className="card shadow-lg rounded-4 content-card p-4">
                    <h2 className="page-title">Tambah Peminjaman</h2>

                    <form onSubmit={handleSubmit} className="mt-3">
                        <div className="mb-3">
                            <label className="form-label">Pilih Peminjaman</label>
                            <select
                                name="id_peminjaman"
                                className="form-control"
                                value={formData.id_peminjaman}
                                onChange={handleChangePeminjaman}
                                required>
                                <option value="">-- Pilih Peminjaman --</option>
                                {allPeminjaman.map((peminjaman) => (
                                    <option key={peminjaman.id_peminjaman} value={peminjaman.id_peminjaman}>
                                        {peminjaman.user?.nama || '-'} - 
                                        Pinjam: {new Date(peminjaman.tanggal_peminjaman).toLocaleDateString()} - 
                                        Batas Kembali: {new Date(peminjaman.tanggal_pengembalian).toLocaleDateString()}
                                    </option>
                                ))}
                            </select>
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
                                <span className="input-group-text">Rp</span>
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
}