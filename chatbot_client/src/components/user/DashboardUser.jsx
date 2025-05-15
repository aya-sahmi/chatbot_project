import React, { useEffect, useState } from 'react';
import SidebarUser from './SidebarUser';
import urlApi from '../../api/axios';

function DashboardUser() {
    const [user, setUser] = useState(null);
    const [totalPackages, setTotalPackages] = useState(0);
    const [totalChatbots, setTotalChatbots] = useState(0);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('userData'));
        setUser(userData);

        urlApi.get('/packages')
            .then(res => setTotalPackages(res.data.length || 0))
            .catch(() => setTotalPackages(0));

        urlApi.get('/chatbots')
            .then(res => setTotalChatbots(res.data.length || 0))
            .catch(() => setTotalChatbots(0));
    }, []);
    if (!user) return <div>Chargement...</div>;

    return (
        <div className="flex min-h-screen bg-gray-100">
            <SidebarUser/>
            <main className="flex-1 p-8">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold mb-2">Bienvenue, {user.full_name} !</h2>
                    <p className="text-gray-600">Email : {user.email}</p>
                    <p className="text-gray-600">
                        Solde total : <span className="font-semibold">{user.solde_total}</span>
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
                        <div className="text-5xl font-bold text-blue-700 mb-2">{totalPackages}</div>
                        <div className="text-lg text-gray-700 mb-4">Packages</div>
                        <button onClick={() => window.location.href = 'user/packages'} className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 transition">
                            Voir les packages
                        </button>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
                        <div className="text-5xl font-bold text-blue-700 mb-2">{totalChatbots}</div>
                        <div className="text-lg text-gray-700 mb-4">Chatbots</div>
                        <button onClick={() => window.location.href = 'user/chatbots'} className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 transition">
                            Voir les chatbots
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default DashboardUser;