import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../config/supabaseClient";

export default function ResetPassword() {
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleReset = async (e) => {
        e.preventDefault();
        const { error } = await supabase.auth.updateUser({ password });
        if (error) {
            setMessage("Erreur : " + error.message);
        } else {
            setMessage("Mot de passe réinitialisé !");
            setTimeout(() => navigate("/login"), 2000);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
                <h2 className="text-2xl font-bold text-center text-indigo-600 mb-6">
                    Réinitialiser le mot de passe
                </h2>
                <form onSubmit={handleReset} className="space-y-4">
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Nouveau mot de passe
                        </label>
                        <input id="password" type="password" placeholder="Entrez un nouveau mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                    </div>
                    <button type="submit" className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md focus:outline-none"        >
                        Valider
                    </button>
                </form>
                {message && (
                    <p className="mt-4 text-center text-sm text-gray-700">
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
}
