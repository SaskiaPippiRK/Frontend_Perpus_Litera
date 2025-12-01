import React, { useState } from 'react';
import axios from 'axios'; // Import digunakan di fungsi handleSubmit
import { useNavigate, Link } from 'react-router-dom'; 

const API_LOGIN_URL = 'http://localhost:8000/api/login'; 

const Login = () => {
    const [formData, setFormData] = useState({ 
        email: '', 
        password: '' 
    });
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const response = await axios.post(API_LOGIN_URL, formData);
            const token = response.data.token;
            const user = response.data.detail;

            localStorage.setItem('auth_token', token);
            localStorage.setItem('role', user.role);

            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            alert("Login Berhasil! Selamat Datang.");

            if(user.role === "pustakawan")
            {
                navigate('/pustakawan/buku');
            } else if(user.role === "anggota")
            {
                navigate('/anggota/buku');
            } else
            {
                navigate('/');
            }
        } catch(err) {
            console.error("Login Gagal: ", err.response ? err.response.data : err.message);
            if(err.response && err.response.status === 401) {
                setError("Email atau Password salah.");
            } else {
                setError("Terjadi kesalahan koneksi atau server.");
            }
        } finally {
            setIsSubmitting(false);
        }
        
        // =========================================================
        // === Batas TO-DO ===
        // =========================================================
        
        setIsSubmitting(false);
    };

    return (

        <div className="login">
            <div className="login-card">
                <img src="/LogoLitera.png" alt="Litera Logo" className="logo-img" />
                <h5>Library Management</h5>

                 <form onSubmit={handleSubmit}>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <input type="email" id="email" name="email" className="form-control" value={formData.email} placeholder="Masukkan Email" onChange={handleChange} required></input>
                    <input type="password" id="password" name="password" className="form-control" value={formData.password} placeholder="Masukkan Password" onChange={handleChange} required></input>
                    <div className="login-btn">
                        <button type="submit" className="btn btn-primary-tambah" disabled={isSubmitting}>{isSubmitting ? 'Loading...' : 'Sign In'}</button>
                    </div>
                </form><br/>

                <h5>
                    Register <a onClick={() => navigate("/register")}><u>here</u></a>
                </h5> 
            </div>
        </div>    
    );
};

export default Login;