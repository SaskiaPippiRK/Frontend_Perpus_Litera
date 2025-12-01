// src/Login.js
import React, { useState } from 'react';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom'; 
import Logo from '../assets/img/LogoLitera.png';

const API_LOGIN_URL = 'http://localhost:8000/api/login'; 

const LoginPage = () => {
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

      if(user.role === "pustakawan") {
        navigate('/pustakawan/buku');
      } else if(user.role === "anggota") {
        navigate('/anggota/buku');
      } else {
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
  };

return (
  <div className="auth-page">
    <div className="auth-card">
      <img src={Logo} alt="Litera Logo" className="auth-logo" />

      <h2 className="auth-title">Litera</h2>
      <p className="auth-subtitle">Library Management</p>

      <form onSubmit={handleSubmit} className="auth-form">
        {error && <div className="alert alert-danger">{error}</div>}

        <input
          type="email"
          id="email"
          name="email"
          className="form-control"
          value={formData.email}
          placeholder="Masukkan Email"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          id="password"
          name="password"
          className="form-control"
          value={formData.password}
          placeholder="Masukkan Password"
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          className="btn-primary-tambah auth-submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Loading...' : 'Sign In'}
        </button>
      </form>

      <p className="auth-switch">
        Belum punya akun?{' '}
        <button
          type="button"
          className="link-button"
          onClick={() => navigate('/register')}
        >
          Register di sini
        </button>
      </p>
    </div>
  </div>
);

};

export default LoginPage;
