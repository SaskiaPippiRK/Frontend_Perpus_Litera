import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = 'http://localhost:8000/api';

export default function DetailPeminjamanIndex() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [allDetailPeminjaman, setAllDetailPeminjaman] = useState([]);

    const fetchDetailPeminjaman = async () => {
        try  {
            const response = await axios.get(`${API_BASE_URL}/detailPeminjaman`);
            setAllDetailPeminjaman(response.data);
            setLoading(false);
        } catch(err)  {
            setError("Gagal memuat detail data Peminjaman dari API Laravel.");
            setLoading(false);
        }
    };

    const handleDelete = async(id) => {
        if(window.confirm("Apakah Anda yakin ingin menghapus data peminjaman ini?")) {
            try {
                await axios.delete(`${API_BASE_URL}/detailPeminjaman/delete/${id}`);
                alert("Detail Peminjaman berhasil dihapus!");

                fetchDetailPeminjaman();
            } catch(err) {
                console.error("Gagal menghapus detail peminjaman: ", err);
                alert("Gagal menghapus detail peminjaman. Cek console untuk detail");
            }
        }
    };

    if(loading) return <div className="p-4 text-center">Memuat data...</div>;
    if(error) return <div className="p-4 alert alert-danger">{error}</div>;

    useEffect(() => {
        const fetchPeminjaman = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/peminjaman`, {
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("token")
                    }
                });

                const data = await response.json();
                setAllPeminjaman(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchPeminjaman();
    }, []);

    return (
        <div className="content-area py-4">
            <div className="container-fluid">
                <div className = "card shadow-lg rounded-4 content-card p-4">
                    <h2 className = "page-title">Detail Peminjaman</h2>

                    <button className="btn btn-primary-tambah" onClick={() => navigate("/detailPeminjaman/create")}>
                        Tambah Peminjaman
                    </button>

                    <div className="table-responsive mt-3">
                        <table className="table-border">
                            <thead className="table-primary">
                                <tr>
                                    <th className="text-center">ID</th>
                                    <th className="text-center">Nama Peminjam</th>
                                    <th className="text-center">Judul Buku</th>
                                    <th className="text-center">Jumlah</th>
                                    <th className="text-center">Status</th>
                                    <th className="text-center">Denda</th>
                                    <th className="text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allDetailPeminjaman.map((detailPeminjaman) => (
                                    <tr key={detailPeminjaman.id_detail}>
                                        <td className="text-center">{detailPeminjaman.detailPeminjaman}</td>
                                        <td className="text-center">{detailPeminjaman.peminjaman.user ? detailPeminjaman.peminjaman.user.nama : "-"}</td>
                                        <td className="text-center">{detailPeminjaman.buku ? detailPeminjaman.buku.judul : "-"}</td>
                                        <td className="text-center">{detailPeminjaman.status}</td>
                                        <td className="text-center">{detailPeminjaman.denda}</td>
                                        
                                        <td className="text-center">
                                            <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
                                                <button className="btn btn-primary-edit" onClick={() => navigate(`/peminjaman/edit/${detailPeminjaman.id_detail}`)}>
                                                    EDIT
                                                </button>
                                                <button className="btn btn-primary-danger" onClick={() => handleDelete(detailPeminjaman.id_detail)}>
                                                    HAPUS
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {allDetailPeminjaman.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="text-center">
                                    Tidak ada data Peminjaman
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
