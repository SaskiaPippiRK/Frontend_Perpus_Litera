export function validateRegisterForm({ nama, email, password, nomorTelepon, umur, role }) 
{
    if(!nama || nama.trim() === "")
    {
        return "Anda belum mengisi nama Anda";
    }

    if (!email || email.trim() === "") {
        return "Anda belum mengisi email Anda";
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
        return "Format email tidak valid";
    }

    if (!password || password.trim() === "") {
        return "Anda belum mengisi password Anda";
    }

    if (password.length < 6) {
        return "Password minimal 6 karakter";
    }

    if (!nomorTelepon || nomorTelepon.trim() === "") {
        return "Anda belum mengisi nomor telepon Anda";
    }

    if (!umur || umur.trim() === "") {
        return "Anda belum mengisi umur Anda";
    }

    if (!role || role.trim() === "pilih") {
        return "Silakan pilih role Anda";
    }

    return null; //klo gk ada error
}

export function validateLoginForm({ email, password }) {
    if (!email || email.trim() === "") {
        return "Anda belum mengisi email Anda";
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
        return "Format email tidak valid";
    }

    if (!password || password.trim() === "") {
        return "Anda belum mengisi password Anda";
    }

    return null;
}

//buku
export function validateBukuForm(data) {
    if (!data.judul?.trim()) 
        return "Judul buku tidak boleh kosong.";

    if (!data.penulis?.trim()) 
        return "Nama penulis tidak boleh kosong.";

    if (!data.penerbit?.trim()) 
        return "Nama penerbit tidak boleh kosong.";

    if (!data.tahun_terbit || isNaN(data.tahun_terbit)) 
        return "Tahun terbit harus berupa angka.";

    if (!data.kategori?.trim()) 
        return "Kategori buku harus dipilih.";

    if (!data.lokasi_buku?.trim()) 
        return "Lokasi buku tidak boleh kosong.";

    return null; 
}

//peminjaman
export function validatePeminjamanForm({ id_users, tanggal_peminjaman }) 
{
    if (!id_users || id_users.trim() === "") {
        return "Anda belum memilih nama peminjam.";
    }

    if (!tanggal_peminjaman || tanggal_peminjaman.trim() === "") {
        return "Anda belum memilih tanggal peminjaman.";
    }

    const today = new Date().toISOString().split("T")[0];
    if (tanggal_peminjaman < today) {
        return "Tanggal peminjaman tidak boleh kurang dari hari ini.";
    }

    return null;
}

export function validatePengembalianForm({ id_users, tanggal_peminjaman, tanggal_pengembalian }) 
{
    if (!id_users) {
        return "Anda belum memilih nama peminjam.";
    }

    if (!tanggal_pengembalian || tanggal_pengembalian.trim() === "") {
        return "Anda belum memilih tanggal peminjaman.";
    }

    const pinjam = new Date(tanggal_peminjaman);
    const kembali = new Date(tanggal_pengembalian);

    const today = new Date().toISOString().split("T")[0];
    if (kembali < pinjam) {
        return "Tanggal pengembalian tidak boleh kurang dari tanggal peminjaman.";
    }

    return null;
}

//detail
export function validateDetailPeminjaman(id_users, id_peminjaman, id_buku, jumlah, denda)
{
    if (!id_users) {
        return "Nama peminjam harus dipilih!";
    }

    if (!id_peminjaman || id_peminjaman === "") {
        return "ID peminjaman tidak ditemukan!";
    }

    if (!id_buku || id_buku.trim() === "") {
        return "Buku harus dipilih!";
    }

    if (!jumlah || isNaN(jumlah) || Number(jumlah) <= 0) {
        return "Jumlah harus lebih dari 0!";
    }

    if (denda < 0) {
        return "Denda tidak boleh negatif!";
    }

    return null;
}

export function validateDetailPeminjamanEdit({ id_peminjaman, id_buku, jumlah, denda }) 
{
    if (!id_peminjaman) {
        return "ID peminjaman tidak boleh kosong.";
    }
    if (!id_buku) {
        return "Buku tidak boleh kosong.";
    }
    if (!jumlah || jumlah === "" || jumlah <= 0) {
        return "Jumlah peminjaman harus lebih dari 0.";
    }
    if (denda === "" || denda < 0) {
        return "Denda tidak valid.";
    }

    return null;
}
