import React, { useState, useEffect } from 'react';
import urlApi from '../../api/axios';
import { toast } from 'react-toastify';
import Sidebar from './Sidebar';

export default function GestionsUsers() {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [domains, setDomains] = useState([]);
    const [packages, setPackages] = useState([]);
    const [workspaces, setWorkspaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [roleDropDown, setRoleDropdown] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [editingUser, setEditingUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        full_name: '',
        age: '',
        domaine_id: '',
        package_id: '',
        solde_total: '',
        email: '',
        password: '',
    });
    const [menuUserId, setMenuUserId] = useState(null);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [assignType, setAssignType] = useState('');
    const [selectedAssignId, setSelectedAssignId] = useState('');
    const [currentUserId, setCurrentUserId] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [usersRes, rolesRes, domainsRes, packagesRes, workspacesRes] = await Promise.all([
                urlApi.get('/users'),
                urlApi.get('/roles'),
                urlApi.get('/domaines'),
                urlApi.get('/packages'),
                urlApi.get('/workspaces'),
            ]);
            setUsers(usersRes.data);
            setRoles(rolesRes.data);
            setDomains(domainsRes.data);
            setPackages(packagesRes.data);
            setWorkspaces(workspacesRes.data);
        } catch (error) {
            console.error("Erreur lors du chargement des données", error);
            toast.error("Erreur lors du chargement des données");
        } finally {
            setLoading(false);
        }
    };

    const toggleActivation = async (id) => {
        try {
            await urlApi.patch(`/users/activeDesactiveUser/${id}`);
            toast.success("Statut d'activation modifié");
            fetchData();
        } catch {
            toast.error("Erreur de mise à jour");
        }
    };

    const toggleDeletion = async (id) => {
        try {
            await urlApi.delete(`/users/${id}`);
            toast.success("Statut de suppression modifié");
            fetchData();
        } catch {
            toast.error("Erreur de suppression/restauration");
        }
    };

    const assignRole = async (roleId) => {
        try {
            await urlApi.post('/users/assignRole', {
                userId: selectedUser.user_id,
                roleId,
            });
            toast.success("Rôle assigné");
            setRoleDropdown(false);
            fetchData();
        } catch {
            toast.error("Erreur lors de l’assignation");
        }
    };

    const openModalForCreate = () => {
        setEditingUser(null);
        setFormData({
            full_name: '',
            age: '',
            domaine_id: '',
            package_id: '',
            solde_total: '',
            email: '',
            password: '',
        });
        setShowModal(true);
    };

    const openModalForEdit = (user) => {
        setEditingUser(user);
        setFormData({
            full_name: user.full_name,
            age: user.age,
            domaine_id: user.domaine_id,
            package_id: user.package_id,
            solde_total: user.solde_total,
            email: '',
            password: '',
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setEditingUser(null);
        setFormData({
            full_name: '',
            age: '',
            domaine_id: '',
            package_id: '',
            solde_total: '',
            email: '',
            password: '',
        });
        setShowModal(false);
    };

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingUser) {
                await urlApi.put(`/users/${editingUser.user_id}`, formData);
                toast.success("Utilisateur modifié avec succès");
            } else {
                await urlApi.post('/users', formData);
                toast.success("Utilisateur ajouté avec succès");
            }
            closeModal();
            fetchData();
        } catch {
            toast.error("Erreur lors de l'enregistrement");
        }
    };

    const handleAssign = async () => {
        try {
            if (assignType === 'package') {
                const res = await urlApi.post('/users/assignPackageToUsers', {
                    packageId: selectedAssignId,
                    usersId: [currentUserId],
                });
                console.log('Réponse API:', res.data);
                toast.success("Package affecté !");
            } else if (assignType === 'domaine') {
                await urlApi.post('/users/assign-domaine', {
                    domaineId: selectedAssignId,
                    usersId: [currentUserId],
                });
                toast.success("Domaine affecté !");
            } else if (assignType === 'workspace') {
                await urlApi.post('/users/assignworkspacetouser', {
                    workspaceID: selectedAssignId,
                    userID: [currentUserId],
                });
                toast.success("Workspace affecté !");
            }
            setShowAssignModal(false);
            setSelectedAssignId('');
            fetchData();
        } catch(error) {
            console.error("Erreur lors de l'affectation", error?.response?.data || error);
            toast.error("Erreur lors de l'affectation");
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 ml-64 p-6 bg-gray-100">
                <h1 className="text-3xl text-center font-bold mb-8 text-gray-800">Gestion des utilisateurs</h1>
                <button
                    onClick={openModalForCreate}
                    className="mb-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Ajouter un utilisateur
                </button>
                {loading ? (
                    <p className="text-gray-600">Chargement...</p>
                ) : (
                    <div className="overflow-x-auto rounded-xl shadow-lg bg-white p-3">
                        <h1 className="text-3xl font-bold mb-8 text-gray-800">Liste des utilisateurs</h1>
                        <table className="min-w-full border-collapse border border-gray-300 text-sm text-left text-gray-700">
                            <thead className="bg-gray-200 text-gray-800">
                                <tr>
                                    <th className="border border-gray-300 py-3 px-4 text-center">Nom complet</th>
                                    <th className="border border-gray-300 py-3 px-4 text-center">Âge</th>
                                    <th className="border border-gray-300 py-3 px-4 text-center">Domaine</th>
                                    <th className="border border-gray-300 py-3 px-4 text-center">Package</th>
                                    <th className="border border-gray-300 py-3 px-4 text-center">Rôle</th>
                                    <th className="border border-gray-300 py-3 px-4 text-center">Workspace</th>
                                    <th className="border border-gray-300 py-3 px-4 text-center">Solde total</th>
                                    <th className="border border-gray-300 py-3 px-4 text-center">Suppression</th>
                                    <th className="border border-gray-300 py-3 px-4 text-center">Activation</th>
                                    <th className="border border-gray-300 py-3 px-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.user_id} className="hover:bg-gray-100">
                                        <td className="border border-gray-300 py-2 px-4 text-center">{user.full_name}</td>
                                        <td className="border border-gray-300 py-2 px-4 text-center">{user.age}</td>
                                        <td className="border border-gray-300 py-2 px-4 text-center">{user.domaine_name || '—'}</td>
                                        <td className="border border-gray-300 py-2 px-4 text-center">{user.package_name || '—'}</td>
                                        <td className="border border-gray-300 py-2 px-4 text-center">{user.role_name || '—'}</td>
                                        <td className="border border-gray-300 py-2 px-4 text-center">{user.workspace_name || '—'}</td>
                                        <td className="border border-gray-300 py-2 px-4 text-center">{user.solde_total || '—'}</td>
                                        <td className={`border border-gray-300 py-2 px-4 text-center font-semibold ${user.is_deleted ? 'text-red-500' : 'text-green-600'}`}>
                                            {user.is_deleted ? 'Supprimé' : 'Non supprimé'}
                                        </td>
                                        <td className={`border border-gray-300 py-2 px-4 text-center font-semibold ${user.is_active ? 'text-green-600' : 'text-red-500'}`}>
                                            {user.is_active ? 'Actif' : 'Non actif'}
                                        </td>
                                        <td className="border border-gray-300 py-2 px-4 text-center relative">
                                            <div className="inline-block text-left">
                                                <button onClick={() => setMenuUserId(menuUserId === user.user_id ? null : user.user_id)}
                                                    className="p-2 rounded-full hover:bg-gray-200" title="Plus d'options" >
                                                    <span className="flex flex-col items-center justify-center">
                                                        <span className="block w-1 h-1 bg-gray-700 rounded-full mb-0.5"></span>
                                                        <span className="block w-1 h-1 bg-gray-700 rounded-full mb-0.5"></span>
                                                        <span className="block w-1 h-1 bg-gray-700 rounded-full"></span>
                                                    </span>
                                                </button>
                                                {menuUserId === user.user_id && (
                                                    <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                                                        <div className="py-1">
                                                            <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"onClick={() => {
                                                                    openModalForEdit(user);
                                                                    setMenuUserId(null);
                                                                }}>
                                                                Modifier
                                                            </button>
                                                            <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100" onClick={() => {
                                                                    toggleDeletion(user.user_id);
                                                                    setMenuUserId(null);
                                                                }}>
                                                                {user.is_deleted ? 'Restaurer' : 'Supprimer'}
                                                            </button>
                                                            <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100" onClick={() => {
                                                                    toggleActivation(user.user_id);
                                                                    setMenuUserId(null);
                                                                }}>
                                                                {user.is_active ? 'Désactiver' : 'Activer'}
                                                            </button>
                                                            <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100" onClick={() => {
                                                                    setSelectedUser(user);
                                                                    setRoleDropdown(true);
                                                                    setMenuUserId(null);
                                                                }}>
                                                                Affecter rôle
                                                            </button>
                                                            <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100" onClick={() => {
                                                                    setAssignType('package');
                                                                    setCurrentUserId(user.user_id);
                                                                    setShowAssignModal(true);
                                                                    setMenuUserId(null);
                                                                }}>
                                                                Affecter à un package
                                                            </button>
                                                            <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100" onClick={() => {
                                                                    setAssignType('domaine');
                                                                    setCurrentUserId(user.user_id);
                                                                    setShowAssignModal(true);
                                                                    setMenuUserId(null);
                                                                }}>
                                                                Affecter à un domaine
                                                            </button>
                                                            <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100" onClick={() => {
                                                                    setAssignType('workspace');
                                                                    setCurrentUserId(user.user_id);
                                                                    setShowAssignModal(true);
                                                                    setMenuUserId(null);
                                                                }}>
                                                                Affecter à un workspace
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {roleDropDown && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-xl w-[320px]">
                            <h2 className="text-xl font-semibold mb-4 text-gray-700">Affecter un rôle</h2>
                            {roles.map(role => (
                                <button key={role.role_id} className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded transition" onClick={() => assignRole(role.role_id)}>
                                    {role.role_name}
                                </button>
                            ))}
                            <button onClick={() => setRoleDropdown(false)} className="mt-4 w-full bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                                Annuler
                            </button>
                        </div>
                    </div>
                )}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                        <div className="bg-white rounded shadow-lg w-full max-w-lg p-6 relative">
                            <button onClick={closeModal} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold">
                                &times;
                            </button>
                            <h2 className="text-xl font-bold mb-4">
                                {editingUser ? "Modifier un utilisateur" : "Ajouter un utilisateur"}
                            </h2>
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input type="text" name="full_name" placeholder="Nom complet" value={formData.full_name} onChange={handleFormChange} required className="input col-span-2" />
                                <input type="number" name="age" placeholder="Âge" value={formData.age} onChange={handleFormChange} required className="input col-span-2" />
                                <select name="domaine_id" value={formData.domaine_id} onChange={handleFormChange} className="input col-span-2" required>
                                    <option value="">Sélectionnez un domaine</option>
                                    {domains.map((domaine) => (
                                        <option key={domaine.domaine_id} value={domaine.domaine_id}>
                                            {domaine.domaine_name}
                                        </option>
                                    ))}
                                </select>
                                <select name="package_id" value={formData.package_id} onChange={handleFormChange} className="input col-span-2" required>
                                    <option value="">Sélectionnez un package</option>
                                    {packages.map((pkg) => (
                                        <option key={pkg.package_id} value={pkg.package_id}>
                                            {pkg.package_name}
                                        </option>
                                    ))}
                                </select>
                                <input type="number" name="solde_total" placeholder="Solde total" value={formData.solde_total} onChange={handleFormChange} className="input col-span-2" />
                                {!editingUser && (
                                    <>
                                        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleFormChange} required className="input col-span-2" />
                                        <input type="password" name="password" placeholder="Mot de passe" value={formData.password} onChange={handleFormChange} required className="input col-span-2" />
                                    </>
                                )}
                                <button type="submit" className="col-span-2 mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                                    {editingUser ? 'Modifier' : 'Ajouter'}
                                </button>
                                <button type="button" onClick={closeModal} className="col-span-2 mt-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                                    Annuler
                                </button>
                            </form>
                        </div>
                    </div>
                )}
                {showAssignModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                        <div className="bg-white rounded shadow-lg w-full max-w-sm p-6 relative">
                            <button onClick={() => setShowAssignModal(false)} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold">
                                &times;
                            </button>
                            <h2 className="text-lg font-bold mb-4">
                                {assignType === 'package' && "Affecter à un package"}
                                {assignType === 'domaine' && "Affecter à un domaine"}
                                {assignType === 'workspace' && "Affecter à un workspace"}
                            </h2>
                            <form onSubmit={e => {e.preventDefault();handleAssign();}}>
                                {assignType === 'package' && (
                                    <select value={selectedAssignId} onChange={e => setSelectedAssignId(e.target.value)} required className="input w-full mb-4">
                                        <option value="">Sélectionnez un package</option>
                                        {packages.map(pkg => (
                                            <option key={pkg.package_id} value={pkg.package_id}>
                                                {pkg.package_name}
                                            </option>
                                        ))}
                                    </select>
                                )}
                                {assignType === 'domaine' && (
                                    <select value={selectedAssignId} onChange={e => setSelectedAssignId(e.target.value)} required className="input w-full mb-4">
                                        <option value="">Sélectionnez un domaine</option>
                                        {domains.map(dom => (
                                            <option key={dom.domaine_id} value={dom.domaine_id}>
                                                {dom.domaine_name}
                                            </option>
                                        ))}
                                    </select>
                                )}
                                {assignType === 'workspace' && (
                                    <select value={selectedAssignId} onChange={e => setSelectedAssignId(e.target.value)}required className="input w-full mb-4">
                                        <option value="">Sélectionnez un workspace</option>
                                        {workspaces.map(ws => (
                                            <option key={ws.workspace_id} value={ws.workspace_id}>
                                                {ws.workspace_name}
                                            </option>
                                        ))}
                                    </select>
                                )}
                                <button type="submit" className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                                    Affecter
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}