import React, { useState, useEffect } from "react";
import SidebarAgent from "./SidebarAgent";
import urlApi from "../../api/axios";
import { toast } from "react-toastify";
import { FaRobot, FaTachometerAlt } from "react-icons/fa";

export default function DashboardLiveAgent() {
    const [active, setActive] = useState("dashboard");
    const [user, setUser] = useState(null);
    const [chatbots, setChatbots] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("userData"));
        setUser(userData);
    }, []);

    useEffect(() => {
        if (active === "chatbots") fetchChatbots();
    }, [active]);

    const fetchChatbots = async () => {
        setLoading(true);
        try {
            const { data } = await urlApi.get("/chatbots");
            setChatbots(data);
        } catch {
            toast.error("Erreur lors du chargement des chatbots");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <SidebarAgent active={active} setActive={setActive} />
            <div className="flex-1 ml-64 p-8">
                {active === "dashboard" && (
                    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-8">
                        <h2 className="text-2xl font-bold mb-6 text-indigo-700 flex items-center gap-2">
                            <FaTachometerAlt /> Tableau de bord
                        </h2>
                        {user ? (
                            <div className="space-y-3">
                                <div>
                                    <span className="font-semibold text-gray-700">Nom :</span> {user.full_name}
                                </div>
                                <div>
                                    <span className="font-semibold text-gray-700">Email :</span> {user.email}
                                </div>
                                <div>
                                    <span className="font-semibold text-gray-700">Rôle :</span> {user.role}
                                </div>
                            </div>
                        ) : (
                            <p>Chargement des informations...</p>
                        )}
                    </div>
                )}

                {active === "chatbots" && (
                    <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-8">
                        <h2 className="text-2xl font-bold mb-6 text-indigo-700 flex items-center gap-2">
                            <FaRobot /> Gestion des Chatbots
                        </h2>
                        {loading ? (
                            <p>Chargement...</p>
                        ) : (
                            <table className="min-w-full border">
                                <thead>
                                    <tr className="bg-indigo-100">
                                        <th className="py-2 px-4 border">Nom</th>
                                        <th className="py-2 px-4 border">Titre</th>
                                        <th className="py-2 px-4 border">Description</th>
                                        <th className="py-2 px-4 border">Solde</th>
                                        <th className="py-2 px-4 border">Statut</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {chatbots.map((bot) => (
                                        <tr key={bot.chatbot_id} className="hover:bg-indigo-50">
                                            <td className="py-2 px-4 border">{bot.chatbot_name}</td>
                                            <td className="py-2 px-4 border">{bot.chatbot_title}</td>
                                            <td className="py-2 px-4 border">{bot.chatbot_description}</td>
                                            <td className="py-2 px-4 border">{bot.solde_total}</td>
                                            <td className="py-2 px-4 border">
                                                {bot.is_active ? (
                                                    <span className="text-green-600 font-semibold">Actif</span>
                                                ) : (
                                                    <span className="text-red-500 font-semibold">Inactif</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {chatbots.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="text-center py-4 text-gray-500">
                                                Aucun chatbot trouvé.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}