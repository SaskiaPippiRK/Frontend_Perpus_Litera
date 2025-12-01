import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios'; 

const API_BASE_URL = 'http://localhost:8000/api'; 

const BukuForm = ({ onBukuCreated }) => {
    const[formData, setFormData] = useState({
        judul: '',
        penulis: '',
        tahun_terbit: '',
        kategori: '',
        lokasi_buku: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try{
            const response = await axios.post(`${API_BASE_URL}/buku/create`, formData);
            alert(`Buku berhasil dibuat`);
            setFormData({ judul: '', penulis: '', tahun_terbit: '', kategori: '', lokasi_buku: '' });

            if(onBukuCreated)
            {
                onBukuCreated(response.data);
            }
        } catch(err)
        {
            console.error("Gagal menyimpan buku: ", err.response ? err.response.data : err.message);
            const serverError = err.response?.data?.message || "Gagal koneksi atau server error";
            setError(`Gagal menyimpan buku: ${serverError}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="content-area py-4">
            <div className="container-fluid">
                <div className="card shadow-lg rounded-4 content-card p-4">
                

                    <form onSubmit={handleSubmit} className="mt-3">
                        <div className="input-group">
                            <label className="form-label">Judul Buku</label>
                            <input 
                                type="text" 
                                name="judul" 
                                className="form-control"
                                value={formData.judul}
                                onChange={handleChange}
                                required 
                            />
                        </div>

                        <div className="input-group">
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

                        <div className="input-group">
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

                        <div className="input-group">
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

                        <div className="input-group">
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

                        <div className="input-group">
                            <label className="form-label">Lokasi Buku</label>
                            <input 
                                type="text" 
                                name="lokasi_buku"
                                className="form-control"
                                value={formData.lokasi_buku}
                                onChange={handleChange}
                                required 
                            />
                        </div>

                        <div className="button-group">
                            <button type="submit" className="btn btn-primary-tambah">
                                Simpan
                            </button>

                            <Link to={`/pustakawan/buku/`} className="btn btn-secondary">
                                <i ></i> BATAL
                            </Link>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    )
}

export default BukuForm;