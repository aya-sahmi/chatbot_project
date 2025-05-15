import React, { useState, useEffect } from "react";
import urlApi from '../../api/axios';
import Sidebar from "./Sidebar";

export default function GestionDomaines() {
    const [domaines, setDomaines] = useState([]);
    const [workspaces, setWorkspaces] = useState([]);
    const [formData, setFormData] = useState({
        domaine_name: "",
        domaine_description: "",
        solde_total: 0,
    });
    const [workspaceData, setWorkspaceData] = useState({
        domaine_id: "",
        tokens: 0,
        workspaceIds: [],
    });
    const [editingDomaine, setEditingDomaine] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const fetchDomaines = async () => {
        setLoading(true);
        try {
            const response = await urlApi.get('/domaines');
            setDomaines(response.data);
        } catch (error) {
            console.error("Error fetching domaines:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchWorkspacesByDomaine = async (domaineId) => {
        try {
            const response = await urlApi.get(`/workspaces?domaine_id=${domaineId}`);
            setWorkspaces(response.data);
        } catch (error) {
            console.error("Error fetching workspaces:", error);
        }
    };

    useEffect(() => {
        fetchDomaines();
    }, []);

    useEffect(() => {
        if (workspaceData.domaine_id) {
            fetchWorkspacesByDomaine(workspaceData.domaine_id);
        } else {
            setWorkspaces([]);
        }
    }, [workspaceData.domaine_id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleWorkspaceInputChange = (e) => {
        const { name, value } = e.target;
        setWorkspaceData({ ...workspaceData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingDomaine) {
                await urlApi.put(`/domaines/${editingDomaine.domaine_id}`, formData);
            } else {
                await urlApi.post('/domaines', formData);
            }
            fetchDomaines();
            closeModal();
        } catch (error) {
            console.error("Error saving domaine:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await urlApi.delete(`/domaines/${id}`);
            fetchDomaines();
        } catch (error) {
            console.error("Error deleting domaine:", error);
        }
    };

    const toggleActivation = async (id) => {
        try {
            await urlApi.patch(`/domaines/active-desactive/${id}`);
            fetchDomaines();
        } catch (error) {
            console.error("Error toggling activation:", error);
        }
    };

    const openModalForCreate = () => {
        setEditingDomaine(null);
        setFormData({
            domaine_name: "",
            domaine_description: "",
            solde_total: 0,
        });
        setShowModal(true);
    };

    const openModalForEdit = (domaine) => {
        setEditingDomaine(domaine);
        setFormData({
            domaine_name: domaine.domaine_name,
            domaine_description: domaine.domaine_description,
            solde_total: domaine.solde_total,
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingDomaine(null);
        setFormData({
            domaine_name: "",
            domaine_description: "",
            solde_total: 0,
        });
    };

    const assignSolde = async (e) => {
        e.preventDefault();
        try {
            const { domaine_id, tokens, workspaceIds } = workspaceData;
            await urlApi.post('/domaines/assign-solde-to-workspaces', { domaine_id, tokens, workspaceIds });
            fetchDomaines();
            setWorkspaceData({
                domaine_id: "",
                tokens: 0,
                workspaceIds: [],
            });
        } catch (error) {
            console.error("Error assigning solde:", error);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 ml-64 p-6 bg-gray-100">
                <h1 className="text-2xl font-bold mb-4">Gestion des Domaines</h1>
                <button
                    onClick={openModalForCreate}
                    className="mb-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Ajouter un Domaine
                </button>
                <div className="overflow-x-auto">
                    <table className="table-auto w-full bg-white rounded shadow">
                        <thead className="bg-gray-200 text-gray-700">
                            <tr>
                                <th className="px-4 py-2">Nom</th>
                                <th className="px-4 py-2">Description</th>
                                <th className="px-4 py-2">Solde</th>
                                <th className="px-4 py-2">Statut Supression</th>
                                <th className="px-4 py-2">Statut Activation</th>
                                <th className="px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (<tr>
                                    <td colSpan="6" className="text-center py-4">Chargement...</td>
                                </tr>) : (
                                domaines.map((domaine) => (
                                    <tr key={domaine.domaine_id} className="border-t text-center">
                                        <td className="px-4 py-2">{domaine.domaine_name}</td>
                                        <td className="px-4 py-2">{domaine.domaine_description}</td>
                                        <td className="px-4 py-2">{domaine.solde_total}</td>
                                        <td className="px-4 py-2">{domaine.is_deleted ? "Supprimé" : "Non supprimé"}</td>
                                        <td className="px-4 py-2">{domaine.is_active ? "Actif" : "Désactivé"}</td>
                                        <td className="px-4 py-2 flex flex-col gap-1">
                                            <button onClick={() => openModalForEdit(domaine)}
                                                className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-2 rounded">Modifier</button>
                                            <button onClick={() => handleDelete(domaine.domaine_id)}
                                                className={`${domaine.is_deleted ? "bg-green-600" : "bg-red-600"} hover:opacity-90 text-white py-1 px-2 rounded`}>
                                                {domaine.is_deleted ? "Restaurer" : "Supprimer"}
                                            </button>
                                            <button onClick={() => toggleActivation(domaine.domaine_id)}
                                                className={`${domaine.is_active ? "bg-gray-600" : "bg-green-600"} hover:opacity-90 text-white py-1 px-2 rounded`}>
                                                {domaine.is_active ? "Désactiver" : "Activer"}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                        <div className="bg-white rounded shadow-lg w-full max-w-lg p-6 relative">
                            <button onClick={closeModal} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold">
                                &times;
                            </button>
                            <h2 className="text-xl font-bold mb-4">
                                {editingDomaine ? "Modifier le Domaine" : "Ajouter un Domaine"}
                            </h2>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label htmlFor="domaine_name" className="block text-gray-700 font-bold mb-2">Nom du Domaine</label>
                                    <input type="text" name="domaine_name" value={formData.domaine_name} onChange={handleInputChange}
                                        className="w-full border rounded py-2 px-3 shadow focus:outline-none focus:shadow-outline" required />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="domaine_description" className="block text-gray-700 font-bold mb-2">Description</label>
                                    <textarea name="domaine_description" value={formData.domaine_description} onChange={handleInputChange}
                                        className="w-full border rounded py-2 px-3 shadow focus:outline-none focus:shadow-outline" required />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="solde_total" className="block text-gray-700 font-bold mb-2">Solde Total</label>
                                    <input type="number" name="solde_total" value={formData.solde_total} onChange={handleInputChange}
                                        className="w-full border rounded py-2 px-3 shadow focus:outline-none focus:shadow-outline" required />
                                </div>
                                <div className="mt-4 flex gap-4">
                                    <button type="submit"
                                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                                        {editingDomaine ? "Mettre à jour" : "Créer"}
                                    </button>
                                    <button type="button" onClick={closeModal} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">
                                        Annuler
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                <div className="overflow-x-auto">
                    <h2 className="text-xl font-bold mb-4 mt-6">Attribuer un Solde aux Espaces de Travail</h2>
                    <form onSubmit={assignSolde} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-6">
                        <div className="mb-4">
                            <label htmlFor="domaine_id" className="block text-gray-700 font-bold mb-2">Domaine</label>
                            <select name="domaine_id" value={workspaceData.domaine_id} onChange={handleWorkspaceInputChange}
                                className="w-full border rounded py-2 px-3 shadow focus:outline-none focus:shadow-outline" required>
                                <option value="">Sélectionnez un domaine</option>
                                {domaines.map((domaine) => (
                                    <option key={domaine.domaine_id} value={domaine.domaine_id}>
                                        {domaine.domaine_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="tokens" className="block text-gray-700 font-bold mb-2">Montant à Attribuer</label>
                            <input type="number" name="tokens" value={workspaceData.tokens} onChange={handleWorkspaceInputChange}
                                className="w-full border rounded py-2 px-3 shadow focus:outline-none focus:shadow-outline" required />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="workspaceIds" className="block text-gray-700 font-bold mb-2">Espaces de Travail</label>
                            <div className="flex flex-col">
                                {workspaces.map((workspace) => (
                                    <label key={workspace.workspace_id} className="inline-flex items-center">
                                        <input type="checkbox" value={workspace.workspace_id} checked={workspaceData.workspaceIds.includes(workspace.workspace_id)}
                                            onChange={(e) => {
                                                const selectedWorkspaceId = e.target.value;
                                                const isChecked = e.target.checked;
                                                setWorkspaceData((prevData) => {
                                                    const updatedWorkspaceIds = isChecked
                                                        ? [...prevData.workspaceIds, selectedWorkspaceId]
                                                        : prevData.workspaceIds.filter((id) => id !== selectedWorkspaceId);
                                                    return { ...prevData, workspaceIds: updatedWorkspaceIds };
                                                });
                                            }}
                                            className="form-checkbox h-5 w-5 text-blue-600"/>
                                        <span className="ml-2">{workspace.workspace_name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <button type="submit" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
                            Attribuer
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}