import React, { useEffect, useState } from 'react';
import SidebarUser from './SidebarUser';
import urlApi from '../../api/axios';

function ChatbotsUser() {
    const [chatbots, setChatbots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 6;

    useEffect(() => {
        setLoading(true);
        urlApi.get(`/chatbots?page=${page}&limit=${limit}`)
            .then(res => {
                setChatbots(res.data.chatbots || res.data);
                setTotalPages(res.data.totalPages || 1);
            })
            .catch(() => setChatbots([]))
            .finally(() => setLoading(false));
    }, [page]);

    const handlePrev = () => setPage((prev) => Math.max(prev - 1, 1));
    const handleNext = () => setPage((prev) => Math.min(prev + 1, totalPages));

    return (
        <div className="flex min-h-screen bg-gray-100">
            <SidebarUser />
            <main className="flex-1 p-8">
                <h2 className="text-2xl font-bold mb-6">Liste des Chatbots</h2>
                {loading ? (
                    <div>Chargement...</div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {chatbots.length === 0 ? (
                                <div className="col-span-3 text-center text-gray-500">Aucun chatbot trouvé.</div>
                            ) : (
                                chatbots.map(bot => (
                                    <div key={bot.id} className="bg-white rounded shadow p-4 flex flex-col">
                                        <h3 className="text-xl font-semibold mb-2">{bot.chatbot_name}</h3>
                                        <p className="text-gray-600 mb-2">{bot.chatbot_title || 'Pas de description.'}</p>
                                        <p className="text-gray-600 mb-2">{bot.chatbot_description || 'Pas de description.'}</p>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="flex justify-center items-center gap-4 mt-8">
                            <button onClick={handlePrev} disabled={page === 1} className="px-4 py-2 bg-blue-700 text-white rounded disabled:opacity-50">
                                Précédent
                            </button>
                            <span>Page {page} / {totalPages}</span>
                            <button onClick={handleNext} disabled={page === totalPages} className="px-4 py-2 bg-blue-700 text-white rounded disabled:opacity-50">
                                Suivant
                            </button>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}

export default ChatbotsUser;