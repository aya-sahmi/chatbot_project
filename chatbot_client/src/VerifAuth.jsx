import React from 'react';
import { Navigate } from 'react-router-dom';

export default function VerifAuth({ children }) {
    const isAuthenticated = !!localStorage.getItem('access_token');
    if (!isAuthenticated) {
        return <Navigate to="/" />;
    }
    return children;
}