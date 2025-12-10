import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = 'http://localhost:8000/api';

export default function DetailPeminjamanCreate() {
    const navigate = useNavigate();
    const [allBuku, setAllBuku] = useState([]);
    const [allPeminjaman, setAllPeminjaman] = useState([]);

    const [formData, setFormData] = useState({
        id_detailPeminjaman: '',
        id_peminjaman: '',
        id_buku: '',
        jumlah: '',
        status: '',
        denda: '0',
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
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        await fetch(`${API_BASE_URL}/detailPeminjaman/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("auth_token"),
            },
            body: JSON.stringify(formData),
    });

    alert("Peminjaman berhasil ditambahkan.");
    navigate("/detailPeminjaman");
    };

    useEffect(() => {
        const fetchDatas = async () => {
            try {
                const bukuResponse = await fetch(`${API_BASE_URL}/buku`, {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("auth_token"),
                    },
                });

            if (!bukuResponse.ok) {
                throw new Error(`Gagal mendapatkan daftar buku: ${bukuResponse.status}`);
            }

            const daftarBuku = await bukuResponse.json();
            setAllBuku(daftarBuku);
            
            const peminjamanResponse = await fetch(`${API_BASE_URL}/peminjaman`, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("auth_token"),
                },
            });
            
            if (!peminjamanResponse.ok) {
                throw new Error(`Failed to fetch peminjaman: ${peminjamanResponse.status}`);
            }
            
            const daftarPeminjaman = await peminjamanResponse.json();
            setAllPeminjaman(daftarPeminjaman);
            
            } catch (err) {
                console.error("Error fetching data:", err);
                alert("Gagal memuat data: " + err.message);
            }
        };

        fetchDatas();
    }, []);

    return (
        <div className="content-area py-4">
            <div className="container-fluid">
                <div className="card shadow-lg rounded-4 content-card p-4">
                    <h2 className="page-title">Tambah Peminjaman</h2>

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
                                value={calculateDendaStatus.denda}
                                onChange={handleChange}
                                readOnly
                            />
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