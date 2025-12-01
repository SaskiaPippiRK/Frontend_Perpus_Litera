import React, { useEffect } from 'react'; 
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'; 
import axios from 'axios'; 

import MainLayout from "./layouts/MainLayout";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

//Pustakawan
import BukuIndexPustakawan from "./pages/Pustakawan/BukuIndex";
import BukuCreatePustakawan from "./pages/Pustakawan/BukuCreate";
import BukuEditPustakawan from "./pages/Pustakawan/BukuEdit";
import PeminjamanIndex from "./pages/Pustakawan/PeminjamanIndex";
import DetailPeminjamanIndex from './pages/Pustakawan/DetailPeminjamanIndex';

//Anggota
import BukuIndexAnggota from "./pages/Anggota/BukuIndex";

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

                    <Route path="/pustakawan/peminjaman" element={
                        <ProtectedRoute roles={['pustakawan']}>
                            <PeminjamanIndex/>
                        </ProtectedRoute>
                    } />

                    <Route path="/pustakawan/detailPeminjaman" element={
                        <ProtectedRoute roles={['pustakawan']}>
                            <DetailPeminjamanIndex/>
                        </ProtectedRoute>
                    } />

                    <Route path="/anggota/buku" element={
                        <ProtectedRoute roles={['anggota']}>
                            <BukuIndexAnggota/>
                        </ProtectedRoute>
                    } />
                </Route>
            </Routes>
        </BrowserRouter>
    )
        
    
}

export default App;