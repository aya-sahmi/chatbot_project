import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../config/supabaseClient';

function SidebarUser() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            localStorage.removeItem("access_token");
            localStorage.removeItem("userData");
            navigate("/");
        } catch (error) {
            console.error("Erreur lors de la déconnexion :", error.message);
        }
    };

    return (
        <div className="h-screen w-64 bg-gradient-to-b from-blue-700 to-blue-900 text-white flex flex-col shadow-lg">
            <div className="p-6 text-2xl font-bold border-b border-blue-800">
                User Panel
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2">
                <a href="/user/dashboard" className="block py-2 px-4 rounded hover:bg-blue-800 transition">Dashboard</a>
                <a href="/user/packages" className="block py-2 px-4 rounded hover:bg-blue-800 transition">Packages</a>
                <a href="/user/chatbots" className="block py-2 px-4 rounded hover:bg-blue-800 transition">Chatbots</a>
            </nav>
            <div className="p-4 border-t border-blue-800">
                <button onClick={handleLogout} className="w-full py-2 bg-red-600 hover:bg-red-700 rounded text-white font-semibold transition">
                    Logout
                </button>
            </div>
        </div>
    );
}

export default SidebarUser;