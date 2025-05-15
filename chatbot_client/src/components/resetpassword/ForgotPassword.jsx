import { useState } from "react";
import { supabase } from "../../config/supabaseClient";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: "http://localhost:5173/reset-password",
        });
        if (error) {
            setMessage("Erreur : " + error.message);
        } else {
            setMessage("Un email de réinitialisation a été envoyé !");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
                <h2 className="text-2xl font-bold text-center text-indigo-600 mb-6">
                    Mot de passe oublié
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Adresse email
                        </label>
                        <input id="email" type="email" placeholder="Entrez votre email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                    </div>
                    <button type="submit" className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md focus:outline-none">
                        Envoyer
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

