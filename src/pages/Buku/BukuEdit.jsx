import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function BukuEdit() {
    const navigate = useNavigate();
    const { id_buku } = useParams();

    const [formData, setFormData] = useState({
        judul: "",
        penulis: "",
        penerbit: "",
        tahun_terbit: "",
        kategori: "",
        lokasi_buku: "",
    });

    // useEffect(() => {
    //     const dataDummy = {
    //         1: { judul: "A", penulis: "A", penerbit: "A", tahun_terbit: 2020, kategori: "Fiksi", lokasi_buku: "A1" },
    //         2: { judul: "B", penulis: "B", penerbit: "B", tahun_terbit: 2021, kategori: "Non-Fiksi", lokasi_buku: "A2" }
    //     };

    //     if (dataDummy[id_buku]) setFormData(dataDummy[id_buku]);
    // }, [id_buku]);


    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(Data buku ID ${id_buku} berhasil diubah (simulasi));
        navigate("/buku");
    };

    return (
        <div className="content-area py-4">
            <div className="container-fluid">
                <div className="card shadow-lg rounded-4 content-card p-4">
                    <h2 className="page-title">Edit Buku</h2>

                    <form onSubmit={handleSubmit} className="mt-3">

                        <div className="mb-3">
                            <label className="form-label">Judul Buku</label>
                            <input
                                type="text"
                                name="judul"
                                className="form-control"
                                value={formData.judul}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Penulis</label>
                            <input
                                type="text"
                                name="penulis"
                                className="form-control"
                                value={formData.penulis}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Penerbit</label>
                            <input
                                type="text"
                                name="penerbit"
                                className="form-control"
                                value={formData.penerbit}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Tahun Terbit</label>
                            <input
                                type="number"
                                name="tahun_terbit"
                                className="form-control"
                                value={formData.tahun_terbit}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Kategori</label>
                            <select
                                name="kategori"
                                className="form-control"
                                value={formData.kategori}
                                onChange={handleChange}
                                required
                            >
                                <option value="Fiksi">Fiksi</option>
                                <option value="Non-Fiksi">Non-Fiksi</option>
                                <option value="Referensi">Referensi</option>
                                <option value="Lainnya">Lainnya</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Lokasi Buku</label>
                            <input
                                type="text"
                                name="lokasi_buku"
                                className="form-control"
                                value={formData.lokasi_buku}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="d-flex gap-2">
                            <button type="submit" className="btn btn-primary-edit">
                                Update
                            </button>
                            <button type="button" className="btn btn-secondary" onClick={() => navigate("/buku")}>
                                Batal
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}