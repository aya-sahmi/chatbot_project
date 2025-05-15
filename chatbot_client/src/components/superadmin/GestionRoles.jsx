import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import urlApi from "../../api/axios";

export default function GestionRoles() {
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [assignedPermissions, setAssignedPermissions] = useState([]);
    const [unassignedPermissions, setUnassignedPermissions] = useState([]);
    const [selectedRole, setSelectedRole] = useState(null);
    const [newRoleName, setNewRoleName] = useState("");
    const [selectedPermission, setSelectedPermission] = useState("");
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
    if (successMessage) {
        const timer = setTimeout(() => setSuccessMessage(""), 2000);
        return () => clearTimeout(timer);
    }
}, [successMessage]);

    const fetchRoles = async () => {
        setLoading(true);
        try {
            const response = await urlApi.get("/roles");
            setRoles(response.data || []);
        } catch (error) {
            console.error("Erreur lors de la récupération des rôles :", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPermissions = async () => {
        try {
            const response = await urlApi.get("/roles/permissions");
            setPermissions(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des permissions :", error);
        }
    };

    const fetchRolePermissions = async (roleId) => {
        try {
            const response = await urlApi.get(`/roles/permissions/${roleId}`);
            const assigned = response.data.permissions.map((perm) => ({
                permission_id: perm.permission_id || perm,
                permission_name: perm.permission_name || perm,
            }));
            setAssignedPermissions(assigned);
            const allPermissions = permissions.map((perm) => ({
                permission_id: perm.permission_id,
                permission_name: perm.permission_name,
            }));
            const unassigned = allPermissions.filter(
                (perm) => !response.data.permissions.some((p) => p.permission_id === perm.permission_id || p === perm.permission_id)
            );
            setUnassignedPermissions(unassigned);
        } catch (error) {
            console.error("Erreur lors de la récupération des permissions du rôle :", error);
        }
    };

    useEffect(() => {
        fetchRoles();
        fetchPermissions();
    }, []);

    const handleDeleteRole = async (roleId) => {
        try {
            const response = await urlApi.delete(`/roles/${roleId}`);
            console.log(response);
            fetchRoles();
        } catch (error) {
            console.error("Erreur lors de la suppression/restauration du rôle :", error);
        }
    };

    const handleUnassignPermission = async (roleId, permissionId) => {
        try {
            const data = {
                roleId,
                permissionId,
            };
            const response = await urlApi.post("/roles/unassign-permission", data);
            console.log(response);
            fetchRolePermissions(roleId);
        } catch (error) {
            console.error("Erreur lors de la désassignation de la permission :", error);
            alert(
                `Une erreur s'est produite lors de la désassignation de la permission : ${error.response?.data?.message || error.message}`
            );
        }
    };

    const handleAddRole = async () => {
        if (!newRoleName.trim()) {
            alert("Le nom du rôle est requis.");
            return;
        }
        try {
            const response = await urlApi.post("/roles", { role_name: newRoleName });
            console.log(response);
            setNewRoleName("");
            fetchRoles();
        } catch (error) {
            console.error("Erreur lors de l'ajout du rôle :", error);
        }
    };

    const handleAssignPermission = async () => {
        if (!selectedRole || !selectedPermission) {
            alert("Veuillez sélectionner un rôle et une permission.");
            return;
        }
        try {
            const data = {
                roleId: selectedRole.role_id,
                permissionIds: [selectedPermission],
            };
            const response = await urlApi.post("/roles/assignPermissions", data);
            console.log(response);
            setSuccessMessage("Permission assignée avec succès !");
            fetchRolePermissions(selectedRole.role_id);
        } catch (error) {
            console.error("Erreur lors de l'assignation de la permission :", error);
        }
    };

    const handleManagePermissions = (role) => {
        setSelectedRole(role);
        fetchRolePermissions(role.role_id);
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 ml-64 p-6 bg-gray-100">
                <h1 className="text-2xl font-bold mb-6">Gestion des Rôles</h1>
                <div className="bg-white p-6 shadow-lg rounded-lg mb-6">
                    <h2 className="text-xl font-bold mb-4">Ajouter un Rôle</h2>
                    <div className="flex gap-4">
                        <input type="text" placeholder="Nom du rôle" value={newRoleName} onChange={(e) => setNewRoleName(e.target.value)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"/>
                        <button onClick={handleAddRole} className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg">
                            Ajouter
                        </button>
                    </div>
                </div>
                <div className="bg-white p-6 shadow-lg rounded-lg">
                    <h2 className="text-xl font-bold mb-4">Liste des Rôles</h2>
                    {loading ? (
                        <p>Chargement...</p>
                    ) : (
                        <table className="w-full border-collapse border border-gray-300 text-sm text-left text-gray-700">
                            <thead className="bg-gray-200 text-gray-800">
                                <tr>
                                    <th className="border border-gray-300 py-3 px-4">Nom</th>
                                    <th className="border border-gray-300 py-3 px-4">Statut Suppression</th>
                                    <th className="border border-gray-300 py-3 px-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {roles.map((role) => (
                                    <tr key={role.role_id} className="hover:bg-gray-100">
                                        <td className="border border-gray-300 py-2 px-4">{role.role_name}</td>
                                        <td className={`border border-gray-300 py-2 px-4 text-center font-semibold ${role.is_deleted ? 'text-red-500' : 'text-green-600'}`}>
                                            {role.is_deleted ? 'Supprimé' : 'Non supprimé'}
                                        </td>
                                        <td className="border border-gray-300 py-2 px-4 flex gap-2">
                                            <button onClick={() => handleDeleteRole(role.role_id)}
                                                className={`${
                                                    role.is_deleted
                                                        ? "bg-green-500 hover:bg-green-600"
                                                        : "bg-red-500 hover:bg-red-600"
                                                } text-white py-1 px-2 rounded`}>
                                                {role.is_deleted ? "Restaurer" : "Supprimer"}
                                            </button>
                                            <button onClick={() => handleManagePermissions(role)} className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded">
                                                Gérer Permissions
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
                {selectedRole && (
                    <div className="bg-white p-6 shadow-lg rounded-lg mt-6">
                        <h2 className="text-xl font-bold mb-4">Permissions pour {selectedRole.role_name}</h2>
                        <div className="flex gap-4 mb-4">
                            <select value={selectedPermission} onChange={(e) => setSelectedPermission(e.target.value)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg">
                                <option value="">-- Sélectionner une Permission --</option>
                                {unassignedPermissions.map((permission) => (
                                    <option key={permission.permission_id} value={permission.permission_id}>
                                        {permission.permission_name}
                                    </option>
                                ))}
                            </select>
                            <button onClick={handleAssignPermission} className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg">
                                Assigner
                            </button>
                        </div>
                        <table className="w-full border-collapse border border-gray-300 text-sm text-left text-gray-700">
                            <thead className="bg-gray-200 text-gray-800">
                                <tr>
                                    <th className="border border-gray-300 py-3 px-4">Nom de la Permission</th>
                                    <th className="border border-gray-300 py-3 px-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {assignedPermissions.map((permission) => (
                                    <tr key={permission.permission_id} className="hover:bg-gray-100">
                                        <td className="border border-gray-300 py-2 px-4">{permission.permission_name}</td>
                                        <td className="border border-gray-300 py-2 px-4">
                                            <button onClick={() => handleUnassignPermission(selectedRole.role_id, permission.permission_id)}
                                                className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded">
                                                Désassigner
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button onClick={() => setSelectedRole(null)} className="mt-4 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded">
                            Retour
                        </button>
                    </div>
                )}
                {successMessage && (
                    <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-lg">
                        <strong className="font-bold">Succès !</strong>
                        <span className="block sm:inline ml-2">{successMessage}</span>
                    </div>
                )}
            </div>
        </div>
    );
}