import React, { useEffect, useState } from "react";
import axios from "axios";

const LaporanPage = () => {
  const [data, setData] = useState([]); // Inisialisasi data dengan array kosong
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Untuk menangani error

  // Gantilah dengan URL API Anda
  const API_LAPORAN_URL = 'http://localhost:8000/api/laporan'; // Pastikan URL ini benar

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(API_LAPORAN_URL, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`, // Menambahkan token jika perlu
          },
        });
        if (Array.isArray(response.data)) {
          setData(response.data); // Pastikan response.data adalah array
        } else {
          setError("Data tidak valid"); // Jika data bukan array
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Gagal mengambil data.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Jika data sedang dimuat
  if (loading) {
    return <div>Loading...</div>;
  }

  // Jika terjadi error saat mengambil data
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Laporan Peminjaman</h1>
      {data.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Judul Buku</th>
              <th>Penulis</th>
              <th>Tahun Terbit</th>
              <th>Kategori</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.judulBuku}</td>
                <td>{item.penulis}</td>
                <td>{item.tahunTerbit}</td>
                <td>{item.kategori}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>Tidak ada data untuk ditampilkan.</div>
      )}
    </div>
  );
};

export default LaporanPage;
