import React, { useState, useEffect } from "react";
import urlApi from "../../api/axios";
import Sidebar from "./Sidebar";

export default function GestionPermissions() {
    const [permissions, setPermissions] = useState([]);
    const [roles, setRoles] = useState([]);
    const [selectedRole, setSelectedRole] = useState(null);
    const [rolePermissions, setRolePermissions] = useState([]);
    const [newPermission, setNewPermission] = useState("");
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const totalPages = Math.ceil(permissions.length / itemsPerPage);
    const paginatedPermissions = permissions.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const fetchPermissions = async () => {
        setLoading(true);
        try {
            const response = await urlApi.get("/roles/permissions");
            setPermissions(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des permissions :", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRoles = async () => {
        try {
            const response = await urlApi.get("/roles");
            setRoles(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des rôles :", error);
        }
    };

    const addPermission = async () => {
        if (!newPermission.trim()) return;
        try {
            const response = await urlApi.post("/roles/permissions", { permission_name: newPermission });
            setPermissions((prev) => [...prev, response.data[0]]);
            setNewPermission("");
        } catch (error) {
            console.error("Erreur lors de l'ajout de la permission :", error);
        }
    };

    const toggleDeletePermission = async (permissionId) => {
        try {
            await urlApi.delete(`/roles/permissions/${permissionId}`);
            fetchPermissions();
        } catch (error) {
            console.error("Erreur lors du changement de statut :", error);
        }
    };

    const viewPermissionsByRole = async (roleId) => {
        try {
            const response = await urlApi.get(`/roles/permissions/${roleId}`);
            setRolePermissions(response.data.permissions);
            setSelectedRole(roles.find((role) => role.role_id === roleId));
        } catch (error) {
            console.error("Erreur lors de la récupération des permissions :", error);
        }
    };

    const assignPermissionsToRole = async () => {
        try {
            await urlApi.post("/roles/assignPermissions", {
                roleId: selectedRole.role_id,
                permissionIds: selectedPermissions,
            });
            setSelectedPermissions([]);
            viewPermissionsByRole(selectedRole.role_id);
        } catch (error) {
            console.error("Erreur lors de l'affectation des permissions :", error);
        }
    };

    useEffect(() => {
        fetchPermissions();
        fetchRoles();
    }, []);

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 ml-64 p-6 bg-gray-100">
                <h1 className="text-2xl font-bold mb-6">Gestion des Permissions</h1>
                <div className="bg-white p-6 shadow-lg rounded-lg">
                    <h2 className="text-xl font-bold mb-4">Liste des Permissions</h2>
                    {loading ? (
                        <p>Chargement...</p>
                    ) : (
                        <>
                            <table className="w-full border-collapse border border-gray-300 text-sm text-left text-gray-700">
                                <thead className="bg-gray-200 text-gray-800">
                                    <tr>
                                        <th className="border border-gray-300 py-3 px-4">Nom de la Permission</th>
                                        <th className="border border-gray-300 py-3 px-4 text-center">Statut Suppression</th>
                                        <th className="border border-gray-300 py-3 px-4 text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedPermissions.map((permission) => (
                                        <tr key={permission.permission_id} className="hover:bg-gray-100">
                                            <td className="border border-gray-300 py-2 px-4">{permission.permission_name}</td>
                                            <td className="border border-gray-300 py-2 px-4 text-center">
                                                <span className={`px-2 py-1 rounded text-xs font-semibold ${permission.is_deleted ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                                                    {permission.is_deleted ? "Supprimée" : "Active"}
                                                </span>
                                            </td>
                                            <td className="border border-gray-300 py-2 px-4 text-center">
                                                <button onClick={() => toggleDeletePermission(permission.permission_id)}
                                                    className={`px-3 py-1 rounded transition ${
                                                        permission.is_deleted
                                                            ? "bg-green-500 hover:bg-green-600 text-white"
                                                            : "bg-red-500 hover:bg-red-600 text-white"
                                                    }`}>
                                                    {permission.is_deleted ? "Restaurer" : "Supprimer"}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="flex justify-end items-center mt-4 gap-2">
                                <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                                    disabled={currentPage === 1}className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50">
                                    Précédent
                                </button>
                                <span className="text-sm">
                                    Page {currentPage} / {totalPages}
                                </span>
                                <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                                    disabled={currentPage === totalPages}className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50">
                                    Suivant
                                </button>
                            </div>
                        </>
                    )}
                </div>
                <div className="bg-white p-6 shadow-lg rounded-lg mt-6">
                    <h2 className="text-xl font-bold mb-4">Ajouter une Permission</h2>
                    <div className="flex gap-4">
                        <input type="text" value={newPermission} onChange={(e) => setNewPermission(e.target.value)}
                            placeholder="Nom de la permission" className="flex-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                        <button onClick={addPermission} className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg">
                            Ajouter
                        </button>
                    </div>
                </div>
                <div className="bg-white p-6 shadow-lg rounded-lg mt-6">
                    <h2 className="text-xl font-bold mb-4">Assigner des Permissions à un Rôle</h2>
                    <div className="mb-4">
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                            Sélectionner un rôle
                        </label>
                        <select id="role" value={selectedRole?.role_id || ""} onChange={(e) => {const roleId = e.target.value;
                                if (roleId) {
                                    viewPermissionsByRole(roleId);
                                }
                            }}className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                            <option value="">-- Sélectionner un rôle --</option>
                            {roles.map((role) => (
                                <option key={role.role_id} value={role.role_id}>
                                    {role.role_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    {selectedRole && (
                        <div>
                            <h3 className="text-lg font-bold mb-4">
                                Permissions assignées au rôle : {selectedRole.role_name}
                            </h3>
                            <ul className="list-disc pl-6 mb-4">
                                {rolePermissions.map((permission, index) => (
                                    <li key={permission.permission_id || index} className="text-gray-700">
                                        {permission.permission_name || String(permission)}
                                    </li>
                                ))}
                            </ul>
                            <h3 className="text-lg font-bold mb-4">Affecter des Permissions</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {permissions.filter((permission) =>!rolePermissions.some((p) =>
                                    (p.permission_id && p.permission_id === permission.permission_id) || p === permission.permission_name
                                )).map((permission) => (
                                    <label key={permission.permission_id} className="flex items-center">
                                        <input type="checkbox" value={permission.permission_id} onChange={(e) => {
                                                const permissionId = e.target.value;
                                                if (e.target.checked) {
                                                    setSelectedPermissions((prev) => [...prev, permissionId]);
                                                } else {
                                                    setSelectedPermissions((prev) =>
                                                        prev.filter((id) => id !== permissionId)
                                                    );
                                                }
                                            }} className="form-checkbox h-5 w-5 text-blue-600"/>
                                        <span className="ml-2 text-gray-700">{permission.permission_name}</span>
                                    </label>
                                ))}
                            </div>
                            <button onClick={assignPermissionsToRole} className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
                                Enregistrer
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}