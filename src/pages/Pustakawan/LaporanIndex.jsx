import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";

export default function LaporanIndex() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchLaporan = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get(`${API_BASE_URL}/laporan`);
            setData(res.data);
        } catch (err) {
            console.error(err);
            const msg =
                err.response?.data?.message ||
                "Gagal memuat data laporan dari server";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLaporan();
    }, []);

    return (
        <div className="laporan-wrapper py-4">
            <div className="container-fluid">
                <div className="card shadow-lg rounded-4 content-card p-4 content-wrapper">
                    <div className="page-title">
                        <div>
                            <h2 className="mb-1">Laporan Ringkasan</h2>
                            <p className="text-muted mb-0">
                                Ringkasan data perpustakaan: total anggota, buku fiksi,
                                buku non fiksi, dan total peminjaman yang tercatat.
                            </p>
                        </div>
                        <button
                            className="laporan-refresh-btn"
                            onClick={fetchLaporan}
                        >
                            Refresh
                        </button>
                    </div>

                    {loading && <p>Sedang memuat data...</p>}

                    {error && !loading && (
                        <div className="alert alert-danger mt-3" role="alert">
                            {error}
                        </div>
                    )}

                    {!loading && !error && data && (
                        <div className="laporan-grid mt-4">
                            <div className="laporan-card card-anggota">
                                <div className="laporan-label">Jumlah Anggota</div>
                                <div className="laporan-value">
                                    {data.jumlah_anggota}
                                </div>
                            </div>

                            <div className="laporan-card card-fiksi">
                                <div className="laporan-label">Buku Fiksi</div>
                                <div className="laporan-value">
                                    {data.jumlah_buku_fiksi}
                                </div>
                            </div>

                            <div className="laporan-card card-nonfiksi">
                                <div className="laporan-label">Buku Non Fiksi</div>
                                <div className="laporan-value">
                                    {data.jumlah_buku_non_fiksi}
                                </div>
                            </div>

                            <div className="laporan-card card-peminjaman">
                                <div className="laporan-label">Jumlah Peminjaman</div>
                                <div className="laporan-value">
                                    {data.jumlah_peminjaman}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}