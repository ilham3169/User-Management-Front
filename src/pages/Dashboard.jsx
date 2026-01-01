import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkExistingSession } from '../services/authService';

export default function Dashboard() {

    const navigate = useNavigate();
    useEffect(() => {
        const verify = async () => {
            const session = await checkExistingSession();
            if (!session.isValid) {
            navigate('/');
            }
        };
        verify();
    }, []);
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <h1 className="text-3xl font-bold text-gray-800">
            Welcome to Dashboard 🚀
        </h1>
        </div>
    );

}
