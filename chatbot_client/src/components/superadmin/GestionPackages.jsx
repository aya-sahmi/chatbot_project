import React, { useState, useEffect } from "react";
import urlApi from '../../api/axios';
import Sidebar from "./Sidebar";

export default function GestionPackages() {
    const [packages, setPackages] = useState([]);
    const [formData, setFormData] = useState({
        package_name: "",
        package_description: "",
        number_workspace: 0,
        number_chatbot: 0,
        number_domaine: 0,
        solde_total: 0,
    });
    const [editingPackage, setEditingPackage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const fetchPackages = async () => {
        setLoading(true);
        try {
            const response = await urlApi.get('/packages');
            setPackages(response.data);
        } catch (error) {
            console.error("Error fetching packages:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPackages();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingPackage) {
                await urlApi.put(`/packages/${editingPackage.package_id}`, formData);
            } else {
                await urlApi.post('/packages', formData);
            }
            fetchPackages();
            closeModal();
        } catch (error) {
            console.error("Error saving package:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await urlApi.delete(`/packages/${id}`);
            fetchPackages();
        } catch (error) {
            console.error("Error deleting package:", error);
        }
    };

    const toggleActivation = async (id) => {
        try {
            await urlApi.patch(`/packages/active-desactive/${id}`);
            fetchPackages();
        } catch (error) {
            console.error("Error toggling activation:", error);
        }
    };

    const openModalForCreate = () => {
        setEditingPackage(null);
        setFormData({
            package_name: "",
            package_description: "",
            number_workspace: 0,
            number_chatbot: 0,
            number_domaine: 0,
            solde_total: 0,
        });
        setShowModal(true);
    };

    const openModalForEdit = (pkg) => {
        setEditingPackage(pkg);
        setFormData({
            package_name: pkg.package_name,
            package_description: pkg.package_description,
            number_workspace: pkg.number_workspace,
            number_chatbot: pkg.number_chatbot,
            number_domaine: pkg.number_domaine,
            solde_total: pkg.solde_total,
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingPackage(null);
        setFormData({
            package_name: "",
            package_description: "",
            number_workspace: 0,
            number_chatbot: 0,
            number_domaine: 0,
            solde_total: 0,
        });
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 ml-64 p-6 bg-gray-100">
                <h1 className="text-2xl font-bold mb-4">Gestion des Packages</h1>
                <button onClick={openModalForCreate} className="mb-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Ajouter un Package
                </button>
                <div className="overflow-x-auto">
                    <table className="table-auto w-full bg-white rounded shadow">
                        <thead className="bg-gray-200 text-gray-700">
                            <tr>
                                <th className="px-4 py-2">Nom</th>
                                <th className="px-4 py-2">Description</th>
                                <th className="px-4 py-2">Espaces</th>
                                <th className="px-4 py-2">Chatbots</th>
                                <th className="px-4 py-2">Domaines</th>
                                <th className="px-4 py-2">Solde</th>
                                <th className="px-4 py-2">Statut</th>
                                <th className="px-4 py-2">Suppression</th>
                                <th className="px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="9" className="text-center py-4">Chargement...</td>
                                </tr>
                            ) : (
                                packages.map((pkg) => (
                                    <tr key={pkg.package_id} className="border-t text-center">
                                        <td className="px-4 py-2">{pkg.package_name}</td>
                                        <td className="px-4 py-2">{pkg.package_description}</td>
                                        <td className="px-4 py-2">{pkg.number_workspace}</td>
                                        <td className="px-4 py-2">{pkg.number_chatbot}</td>
                                        <td className="px-4 py-2">{pkg.number_domaine}</td>
                                        <td className="px-4 py-2">{pkg.solde_total}</td>
                                        <td className="px-4 py-2">{pkg.is_active ? "Actif" : "Désactivé"}</td>
                                        <td className="px-4 py-2">{pkg.is_deleted ? "Supprimé" : "Restauré"}</td>
                                        <td className="px-4 py-2 flex flex-col gap-1">
                                            <button onClick={() => openModalForEdit(pkg)}
                                                className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-2 rounded">Modifier</button>
                                            <button onClick={() => handleDelete(pkg.package_id)}
                                                className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded">
                                                {pkg.is_deleted ? "Restaurer" : "Supprimer"}
                                            </button>
                                            <button onClick={() => toggleActivation(pkg.package_id)}
                                                className={`${pkg.is_active ? "bg-gray-600" : "bg-green-600"} hover:opacity-90 text-white py-1 px-2 rounded`}>
                                                {pkg.is_active ? "Désactiver" : "Activer"}
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
                                {editingPackage ? "Modifier le Package" : "Ajouter un Package"}
                            </h2>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label htmlFor="package_name" className="block text-gray-700 font-bold mb-2">Nom du Package</label>
                                    <input type="text" name="package_name" value={formData.package_name} onChange={handleInputChange}
                                        className="w-full border rounded py-2 px-3 shadow focus:outline-none focus:shadow-outline" required />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="package_description" className="block text-gray-700 font-bold mb-2">Description</label>
                                    <textarea name="package_description" value={formData.package_description} onChange={handleInputChange}
                                        className="w-full border rounded py-2 px-3 shadow focus:outline-none focus:shadow-outline" required />
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2">Espaces de Travail</label>
                                        <input type="number" name="number_workspace" value={formData.number_workspace} onChange={handleInputChange}
                                            className="w-full border rounded py-2 px-3" required />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2">Chatbots</label>
                                        <input type="number" name="number_chatbot" value={formData.number_chatbot} onChange={handleInputChange}
                                            className="w-full border rounded py-2 px-3" required />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2">Domaines</label>
                                        <input type="number" name="number_domaine" value={formData.number_domaine} onChange={handleInputChange}
                                            className="w-full border rounded py-2 px-3" required />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2">Solde Total</label>
                                        <input type="number" name="solde_total" value={formData.solde_total} onChange={handleInputChange}
                                            className="w-full border rounded py-2 px-3" required />
                                    </div>
                                </div>
                                <div className="mt-4 flex gap-4">
                                    <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                                        {editingPackage ? "Mettre à jour" : "Créer"}
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