import React, { useEffect, useState } from "react";
import urlApi from "../../api/axios";
import { toast } from "react-toastify";
import { FaPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaSyncAlt } from "react-icons/fa";
import SidebarAgent from "./SidebarAgent";

export default function ChatbotsLiveAgent() {
    const [chatbots, setChatbots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingBot, setEditingBot] = useState(null);
    const [form, setForm] = useState({
        chatbot_name: "",
        chatbot_title: "",
        chatbot_description: "",
        solde_total: "",
        workspace_id: ""
    });

    useEffect(() => {
        fetchChatbots();
    }, []);

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

    const handleActivation = async (id) => {
        try {
            await urlApi.patch(`/chatbots/active-desactive/${id}`);
            toast.success("Statut modifié !");
            fetchChatbots();
        } catch {
            toast.error("Erreur lors du changement de statut");
        }
    };

    const handleDelete = async (id) => {
        try {
            await urlApi.delete(`/chatbots/${id}`);
            toast.success("Chatbot supprimé/restauré !");
            fetchChatbots();
        } catch {
            toast.error("Erreur lors de la suppression/restauration");
        }
    };

    const openModal = (bot = null) => {
        setEditingBot(bot);
        setForm(
            bot? {
                    chatbot_name: bot.chatbot_name,
                    chatbot_title: bot.chatbot_title,
                    chatbot_description: bot.chatbot_description,
                    solde_total: bot.solde_total,
                    workspace_id: bot.workspace_id || ""
                }: {
                    chatbot_name: "",
                    chatbot_title: "",
                    chatbot_description: "",
                    solde_total: "",
                    workspace_id: ""
                }
        );
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingBot(null);
    };

    const handleFormChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingBot) {
                await urlApi.put(`/chatbots/${editingBot.chatbot_id}`, form);
                toast.success("Chatbot modifié !");
            } else {
                await urlApi.post("/chatbots", form);
                toast.success("Chatbot ajouté !");
            }
            closeModal();
            fetchChatbots();
        } catch {
            toast.error("Erreur lors de l'enregistrement");
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <SidebarAgent />
            <div className="flex-1 ml-64 p-8">
                <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-indigo-700 flex items-center gap-2">
                            <FaSyncAlt className="text-indigo-400" /> Gestion des Chatbots
                        </h2>
                        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded" onClick={() => openModal()}>
                            <FaPlus /> Ajouter
                        </button>
                    </div>
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
                                    <th className="py-2 px-4 border">Statut Activation</th>
                                    <th className="py-2 px-4 border">Statut Suppression</th>
                                    <th className="py-2 px-4 border">Actions</th>
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
                                                <span className="text-green-600 font-semibold flex items-center gap-1">
                                                    <FaCheck /> Actif
                                                </span>
                                            ) : (
                                                <span className="text-red-500 font-semibold flex items-center gap-1">
                                                    <FaTimes /> Inactif
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-2 px-4 border">
                                            {bot.is_deleted ? (
                                                <span className="text-red-500 font-semibold flex items-center gap-1">
                                                    <FaTimes /> Supprimé
                                                </span>
                                            ) : (
                                                <span className="text-green-600 font-semibold flex items-center gap-1">
                                                    <FaCheck /> Non supprimé
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-2 px-4 border space-x-1 gap-2">
                                            <button className="text-indigo-600 hover:text-indigo-900" title="Modifier" onClick={() => openModal(bot)}>
                                                <FaEdit />
                                            </button>
                                            <button className="text-yellow-600 hover:text-yellow-900" title={bot.is_active ? "Désactiver" : "Activer"} onClick={() => handleActivation(bot.chatbot_id)}>
                                                <FaSyncAlt />
                                            </button>
                                            <button className="text-red-600 hover:text-red-900" title={bot.is_deleted ? "Restaurer" : "Supprimer"} onClick={() => handleDelete(bot.chatbot_id)}>
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {chatbots.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="text-center py-4 text-gray-500">
                                            Aucun chatbot trouvé.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}

                    {showModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg relative">
                                <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold" onClick={closeModal}>
                                    &times;
                                </button>
                                <h2 className="text-xl font-bold mb-4">
                                    {editingBot ? "Modifier le chatbot" : "Ajouter un chatbot"}
                                </h2>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <input type="text" name="chatbot_name" placeholder="Nom" value={form.chatbot_name} onChange={handleFormChange} required className="input w-full"/>
                                    <input type="text" name="chatbot_title" placeholder="Titre" value={form.chatbot_title} onChange={handleFormChange} required className="input w-full"/>
                                    <input type="text" name="chatbot_description" placeholder="Description" value={form.chatbot_description} onChange={handleFormChange} required className="input w-full"/>
                                    <input type="number" name="solde_total" placeholder="Solde" value={form.solde_total} onChange={handleFormChange} required className="input w-full"/>
                                    <input type="text" name="workspace_id" placeholder="Workspace ID" value={form.workspace_id} onChange={handleFormChange} className="input w-full"/>
                                    <div className="flex justify-end gap-2">
                                        <button type="button" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600" onClick={closeModal}>
                                            Annuler
                                        </button>
                                        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
                                            {editingBot ? "Modifier" : "Ajouter"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}