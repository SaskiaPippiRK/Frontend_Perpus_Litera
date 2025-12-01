// src/Register.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_REGISTER_URL = 'http://localhost:8000/api/register';

function Register() {
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nomorTelepon, setNomorTelepon] = useState('');
  const [umur, setUmur] = useState('');
  const [role, setRole] = useState('pustakawan');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setIsSubmitting(true);

    try {
      const res = await axios.post(API_REGISTER_URL, {
        nama,
        email,
        password,
        nomor_telepon: nomorTelepon,
        umur,
        role,
      });

      setMessage(res.data.message);
      setNama('');
      setEmail('');
      setPassword('');
      setNomorTelepon('');
      setUmur('');
      setRole('');

      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Gagal mendaftar');
      } else {
        setError('Gagal mendaftar');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login">
      <div className="login-card">
        <img src="/LogoLitera.png" alt="Litera Logo" className="logo-img" />
        <h5>Library Management</h5>
        <h4>Register</h4>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Masukkan Nama"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              className="form-control"
              placeholder="Masukkan Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              className="form-control"
              placeholder="Masukkan Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Masukkan Nomor Telepon"
              value={nomorTelepon}
              onChange={(e) => setNomorTelepon(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="number"
              className="form-control"
              placeholder="Masukkan Umur"
              value={umur}
              onChange={(e) => setUmur(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <select
              className="form-control"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="pustakawan">Pustakawan</option>
              <option value="anggota">Anggota</option>
            </select>
          </div>

          <button type="submit" className="btn-primary-tambah" disabled={isSubmitting}>
            {isSubmitting ? 'Loading...' : 'Register'}
          </button>
        </form>

        <br />
        <h5>
          Sudah punya akun?{' '}
          <a onClick={() => navigate('/login')}><u>Login di sini</u></a>
        </h5>
      </div>
    </div>
  );
}

export default Register;
