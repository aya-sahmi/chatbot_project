import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:5000/api/v1/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Échec de connexion');
            }

            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('userData', JSON.stringify(data.userData));

            toast.success(`Bienvenue ${data.userData.full_name}`, {
                position: 'top-right',
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
            });
            const { role } = data.userData;

            setTimeout(() => {
                switch (role) {
                    case 'super_admin':
                        window.location.href = '/superadmin/dashboard';
                        break;
                    case 'admin':
                        window.location.href = '/admin/dashboard';
                        break;
                    case 'user':
                        window.location.href = '/user/dashboard';
                        break;
                    case 'live_agent':
                        window.location.href = '/liveagent/dashboard';
                        break;
                    default:
                        window.location.href = '/dashboard';
                }
            }, 2000);

        } catch (error) {
            setError(error.message);
            toast.error(error.message, {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                progress: undefined,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 to-purple-500">
            <ToastContainer />
            <div className="w-full max-w-md p-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg shadow-2xl border border-gray-300 transform hover:scale-105 transition-transform duration-300 m-5">
                <div className="flex items-center justify-center gap-4">
                    <img src="/logo-chatbot.jpg" alt="Logo" className="w-40 h-40 rounded-full object-cover"/>
                    <h1 className="text-2xl font-bold text-gray-800">Welcome to Tybot</h1>
                </div>
                <h2 className="text-2xl font-semibold text-center text-gray-700">Login</h2>
                {error && (
                    <div className="p-4 text-sm text-red-700 bg-red-100 rounded-md">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input id="email" name="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="block w-full px-3 py-2 mt-1 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="Votre email"/>
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mot de passe</label>
                        <input id="password" name="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="block w-full px-3 py-2 mt-1 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Votre mot de passe"/>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="text-sm">
                            <a href="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
                                Mot de passe oublié ?
                            </a>
                        </div>
                    </div>
                    <div>
                        <button type="submit" disabled={loading} className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            {loading ? 'Connexion en cours...' : 'Se connecter'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}