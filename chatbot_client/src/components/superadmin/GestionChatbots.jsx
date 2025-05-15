import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import urlApi from "../../api/axios";

export default function GestionChatbots() {
    const [chatbots, setChatbots] = useState([]);
    const [workspaces, setWorkspaces] = useState([]);
    const [formData, setFormData] = useState({
        chatbot_name: "",
        chatbot_title: "",
        chatbot_description: "",
        workspace_id: "",
        solde_total: 0,
    });
    const [editingChatbot, setEditingChatbot] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const fetchChatbots = async () => {
        setLoading(true);
        try {
            const response = await urlApi.get("/chatbots");
            setChatbots(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des chatbots :", error);
        } finally {
            setLoading(false);
        }
    };
    const fetchWorkspaces = async () => {
        try {
            const response = await urlApi.get("/workspaces");
            setWorkspaces(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des workspaces :", error);
        }
    };

    useEffect(() => {
        fetchChatbots();
        fetchWorkspaces();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingChatbot) {
                await urlApi.put(`/chatbots/${editingChatbot.chatbot_id}`, formData);
            } else {
                await urlApi.post("/chatbots", formData);
            }
            fetchChatbots();
            closeModal();
        } catch (error) {
            console.error("Erreur lors de l'enregistrement du chatbot :", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await urlApi.delete(`/chatbots/${id}`);
            fetchChatbots();
        } catch (error) {
            console.error("Erreur lors de la suppression du chatbot :", error);
        }
    };

    const toggleActivation = async (id) => {
        try {
            await urlApi.patch(`/chatbots/active-desactive/${id}`);
            fetchChatbots();
        } catch (error) {
            console.error("Erreur lors de l'activation/désactivation du chatbot :", error);
        }
    };

    const openModalForCreate = () => {
        setEditingChatbot(null);
        setFormData({
            chatbot_name: "",
            chatbot_title: "",
            chatbot_description: "",
            workspace_id: "",
            solde_total: 0,
        });
        setShowModal(true);
    };

    const openModalForEdit = (chatbot) => {
        setEditingChatbot(chatbot);
        setFormData({
            chatbot_name: chatbot.chatbot_name,
            chatbot_title: chatbot.chatbot_title,
            chatbot_description: chatbot.chatbot_description,
            workspace_id: chatbot.workspace_id,
            solde_total: chatbot.solde_total,
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setEditingChatbot(null);
        setFormData({
            chatbot_name: "",
            chatbot_title: "",
            chatbot_description: "",
            workspace_id: "",
            solde_total: 0,
        });
        setShowModal(false);
    };

    const getWorkspaceName = (workspace_id) => {
        const workspace = workspaces.find((workspace) => workspace.workspace_id === workspace_id);
        return workspace ? workspace.workspace_name : "Non défini";
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 ml-64 p-6 bg-gray-100">
                <h1 className="text-2xl font-bold mb-6">Gestion des Chatbots</h1>
                <button onClick={openModalForCreate} className="mb-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Ajouter un Chatbot
                </button>
                <div className="bg-white p-6 shadow-lg rounded-lg">
                    <h2 className="text-xl font-bold mb-4">Liste des Chatbots</h2>
                    {loading ? (
                        <p>Chargement...</p>
                    ) : (
                        <table className="w-full border-collapse border border-gray-300 text-sm text-left text-gray-700">
                            <thead className="bg-gray-200 text-gray-800 text-center">
                                <tr>
                                    <th className="border border-gray-300 py-3 px-4">Nom</th>
                                    <th className="border border-gray-300 py-3 px-4">Titre</th>
                                    <th className="border border-gray-300 py-3 px-4">Description</th>
                                    <th className="border border-gray-300 py-3 px-4">Solde</th>
                                    <th className="border border-gray-300 py-3 px-4">Workspace</th>
                                    <th className="border border-gray-300 py-3 px-4">Statut Suppression</th>
                                    <th className="border border-gray-300 py-3 px-4">Statut Activation</th>
                                    <th className="border border-gray-300 py-3 px-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {chatbots.map((chatbot) => (
                                    <tr key={chatbot.chatbot_id} className="hover:bg-gray-100">
                                        <td className="border border-gray-300 py-2 px-4">{chatbot.chatbot_name}</td>
                                        <td className="border border-gray-300 py-2 px-4">{chatbot.chatbot_title}</td>
                                        <td className="border border-gray-300 py-2 px-4">{chatbot.chatbot_description}</td>
                                        <td className="border border-gray-300 py-2 px-4">{chatbot.solde_total}</td>
                                        <td className="border border-gray-300 py-2 px-4">{getWorkspaceName(chatbot.workspace_id)}</td>
                                        <td className={`border border-gray-300 py-2 px-4 text-center font-semibold ${chatbot.is_deleted ? 'text-red-500' : 'text-green-600'}`}>
                                            {chatbot.is_deleted ? 'Supprimé' : 'Non supprimé'}
                                        </td>
                                        <td className={`border border-gray-300 py-2 px-4 text-center font-semibold ${chatbot.is_active ? 'text-green-600' : 'text-red-500'}`}>
                                            {chatbot.is_active ? 'Actif' : 'Non actif'}
                                        </td>
                                        <td className="border border-gray-300 py-2 px-4 flex gap-2">
                                            <button onClick={() => openModalForEdit(chatbot)} className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-2 rounded">
                                                Modifier
                                            </button>
                                            <button onClick={() => handleDelete(chatbot.chatbot_id)}
                                                className={`${chatbot.is_deleted? "bg-green-500 hover:bg-green-600": "bg-red-500 hover:bg-red-600"} text-white py-1 px-2 rounded`}>
                                                {chatbot.is_deleted ? "Restaurer" : "Supprimer"}
                                            </button>
                                            <button onClick={() => toggleActivation(chatbot.chatbot_id)}
                                                className={`${chatbot.is_active? "bg-yellow-500 hover:bg-yellow-600": "bg-green-500 hover:bg-green-600"} text-white py-1 px-2 rounded`}>
                                                {chatbot.is_active ? "Désactiver" : "Activer"}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                        <div className="bg-white rounded shadow-lg w-full max-w-lg p-6 relative">
                            <button onClick={closeModal} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold">
                                &times;
                            </button>
                            <h2 className="text-xl font-bold mb-4">
                                {editingChatbot ? "Modifier le Chatbot" : "Ajouter un Chatbot"}
                            </h2>
                            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                                <input type="text" name="chatbot_name" placeholder="Nom" value={formData.chatbot_name} onChange={handleInputChange} className="px-4 py-2 border border-gray-300 rounded-lg col-span-2" required/>
                                <input type="text" name="chatbot_title" placeholder="Titre" value={formData.chatbot_title} onChange={handleInputChange} className="px-4 py-2 border border-gray-300 rounded-lg col-span-2" required/>
                                <input type="text" name="chatbot_description" placeholder="Description" value={formData.chatbot_description} onChange={handleInputChange} className="px-4 py-2 border border-gray-300 rounded-lg col-span-2" required/>
                                <select name="workspace_id" value={formData.workspace_id} onChange={handleInputChange} className="px-4 py-2 border border-gray-300 rounded-lg col-span-2" required>
                                    <option value="">-- Sélectionner un Workspace --</option>
                                    {workspaces.map((workspace) => (
                                        <option key={workspace.workspace_id} value={workspace.workspace_id}>
                                            {workspace.workspace_name}
                                        </option>
                                    ))}
                                </select>
                                <input type="number" name="solde_total" placeholder="Solde" value={formData.solde_total} onChange={handleInputChange} className="px-4 py-2 border border-gray-300 rounded-lg col-span-2" required/>
                                <button type="submit" className="col-span-2 bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg">
                                    {editingChatbot ? "Mettre à jour" : "Ajouter"}
                                </button>
                                <button type="button" onClick={closeModal} className="col-span-2 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg">
                                    Annuler
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}