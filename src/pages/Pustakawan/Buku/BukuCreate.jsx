import React from 'react';
import BukuForm from "../../../components/BukuForm";
import { useNavigate } from 'react-router-dom';

const BukuCreate = () => {
    const navigate = useNavigate();

    const handleCreationSuccess = () => {
        navigate('/pustakawan/buku'); 
    };

    return (
        <div className="page-wrapper py-4">
            <div className="container-fluid">
                <div className="card shadow-lg rounded-4 content-card p-1">
                    <h2 className="page-title mt-4">Tambah Buku</h2>

                    <BukuForm onBukuCreated={handleCreationSuccess} />
                </div>
            </div>
        </div>
    )
}

export default BukuCreate;