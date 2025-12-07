import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = 'http://localhost:8000/api';

export default function PeminjamanCreate() {
    const navigate = useNavigate();
    const [anggota, setAnggota] = useState([]);
    const [formData, setFormData] = useState({
        id_users: '',
        tanggal_peminjaman: '',
        tanggal_pengembalian: '',
    });
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    
        try {
            const response = await fetch(`${API_BASE_URL}/peminjaman/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("auth_token"),
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error(`Gagal menyimpan: ${response.status}`);
            }

            const result = await response.json();
            console.log("Response:", result);
            
            alert("Peminjaman berhasil ditambahkan.");
            navigate("/pustakawan/peminjaman");
        } catch (error) {
            console.error("Gagal menyimpan data:", error);
            alert("Gagal menambahkan peminjaman. Silakan coba lagi.");
        }
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
                    throw new Error('Gagal mendapatkan data anggota');
                }

                const data = await response.json();
                const anggota = data.filter(user => user.role === "anggota");
                setAnggota(anggota);
            } catch (err) {
                console.error("Gagal mendapatkan data anggota:", err);
            }
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        if (!formData.tanggal_peminjaman) return;
        
        const tanggal_peminjaman_raw = new Date(formData.tanggal_peminjaman);
        const tanggal_pengembalian_raw = new Date(tanggal_peminjaman_raw);
        tanggal_pengembalian_raw.setDate(tanggal_pengembalian_raw.getDate() + 7);
        
        const tanggal_pengembalian_string = tanggal_pengembalian_raw.toISOString().split('T')[0];
        
        setFormData(prev => ({
            ...prev,
            tanggal_pengembalian: tanggal_pengembalian_string
        }));
    }, [formData.tanggal_peminjaman]);

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

                                {anggota.map((user) => (
                                    <option key={user.id_users} value={user.id_users}>
                                        {user.nama}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Tanggal Peminjaman</label>
                            <input 
                                type="date" 
                                name="tanggal_peminjaman" 
                                className="form-control"
                                value={formData.tanggal_peminjaman}
                                onChange={handleChange}
                                required 
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Tanggal Pengembalian</label>
                            <input 
                                type="date" 
                                name="tanggal_pengembalian" 
                                className="form-control"
                                value={formData.tanggal_pengembalian}
                                onChange={handleChange}
                                required
                                readOnly 
                            />
                        </div>

                        <div className="d-flex gap-2">
                            <button type="submit" className="btn btn-primary-tambah">
                                Simpan
                            </button>
                            <button type="button" className="btn btn-secondary" onClick={() => navigate("/pustakawan/peminjaman")}>
                                Batal
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}