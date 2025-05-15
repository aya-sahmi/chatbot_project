import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaTachometerAlt, FaUsers, FaBox, FaGlobe, FaBriefcase, FaRobot, FaUserShield, FaKey, FaBars, FaChevronLeft } from "react-icons/fa";
import { supabase } from "../../config/supabaseClient";

function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);

    const menuItems = [
        { name: "Dashboard", path: "/superadmin/dashboard", icon: <FaTachometerAlt /> },
        { name: "Utilisateurs", path: "/superadmin/users", icon: <FaUsers /> },
        { name: "Packages", path: "/superadmin/packages", icon: <FaBox /> },
        { name: "Domaines", path: "/superadmin/domaines", icon: <FaGlobe /> },
        { name: "Workspaces", path: "/superadmin/workspaces", icon: <FaBriefcase /> },
        { name: "Chatbots", path: "/superadmin/chatbots", icon: <FaRobot /> },
        { name: "Roles", path: "/superadmin/roles", icon: <FaUserShield /> },
        { name: "Permissions", path: "/superadmin/permissions", icon: <FaKey /> },
    ];

    const handleLogout = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            localStorage.removeItem("access_token");
            localStorage.removeItem("user_data");
            navigate("/");
        } catch (error) {
            console.error("Erreur lors de la déconnexion :", error.message);
        }
    };

    return (
        <div className={`h-screen bg-gradient-to-b from-white to-gray-200 text-gray-800 flex flex-col fixed top-0 left-0 shadow-lg transition-all duration-300 ${collapsed ? "w-20" : "w-64"}`}>
            <div className={`p-4 flex items-center ${collapsed ? "justify-center" : "justify-between"} border-b border-gray-300`}>
                <button onClick={() => setCollapsed(!collapsed)} className="text-gray-600 hover:text-gray-900 focus:outline-none" title={collapsed ? "Ouvrir le menu" : "Réduire le menu"}>
                    {collapsed ? <FaBars size={22} /> : <FaChevronLeft size={22} />}
                </button>
                {!collapsed && (
                    <>
                        <img src="/logo-chatbot.jpg" alt="Admin Logo" className="w-10 h-10 rounded-full object-cover ml-2" />
                        <span className="text-2xl font-bold ml-2">Admin Panel</span>
                    </>
                )}
            </div>
            <ul className="flex-1 overflow-y-auto mt-2">
                {menuItems.map((item) => (
                    <li key={item.name} className="group">
                        <Link to={item.path}
                            className={`flex items-center gap-4 py-3 px-4 transition-all duration-200 rounded-lg ${
                                location.pathname === item.path? "bg-gray-300 text-gray-900 shadow-md": "hover:bg-gray-100 hover:text-gray-900"
                            }`}>
                            <span className="text-lg">{item.icon}</span>
                            {!collapsed && <span className="text-sm font-medium">{item.name}</span>}
                        </Link>
                    </li>
                ))}
            </ul>
            <div className={`p-4 border-t border-gray-300 text-center text-sm ${collapsed ? "px-1" : ""}`}>
                <button
                    onClick={handleLogout}
                    className="w-full py-2 px-4 text-sm font-medium text-white bg-red-500 rounded-md shadow-sm hover:bg-red-600 transition-all"
                >
                    {collapsed ? <span>⎋</span> : "Logout"}
                </button>
                {!collapsed && <p className="mt-2">© 2025 Chatbot Admin</p>}
            </div>
        </div>
    );
}

export default Sidebar;