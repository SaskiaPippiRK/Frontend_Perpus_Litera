import React, { useEffect } from 'react'; 
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'; 
import axios from 'axios'; 

import MainLayout from "./layouts/MainLayout";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

//Anggota
import BukuIndexAnggota from "./pages/Anggota/BukuIndex";
import AnggotaPeminjamanIndex from "./pages/Anggota/BukuIndex";
//Pustakawan
import BukuIndexPustakawan from "./pages/Pustakawan/Buku/BukuIndex";
import BukuCreatePustakawan from "./pages/Pustakawan/Buku/BukuCreate";
import BukuEditPustakawan from "./pages/Pustakawan/Buku/BukuEdit";

import PeminjamanIndex from "./pages/Pustakawan/Peminjaman/PeminjamanIndex";
import PeminjamanEdit from "./pages/Pustakawan/Peminjaman/PeminjamanEdit";
import PeminjamanCreate from "./pages/Pustakawan/Peminjaman/PeminjamanCreate";

import DetailPeminjamanIndex from './pages/Pustakawan/DetailPeminjaman/DetailPeminjamanIndex';
import DetailPeminjamanEdit from './pages/Pustakawan/DetailPeminjaman/DetailPeminjamanEdit';
import DetailPeminjamanCreate from './pages/Pustakawan/DetailPeminjaman/DetailPeminjamanCreate';

import LaporanIndex from './pages/Pustakawan/LaporanIndex';


function ProtectedRoute({ children, roles }) {
    const token = localStorage.getItem("auth_token");
    const role = localStorage.getItem("role");

    if (!token) return <Navigate to="/login" replace />;

    if (roles && !roles.includes(role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
}

function App()
{
    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            console.log("Token ditemukan dan Header Axios diatur ulang.");
        }
       
    }, []);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage/>} />
                <Route path="/register" element={<RegisterPage />} />

                <Route path="/" element={<Navigate to="/login" replace />} />

                <Route element={<MainLayout />}>
                    {/* BUKU */}
                    <Route path="/pustakawan/buku" element={
                        <ProtectedRoute roles={['pustakawan']}>
                            <BukuIndexPustakawan/>
                        </ProtectedRoute>
                    } />

                    <Route path="/pustakawan/buku/create" element={
                        <ProtectedRoute roles={['pustakawan']}>
                            <BukuCreatePustakawan/>
                        </ProtectedRoute>
                    } />

                    <Route path="/pustakawan/buku/edit/:id" element={
                        <ProtectedRoute roles={['pustakawan']}>
                            <BukuEditPustakawan/>
                        </ProtectedRoute>
                    } />

                    {/* PEMINJAMAN */}

                    <Route path="/pustakawan/peminjaman" element={
                        <ProtectedRoute roles={['pustakawan']}>
                            <PeminjamanIndex/>
                        </ProtectedRoute>
                    } />

                    <Route path="/pustakawan/peminjaman/create" element={
                        <ProtectedRoute roles={['pustakawan']}>
                            <PeminjamanCreate/>
                        </ProtectedRoute>
                    } />

                    <Route path="/pustakawan/peminjaman/edit" element={
                        <ProtectedRoute roles={['pustakawan']}>
                            <PeminjamanEdit/>
                        </ProtectedRoute>
                    } />

                    {/* DETAIL PEMINJAMAN */}

                    <Route path="/pustakawan/detailPeminjaman" element={
                        <ProtectedRoute roles={['pustakawan']}>
                            <DetailPeminjamanIndex/>
                        </ProtectedRoute>
                    } />

                    <Route path="/pustakawan/detailPeminjaman/create" element={
                        <ProtectedRoute roles={['pustakawan']}>
                            <DetailPeminjamanCreate/>
                        </ProtectedRoute>
                    } />

                    <Route path="/pustakawan/detailPeminjaman/edit/:id" element={
                        <ProtectedRoute roles={['pustakawan']}>
                            <DetailPeminjamanEdit/>
                        </ProtectedRoute>
                    } />

                    {/* PEMINJAMAN */}
                    <Route path="/pustakawan/peminjaman" element={
                        <ProtectedRoute roles={['pustakawan']}>
                            <PeminjamanIndex/>
                        </ProtectedRoute>
                    } />

                    <Route path="/pustakawan/peminjaman/edit/:id" element={
                        <ProtectedRoute roles={['pustakawan']}>
                            <PeminjamanEdit/>
                        </ProtectedRoute>
                    } />

                    {/* LAPORAN */}
                    <Route path="/pustakawan/laporan" element={
                        <ProtectedRoute roles={['pustakawan']}>
                            <LaporanIndex/>
                        </ProtectedRoute>
                    } />

                    {/* ANGGOTA */}

                    <Route path="/anggota/buku" element={
                        <ProtectedRoute roles={['anggota']}>
                            <BukuIndexAnggota/>
                        </ProtectedRoute>
                    } />

                    <Route path="/anggota/peminjaman" element={
                        <ProtectedRoute roles={['anggota']}>
                            <AnggotaPeminjamanIndex/>
                        </ProtectedRoute>
                    } />

                </Route>
            </Routes>
        </BrowserRouter>
    )
        
    
}

export default App;