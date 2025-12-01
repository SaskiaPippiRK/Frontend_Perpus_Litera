import React, { useEffect } from 'react'; 
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'; 
import axios from 'axios'; 

import MainLayout from "./layouts/MainLayout";

import LoginPage from "./pages/LoginPage";

//Pustakawan
import BukuIndexPustakawan from "./pages/Pustakawan/PustakawanIndex";

//Anggota
import BukuIndexAnggota from "./pages/Anggota/AnggotaIndex";

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

                <Route path="/" element={<Navigate to="/login" replace />} />

                <Route element={<MainLayout />}>
                    <Route path="/pustakawan/buku" element={
                        <ProtectedRoute roles={['pustakawan']}>
                            <BukuIndexPustakawan/>
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