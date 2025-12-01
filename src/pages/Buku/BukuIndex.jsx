import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function BukuIndex() {
    const navigate = useNavigate();
    const [allBuku, setAllBuku] = useState([
    {
        id_buku: 1,
        judul: "A",
        penulis: "A",
        penerbit: "A",
        tahun_terbit: 2020,
        kategori: "Fiksi",
        lokasi_buku: "A1",
    },
    {
        id_buku: 2,
        judul: "B",
        penulis: "B",
        penerbit: "B",
        tahun_terbit: 2021,
        kategori: "Non-Fiksi",
        lokasi_buku: "A2",
    },]);

    const handleHapus = (id) => {
        if(window.confirm("Apakah Anda Yakin?")) {
            setAllBuku(allBuku.filter((buku) => buku.id_buku != id));
        }
    };

    return (
        <div className="content-area py-4">
            <div className="container-fluid">
                <div className = "card shadow-lg rounded-4 content-card p-4">
                    <h2 className = "page-title">Buku</h2>

                    <button className="btn btn-primary-tambah" onClick={() => navigate("/buku/create")}>
                        Tambah Buku
                    </button>

                    <div className="table-responsive mt-3">
                        <table className="table-border">
                            <thead className="table-primary">
                                <tr>
                                    <th className="text-center">Judul Buku</th>
                                    <th className="text-center">Penulis</th>
                                    <th className="text-center">Penerbit</th>
                                    <th className="text-center">Tahun Terbit</th>
                                    <th className="text-center">Kategori</th>
                                    <th className="text-center">Lokasi</th>
                                    <th className="text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allBuku.map((buku) => (
                                    <tr key={buku.id_buku}>
                                        <td className="text-center">{buku.judul}</td>
                                        <td className="text-center">{buku.penulis}</td>
                                        <td className="text-center">{buku.penerbit}</td>
                                        <td className="text-center">{buku.tahun_terbit}</td>
                                        <td className="text-center">{buku.kategori}</td>
                                        <td className="text-center">{buku.lokasi_buku}</td>
                                        <td className="text-center">
                                            <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
                                                <button className="btn btn-primary-edit" onClick={() => navigate(`/buku/edit/${buku.id_buku}`)}>
                                                    EDIT
                                                </button>
                                                <button className="btn btn-primary-danger" onClick={() => handleHapus(buku.id_buku)}>
                                                    HAPUS
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {allBuku.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="text-center">
                                    Tidak ada data buku
                                    </td>
                                </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
