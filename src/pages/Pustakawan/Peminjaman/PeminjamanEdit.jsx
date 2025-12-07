import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { useParams, useNavigate, Link } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:8000/api'; 

const PeminjamanEdit = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();

    const [currentUser, setCurrentUser] = useState(null);
    const [formData, setFormData] = useState({
        id_users: '',
        tanggal_peminjaman: '',
        tanggal_pengembalian: '',
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPeminjamanData = async () => {
            try {
                const token = localStorage.getItem("auth_token");
                
                const response = await axios.get(`${API_BASE_URL}/peminjaman/${id}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                const data = response.data;
                
                setFormData({
                    id_users: data.id_users || "",
                    tanggal_peminjaman: data.tanggal_peminjaman?.slice(0, 10) || "",
                    tanggal_pengembalian: data.tanggal_pengembalian?.slice(0, 10) || "",
                });

                if (data.user) {
                    setCurrentUser(data.user);
                }

                setLoading(false);
            } catch(err) {
                console.error("Gagal memuat data Edit Peminjaman: ", err);
                setError("Gagal memuat data peminjaman.");
                setLoading(false);
            }
        };

        fetchPeminjamanData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try{
            const token = localStorage.getItem("auth_token");
            await axios.post(
                `${API_BASE_URL}/peminjaman/update/${id}`,
                formData,
                { 
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    } 
                }
            );

            alert("Peminjaman berhasil diperbarui!");
            navigate('/pustakawan/peminjaman');
        } catch(err) {
            console.error("Gagal memperbarui peminjaman: ", err);
            setError("Gagal memperbarui peminjaman.");
        }
    };

    if (loading) return <div className="p-4 text-center">Memuat data peminjaman...</div>;
    if (error) return <div className="p-4 alert alert-danger">{error}</div>;

    return (
        <div className="content-area py-4">
            <div className="container-fluid">
                <div className="card shadow-lg rounded-4 content-card p-4">
                    <h2 className="page-title">Update Peminjaman</h2>

                    <form onSubmit={handleSubmit} className="mt-3">
                        <div className="mb-3">
                            <label className="form-label">Nama Peminjam</label>
                            <input
                                type='text' 
                                className='form-control' 
                                value={currentUser ? currentUser.nama : "Loading..."} 
                                readOnly></input>
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
                                readOnly
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
                            />
                        </div>

                        <div className="button-group">
                            <button type="submit" className="btn btn-primary-tambah">
                                Simpan
                            </button>
                        
                            <Link to={`/pustakawan/peminjaman/`} className="btn btn-secondary">
                                <i ></i> BATAL
                            </Link>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    )
}

export default PeminjamanEdit;

