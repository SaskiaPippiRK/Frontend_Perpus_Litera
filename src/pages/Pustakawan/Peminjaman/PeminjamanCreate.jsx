import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PeminjamanCreate() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        id_peminjaman: '',
        tanggal_peminjaman: '',
        tanggal_pengembalian: '',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        alert("Peminjaman berhasil ditambahkan.");

        navigate("/peminjaman");
    };

    return (
        <div className="content-area py-4">
            <div className="container-fluid">
                <div className="card shadow-lg rounded-4 content-card p-4">
                    <h2 className="page-title">Tambah Peminjaman</h2>

                    <form onSubmit={handleSubmit} className="mt-3">
                        <div className="mb-3">
                            <label className="form-label">Judul Peminjaman</label>
                            <input 
                                type="text" 
                                name="judul" 
                                className="form-control"
                                value={formData.judul}
                                onChange={handleChange}
                                required 
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Penulis</label>
                            <input 
                                type="text" 
                                name="penulis" 
                                className="form-control"
                                value={formData.penulis}
                                onChange={handleChange}
                                required 
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Penerbit</label>
                            <input 
                                type="text" 
                                name="penerbit"
                                className="form-control"
                                value={formData.penerbit}
                                onChange={handleChange}
                                required 
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Tahun Terbit</label>
                            <input 
                                type="number" 
                                name="tahun_terbit"
                                className="form-control"
                                value={formData.tahun_terbit}
                                onChange={handleChange}
                                required 
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Kategori</label>
                            <select 
                                name="kategori" 
                                className="form-control"
                                value={formData.kategori}
                                onChange={handleChange}
                                required
                            >
                                <option value="">-- Pilih Kategori --</option>
                                <option value="Fiksi">Fiksi</option>
                                <option value="Non-Fiksi">Non-Fiksi</option>
                                <option value="Referensi">Referensi</option>
                                <option value="Lainnya">Lainnya</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Lokasi Peminjaman</label>
                            <input 
                                type="text" 
                                name="lokasi_peminjaman"
                                className="form-control"
                                value={formData.lokasi_peminjaman}
                                onChange={handleChange}
                                required 
                            />
                        </div>

                        <div className="d-flex gap-2">
                            <button type="submit" className="btn btn-primary-tambah">
                                Simpan
                            </button>
                            <button type="button" className="btn btn-secondary" onClick={() => navigate("/peminjaman")}>
                                Batal
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}