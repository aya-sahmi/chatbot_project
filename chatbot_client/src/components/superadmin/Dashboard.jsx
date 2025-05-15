import { useEffect, useState } from 'react';
import urlApi from '../../api/axios';
import Sidebar from "./Sidebar";

export default function Dashboard() {
    const [stats, setStats] = useState({ users: 0, packages: 0, domains: 0, workspaces: 0, chatbots: 0 });
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersRes, packagesRes, domainsRes, workspacesRes, chatbotsRes, recentUsersRes] = await Promise.all([
                    urlApi.get('/users'),
                    urlApi.get('/packages'),
                    urlApi.get('/domaines'),
                    urlApi.get('/workspaces'),
                    urlApi.get('/chatbots'),
                    urlApi.get('/users'),
                    urlApi.get('/roles')
                ]);
                setStats({
                    users: usersRes.data.length,
                    packages: packagesRes.data.length,
                    domains: domainsRes.data.length,
                    workspaces: workspacesRes.data.length,
                    chatbots: chatbotsRes.data.length
                });
                setUsers(recentUsersRes.data.slice(-5));
            } catch (error) {
                console.error('Erreur lors du chargement des données', error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="flex flex-col sm:flex-row">
            <Sidebar />
            <div className="flex-1 sm:ml-64 p-2 sm:p-6 bg-gray-100 min-h-screen">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {Object.entries(stats).map(([key, val]) => (
                        <div key={key} className="bg-gradient-to-b from-gray-100 to-gray-300 p-4 shadow-2xl rounded">
                            <h3 className="text-lg font-semibold capitalize">Total {key}</h3>
                            <p className="text-2xl">{val}</p>
                        </div>
                    ))}
                </div>
                <div className="bg-white p-4 sm:p-6 shadow-lg rounded-lg mt-4 mb-4">
                    <h2 className="text-xl font-bold mb-4">Utilisateurs</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse border border-gray-300 text-sm text-left text-gray-700">
                            <thead className="bg-gray-200 text-gray-800">
                                <tr>
                                    <th className="border border-gray-300 py-3 px-4">Nom Complet</th>
                                    <th className="border border-gray-300 py-3 px-4">Âge</th>
                                    <th className="border border-gray-300 py-3 px-4">Domaine</th>
                                    <th className="border border-gray-300 py-3 px-4">Package</th>
                                    <th className="border border-gray-300 py-3 px-4">Rôle</th>
                                    <th className="border border-gray-300 py-3 px-4">Statut</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((u) => (
                                    <tr key={u.user_id} className="hover:bg-gray-100">
                                        <td className="border border-gray-300 py-2 px-4">{u.full_name}</td>
                                        <td className="border border-gray-300 py-2 px-4">{u.age}</td>
                                        <td className="border border-gray-300 py-2 px-4">{u.domaine_name || 'pas de domaines'}</td>
                                        <td className="border border-gray-300 py-2 px-4">{u.package_name || 'pas de package'}</td>
                                        <td className="border border-gray-300 py-2 px-4">{u.role_name || 'sans role'}</td>
                                        <td className={`border border-gray-300 py-2 px-4 font-semibold ${u.is_active ? 'text-green-600' : 'text-red-500'}`}>
                                            {u.is_active ? 'Actif' : 'Inactif'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-4 flex justify-end">
                        <a href="/superadmin/users" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                            Voir plus
                        </a>
                    </div>
                </div>
                <div className="bg-white p-4 shadow rounded">
                    <h2 className="font-bold mb-2">Diagramme des utilisateurs</h2>
                    <div className="h-64 bg-gray-100 flex items-center justify-center">
                        <p>Diagramme</p>
                    </div>
                </div>
            </div>
        </div>
    );
}