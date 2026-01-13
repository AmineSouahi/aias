import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NewsAdmin from './NewsAdmin';
import PartnersAdmin from './PartnersAdmin';
import StatisticsAdmin from './StatisticsAdmin';
import SlidesAdmin from './SlidesAdmin';
import ExecutiveMembersAdmin from './ExecutiveMembersAdmin';
import ImpactsAdmin from './ImpactsAdmin';
import ChartsAdmin from './ChartsAdmin';
import SupportGoalsAdmin from './SupportGoalsAdmin';
import SupportProjectsAdmin from './SupportProjectsAdmin';
import ContactsAdmin from './ContactsAdmin';

function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('news');

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const response = await axios.get('/user');
            if (response.data.success) {
                setUser(response.data.user);
            } else {
                navigate('/login');
            }
        } catch (error) {
            navigate('/login');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await axios.post('/logout');
            navigate('/login');
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
            navigate('/login');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <svg
                        className="animate-spin h-12 w-12 text-[#A2140F] mx-auto"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                    <p className="mt-4 text-gray-600">Chargement...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold text-gray-900">
                                Tableau de bord Admin
                            </h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600">
                                Bonjour, <span className="font-medium">{user?.name}</span>
                            </span>
                            <button
                                onClick={handleLogout}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#A2140F] hover:bg-[#c91a14] transition-colors"
                            >
                                Déconnexion
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Navigation Tabs */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex space-x-8" aria-label="Tabs">
                        <button
                            onClick={() => setActiveTab('news')}
                            className={`${
                                activeTab === 'news'
                                    ? 'border-[#A2140F] text-[#A2140F]'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                        >
                            Gestion des News
                        </button>
                        <button
                            onClick={() => setActiveTab('partners')}
                            className={`${
                                activeTab === 'partners'
                                    ? 'border-[#A2140F] text-[#A2140F]'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                        >
                            Gestion des Partenaires
                        </button>
                        <button
                            onClick={() => setActiveTab('statistics')}
                            className={`${
                                activeTab === 'statistics'
                                    ? 'border-[#A2140F] text-[#A2140F]'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                        >
                            Chiffres clés
                        </button>
                        <button
                            onClick={() => setActiveTab('slides')}
                            className={`${
                                activeTab === 'slides'
                                    ? 'border-[#A2140F] text-[#A2140F]'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                        >
                            Gestion du Carousel
                        </button>
                        <button
                            onClick={() => setActiveTab('executive-members')}
                            className={`${
                                activeTab === 'executive-members'
                                    ? 'border-[#A2140F] text-[#A2140F]'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                        >
                            Bureau Exécutif
                        </button>
                        <button
                            onClick={() => setActiveTab('impacts')}
                            className={`${
                                activeTab === 'impacts'
                                    ? 'border-[#A2140F] text-[#A2140F]'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                        >
                            Impacts
                        </button>
                        <button
                            onClick={() => setActiveTab('support-projects')}
                            className={`${
                                activeTab === 'support-projects'
                                    ? 'border-[#A2140F] text-[#A2140F]'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                        >
                            Projets à financer
                        </button>
                        <button
                            onClick={() => setActiveTab('support-goals')}
                            className={`${
                                activeTab === 'support-goals'
                                    ? 'border-[#A2140F] text-[#A2140F]'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                        >
                            Objectifs de soutien
                        </button>
                        <button
                            onClick={() => setActiveTab('charts')}
                            className={`${
                                activeTab === 'charts'
                                    ? 'border-[#A2140F] text-[#A2140F]'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                        >
                            Graphiques
                        </button>
                        <button
                            onClick={() => setActiveTab('contacts')}
                            className={`${
                                activeTab === 'contacts'
                                    ? 'border-[#A2140F] text-[#A2140F]'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                        >
                            Messages
                        </button>
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {activeTab === 'news' && <NewsAdmin />}
                {activeTab === 'partners' && <PartnersAdmin />}
                {activeTab === 'statistics' && <StatisticsAdmin />}
                {activeTab === 'slides' && <SlidesAdmin />}
                {activeTab === 'executive-members' && <ExecutiveMembersAdmin />}
                {activeTab === 'impacts' && <ImpactsAdmin />}
                {activeTab === 'charts' && <ChartsAdmin />}
                {activeTab === 'support-projects' && <SupportProjectsAdmin />}
                {activeTab === 'support-goals' && <SupportGoalsAdmin />}
                {activeTab === 'contacts' && <ContactsAdmin />}
            </main>
        </div>
    );
}

export default Dashboard;

