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
                            <label className="form-label">Tanggal Peminjaman</label>
                            <input 
                                type="date" 
                                name="tanggal peminjaman" 
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
                                name="tanggal pengembalian" 
                                className="form-control"
                                value={formData.tanggal_pengembalian}
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