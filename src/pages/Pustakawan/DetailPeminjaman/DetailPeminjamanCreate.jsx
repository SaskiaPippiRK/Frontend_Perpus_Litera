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
        denda: '',
    });

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
        const fetchDatas = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/detailPeminjaman/users`, {
                headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
                },
            });
            
            const data = await response.json();
            setAllBuku(data);
            setAllPeminjaman(data);
            } catch (err) {
                console.error(err);
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
                                value={formData.tanggal_pengembalian}
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