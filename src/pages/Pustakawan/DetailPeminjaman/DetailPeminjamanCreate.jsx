import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = 'http://localhost:8000/api';

export default function DetailPeminjamanCreate() {
    const navigate = useNavigate();
    const [allBuku, setAllBuku] = useState([]);
    const [allPeminjaman, setAllPeminjaman] = useState([]);
    const [peminjaman, setPeminjaman] = useState(null);
    const [dendaAkhir, setDendaAkhir] = useState(0);
    const [statusAkhir, setStatusAkhir] = useState("Dipinjam");

    const [formData, setFormData] = useState({
        id_detailPeminjaman: '',
        id_anggota: '',
        id_peminjaman: '',
        id_buku: '',
        jumlah: '',
        status: '',
        denda: 0,
    });

    const calculateDendaStatus = (tanggalPeminjaman, tanggalPengembalian, jumlah) => {
        const denda_awal = 500;
        const max_peminjaman = 7;
        
        const tanggal_peminjaman = new Date(tanggalPeminjaman);
        const tanggal_pengembalian = new Date(tanggalPengembalian);

        const tanggal_batas_pengembalian = new Date(tanggal_peminjaman);
        tanggal_batas_pengembalian.setDate(tanggal_batas_pengembalian.getDate() + max_peminjaman);

        const hari_keterlambatan = Math.max(0, Math.floor((tanggal_pengembalian - tanggal_batas_pengembalian) / (1000 * 60 * 60 * 24)));
        
        const totalDenda = hari_keterlambatan * denda_awal * jumlah;
        
        return totalDenda;
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
                "Authorization": "Bearer " + localStorage.getItem("token"),
            },
            body: JSON.stringify(formData),
    });

    alert("Peminjaman berhasil ditambahkan.");
    navigate("/detailPeminjaman");
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/users`, {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token"),
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }

                const data = await response.json();
                const anggota = data.filter(user => user.role === "anggota");
                setAnggota(anggota);
            } catch (err) {
                console.error("Gagal mendapatkan data peminjam:", err);
            }
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        const fetchPeminjaman = async () => {
            try {
                if (!formData.id_anggota) return;
                
                const response = await fetch(`${API_BASE_URL}/peminjaman`, {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token"),
                    },
                });

                if (!response.ok) {
                    throw new Error('Gagal mendapatkan data peminjam');
                }

                const data = await response.json();
                const filteredData = data.filter(peminjaman => peminjaman.id_users === formData.id_anggota);
                setAllPeminjaman(filteredData);
            } catch (err) {
                console.error("Gagal mendapatkan data peminjam:", err);
            }
        };

        fetchPeminjaman();
    }, [formData.id_anggota]);

    useEffect(() => {
        const fetchBuku = async () => {
            try {
                if (!formData.id_anggota) return;
                if (!formData.id_peminjaman) return;

                // const tanggal_peminjaman_raw = new Date(formData.tanggal_peminjaman);
                // const tanggal_pengembalian_raw = new Date(tanggal_peminjaman_raw);
                // tanggal_pengembalian_raw.setDate(tanggal_pengembalian_raw.getDate() + 7);
                
                // const tanggal_pengembalian_string = tanggal_pengembalian_raw.toISOString().split('T')[0];
                
                // setFormData(prev => ({
                //     ...prev,
                //     tanggal_pengembalian: tanggal_pengembalian_string
                // }));
                
                const response = await fetch(`${API_BASE_URL}/buku`, {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token"),
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
    }, [formData.id_anggota, formData.id_peminjaman]);

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

                        {/* <div className="mb-3">
                            <label className="form-label">Tanggal Peminjaman</label>
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
                        </div> */}

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
                                value={calculateDenda}
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