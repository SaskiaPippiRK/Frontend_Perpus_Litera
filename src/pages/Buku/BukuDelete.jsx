import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:8000/api';

const BukuDelete = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        judul: '',
        penulis: '',
        penerbit: '',
        tahun_terbit: '',
        kategori: '',
        lokasi_buku: '',
    });


    useEffect(() => {
        const fetchBukuData = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/buku/${id}`);
                setFormData(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Gagal memuat data Delete Buku:", err);
                setError("Gagal memuat data Buku. Pastikan ID Buku benar dan API berfungsi.");
                setLoading(false);
            }
        };
        fetchBukuData();
    }, [id]);

    const handleDelete = async(e) => {
        e.preventDefault();
        setError(null);

        try {
            await axios.delete(`${API_BASE_URL}/buku/${id}`);

            alert("Buku berhasil dihapus!");
            navigate('/buku');
        } catch (err) {
            console.error("Gagal menghapus Buku:", err.response ? err.response.data : err.message);
            const serverError = err.response?.data?.message || "Kesalahan koneksi atau validasi.";
            setError(`Gagal menghapus Buku: ${serverError}`);
        }
    };

    if(loading) 
        return <div className="p-4 text-center">Memuat data...</div>;

    if(error) 
        return <div className="p-4 alert alert-danger">{error}</div>;

    return (
        <div className="p-4">
            <h2>Hapus Buku</h2>
            <p>Apakah Anda yakin ingin menghapus buku:</p>

            <strong>{formData.judul}</strong>

            <div className="mt-3">
                <button className="btn btn-danger" onClick={handleDelete}>Hapus</button>
                <Link to="/buku" className="btn btn-secondary ms-2">Batal</Link>
            </div>
        </div>
    );
}
