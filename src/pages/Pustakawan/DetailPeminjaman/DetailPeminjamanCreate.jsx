import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { validateDetailPeminjaman } from '../../../js/script';

const API_BASE_URL = 'http://localhost:8000/api';

export default function DetailPeminjamanCreate() {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    
    
    const [allBuku, setAllBuku] = useState([]);
    const [allPeminjaman, setAllPeminjaman] = useState([]);

    const [formData, setFormData] = useState({
        id_users: '',      
        id_peminjaman: '',  
        id_buku: '',
        jumlah: '',
        status: 'dipinjam',
        denda: 0,
    });

    const handleChange = (e) => {
        if (e.target.name === 'id_users') {
            const selectedId = e.target.value;
            const selectedData = allPeminjaman.find(p => p.user.id_users == selectedId);
            
            setFormData({
                ...formData,
                id_users: selectedId,
                id_peminjaman: selectedData ? selectedData.id_peminjaman : '' 
            });
        } else {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const validationError = validateDetailPeminjaman(
            formData.id_users,
            formData.id_peminjaman,
            formData.id_buku,
            formData.jumlah,
            formData.denda
        );
        
        if (validationError) {
            setError(validationError);
            return;
        }

        if(!formData.id_peminjaman) {
            alert("Harap pilih Nama Peminjam terlebih dahulu!");
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/detailPeminjaman/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("auth_token"),
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Gagal menyimpan data");
            }

            alert("Berhasil! Data detail peminjaman tersimpan.");
            navigate("/pustakawan/detailPeminjaman");

        } catch (err) {
            console.error(err);
            alert("Error: " + err.message);
        }
    };

    useEffect(() => {
        const fetchDatas = async () => {
            try {
                const token = localStorage.getItem("auth_token");
                const headers = { Authorization: `Bearer ${token}` };

                const resBuku = await fetch(`${API_BASE_URL}/buku`, { headers });
                const resPinjam = await fetch(`${API_BASE_URL}/peminjaman`, { headers });
                const jsonBuku = await resBuku.json();
                const jsonPinjam = await resPinjam.json();
                const listBuku = Array.isArray(jsonBuku) ? jsonBuku : (jsonBuku.data || []);
                const listPinjam = Array.isArray(jsonPinjam) ? jsonPinjam : (jsonPinjam.data || []);

                setAllBuku(listBuku);
                setAllPeminjaman(listPinjam);
    
                console.log("Data Buku:", listBuku);
                console.log("Data Peminjam:", listPinjam);

            } catch (err) {
                console.error("Gagal mengambil data:", err);
            }
        };
        fetchDatas();
    }, []);

    return (
        <div className="page-wrappers py-4">
            <div className="container-fluid">
                <div className="card shadow-lg rounded-4 content-card p-4">
                    <h2 className="page-title">Tambah Detail Peminjaman</h2>

                    <form onSubmit={handleSubmit} className="mt-3">
                        
                        <div className="mb-3">
                            <label className="form-label">Nama Peminjam</label>
                            <select
                                name="id_users"
                                className="form-control"
                                value={formData.id_users}
                                onChange={handleChange}
                                >

                                <option value="">-- Pilih Peminjam --</option>
                                {allPeminjaman.map((item) => (
                                    <option key={item.id_peminjaman} value={item.user.id_users}>
                                        {item.user ? item.user.nama : 'User Tidak Dikenal'} - {item.tanggal_peminjaman}
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
                                >

                                <option value="">-- Pilih Buku --</option>
                                {allBuku.map((buku) => (
                                    <option key={buku.id_buku} value={buku.id_buku}>
                                        {buku.judul}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Jumlah</label>
                            <input 
                                type="number"
                                name="jumlah" 
                                className="form-control"
                                value={formData.jumlah}
                                onChange={handleChange}
                                 
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Denda</label>
                            <input 
                                type="number" 
                                name="denda" 
                                className="form-control"
                                value={formData.denda}
                                onChange={handleChange}
                            />
                        </div>
                        {error && <div className="alert alert-danger">{error}</div>}

                        <div className="d-flex gap-2">
                            <button type="submit" className="btn btn-primary-tambah" style={{backgroundColor: '#D11F26', color: 'white'}}>
                                Simpan
                            </button>
                            <button type="button" className="btn btn-secondary" onClick={() => navigate("/pustakawan/detailPeminjaman")}>
                                Batal
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}