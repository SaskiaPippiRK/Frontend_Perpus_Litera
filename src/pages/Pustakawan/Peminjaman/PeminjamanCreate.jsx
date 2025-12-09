import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_BASE_URL = 'http://localhost:8000/api';

export default function PeminjamanCreate() {
    const navigate = useNavigate();
    const [users, setAllUsers] = useState([]);
    const [formData, setFormData] = useState({
        id_users: '',
        tanggal_peminjaman: '',
        tanggal_pengembalian: '',
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        if(name === "tanggal_peminjaman")
        {
            const startDate = new Date(value);
            const endDate = new Date(value);
            endDate.setDate(startDate.getDate() + 7);

            const formattedEndDate = endDate.toISOString().split("T")[0];

            setFormData({
                ...formData,
                tanggal_peminjaman: value,
                tanggal_pengembalian: formattedEndDate,
            });
            
        } else{
            setFormData({
                ...formData,
                [e.target.name]: e.target.value,
            });
        } 
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(localStorage.getItem("token"));

        await fetch(`${API_BASE_URL}/peminjaman/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token"),
            },
            body: JSON.stringify(formData),
    });

    alert("Peminjaman berhasil ditambahkan.");
    navigate("/pustakawan/peminjaman");
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/anggota`, {
                headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
                },
            });
            
            const data = await response.json();
            setAllUsers(data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className="page-wrappers py-4">
            <div className="container-fluid">
                <div className="card shadow-lg rounded-4 content-card p-4">
                    <h2 className="page-title">Tambah Peminjaman</h2>

                    <form onSubmit={handleSubmit} className="mt-3">
                        <div className="input-group">
                            <label className="form-label">Nama Peminjam</label>
                            <select
                                name="id_users"
                                className="form-control"
                                value={formData.id_users}
                                onChange={handleChange}
                                required>

                                <option value="">-- Pilih Peminjam --</option>

                                {users.map((user) => (
                                    <option key={user.id_users} value={user.id_users}>
                                        {user.nama}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="input-group">
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

                        <div className="input-group">
                            <label className="form-label">Tanggal Pengembalian (auto)</label>
                            <input 
                                type="date" 
                                name="tanggal_pengembalian" 
                                className="form-control"
                                value={formData.tanggal_pengembalian}
                                readOnly
                            />
                        </div>

                        <div className="button-group">
                            <button type="submit" className="btn btn-primary-tambah">
                                Simpan
                            </button>
                            <Link to={`/pustakawan/peminjaman`} className="btn btn-secondary">
                                <i ></i> BATAL
                            </Link>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}