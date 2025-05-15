import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import urlApi from "../../api/axios";

export default function GestionWorkspaces() {
    const [workspaces, setWorkspaces] = useState([]);
    const [domaines, setDomaines] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        workspace_name: "",
        domaine_id: "",
        solde_total: "",
    });
    const [editingWorkspace, setEditingWorkspace] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const totalPages = Math.ceil(workspaces.length / itemsPerPage);
    const paginatedWorkspaces = workspaces.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const fetchWorkspaces = async () => {
        setLoading(true);
        try {
            const res = await urlApi.get("/workspaces");
            setWorkspaces(res.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des workspaces :", error);
        } finally {
            setLoading(false);
        }
    };
    const fetchDomaines = async () => {
        try {
            const res = await urlApi.get("/domaines");
            setDomaines(res.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des domaines :", error);
        }
    };

    useEffect(() => {
        fetchWorkspaces();
        fetchDomaines();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingWorkspace) {
                await urlApi.put(`/workspaces/${editingWorkspace.workspace_id}`, formData);
            } else {
                await urlApi.post("/workspaces", formData);
            }
            setFormData({ workspace_name: "", domaine_id: "", solde_total: "" });
            setEditingWorkspace(null);
            setShowModal(false);
            fetchWorkspaces();
        } catch (error) {
            alert(error.response?.data?.error || "Erreur lors de l'enregistrement");
        }
    };

    const openModalForCreate = () => {
        setEditingWorkspace(null);
        setFormData({ workspace_name: "", domaine_id: "", solde_total: "" });
        setShowModal(true);
    };

    const openModalForEdit = (workspace) => {
        setEditingWorkspace(workspace);
        setFormData({
            workspace_name: workspace.workspace_name,
            domaine_id: workspace.domaine_id,
            solde_total: workspace.solde_total,
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setEditingWorkspace(null);
        setFormData({ workspace_name: "", domaine_id: "", solde_total: "" });
        setShowModal(false);
    };

    const handleDelete = async (workspace_id) => {
        try {
            await urlApi.delete(`/workspaces/${workspace_id}`);
            fetchWorkspaces();
        } catch (error) {
            alert(error.response?.data?.error || "Erreur lors de la suppression");
        }
    };

    const toggleActivation = async (workspace_id) => {
        try {
            await urlApi.patch(`/workspaces/activate/${workspace_id}`);
            fetchWorkspaces();
        } catch (error) {
            alert(error.response?.data?.error || "Erreur lors du changement de statut");
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 ml-64 p-6 bg-gray-100">
                <h1 className="text-2xl font-bold mb-4">Gestion des Workspaces</h1>
                <button onClick={openModalForCreate} className="mb-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Ajouter un Workspace
                </button>
                <div className="overflow-x-auto">
                    <table className="table-auto w-full bg-white rounded shadow">
                        <thead className="bg-gray-200 text-gray-700">
                            <tr>
                                <th className="px-4 py-2">Nom</th>
                                <th className="px-4 py-2">Domaine</th>
                                <th className="px-4 py-2">Solde</th>
                                <th className="px-4 py-2">Statut</th>
                                <th className="px-4 py-2">Suppression</th>
                                <th className="px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-4">Chargement...</td>
                                </tr>
                            ) : (
                                paginatedWorkspaces.map((ws) => (
                                    <tr key={ws.workspace_id} className="border-t text-center">
                                        <td className="px-4 py-2">{ws.workspace_name}</td>
                                        <td className="px-4 py-2">
                                            {domaines.find(d => d.domaine_id === ws.domaine_id)?.domaine_name || ws.domaine_id}
                                        </td>
                                        <td className="px-4 py-2">{ws.solde_total}</td>
                                        <td className="px-4 py-2">{ws.is_active ? "Actif" : "Désactivé"}</td>
                                        <td className="px-4 py-2">{ws.is_deleted ? "Supprimé" : "Restauré"}</td>
                                        <td className="px-4 py-2 flex flex-col gap-1">
                                            <button onClick={() => openModalForEdit(ws)} className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-2 rounded">Modifier</button>
                                            <button onClick={() => handleDelete(ws.workspace_id)} className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded">
                                                {ws.is_deleted ? "Restaurer" : "Supprimer"}
                                            </button>
                                            <button onClick={() => toggleActivation(ws.workspace_id)} className={`${ws.is_active ? "bg-gray-600" : "bg-green-600"} hover:opacity-90 text-white py-1 px-2 rounded`}>
                                                {ws.is_active ? "Désactiver" : "Activer"}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                    <div className="flex justify-end items-center mt-4 gap-2">
                        <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50">
                            Précédent
                        </button>
                        <span className="text-sm">
                            Page {currentPage} / {totalPages}
                        </span>
                        <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50">
                            Suivant
                        </button>
                    </div>
                </div>
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                        <div className="bg-white rounded shadow-lg w-full max-w-lg p-6 relative">
                            <button onClick={closeModal} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold">
                                &times;
                            </button>
                            <h2 className="text-xl font-bold mb-4">
                                {editingWorkspace ? "Modifier le Workspace" : "Ajouter un Workspace"}
                            </h2>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label htmlFor="workspace_name" className="block text-gray-700 font-bold mb-2">Nom du Workspace</label>
                                    <input type="text" name="workspace_name" value={formData.workspace_name} onChange={handleInputChange}
                                        className="w-full border rounded py-2 px-3 shadow focus:outline-none focus:shadow-outline" required />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="domaine_id" className="block text-gray-700 font-bold mb-2">Domaine</label>
                                    <select name="domaine_id" value={formData.domaine_id} onChange={handleInputChange}
                                        className="w-full border rounded py-2 px-3 shadow focus:outline-none focus:shadow-outline" required>
                                        <option value="">-- Sélectionner un domaine --</option>
                                        {domaines.map((d) => (
                                            <option key={d.domaine_id} value={d.domaine_id}>{d.domaine_name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="solde_total" className="block text-gray-700 font-bold mb-2">Solde Total</label>
                                    <input type="number" name="solde_total" value={formData.solde_total} onChange={handleInputChange}
                                        className="w-full border rounded py-2 px-3 shadow focus:outline-none focus:shadow-outline" required />
                                </div>
                                <div className="mt-4 flex gap-4">
                                    <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                                        {editingWorkspace ? "Mettre à jour" : "Créer"}
                                    </button>
                                    <button type="button" onClick={closeModal} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">
                                        Annuler
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}