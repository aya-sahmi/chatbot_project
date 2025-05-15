import React from "react";
import { FaTachometerAlt, FaRobot, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../config/supabaseClient";

export default function SidebarAgent() {
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
        <div className="h-screen w-64 bg-indigo-700 text-white flex flex-col fixed left-0 top-0 shadow-lg z-10">
            <div className="flex items-center gap-3 px-6 py-6 border-b border-indigo-600">
                <FaRobot className="text-3xl" />
                <span className="font-bold text-lg">Live Agent</span>
            </div>
            <nav className="flex-1 py-6">
                <ul className="space-y-2">
                    <li>
                        <button className="flex items-center w-full px-6 py-3 rounded-lg transition hover:bg-indigo-800" onClick={() => navigate("/liveagent/dashboard")}>
                            <FaTachometerAlt className="mr-3" /> Dashboard
                        </button>
                    </li>
                    <li>
                        <button className="flex items-center w-full px-6 py-3 rounded-lg transition hover:bg-indigo-800" onClick={() => navigate("/liveagent/chatbots")}>
                            <FaRobot className="mr-3" /> Chatbots
                        </button>
                    </li>
                </ul>
            </nav>
            <button className="flex items-center px-6 py-4 border-t border-indigo-600 hover:bg-indigo-800 transition" onClick={handleLogout}>
                <FaSignOutAlt className="mr-3" /> Logout
            </button>
        </div>
    );
}