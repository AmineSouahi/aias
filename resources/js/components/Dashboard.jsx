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
    const [sidebarOpen, setSidebarOpen] = useState(false);

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

    const menuItems = [
        { id: 'news', label: 'Gestion des News' },
        { id: 'partners', label: 'Gestion des Partenaires' },
        { id: 'statistics', label: 'Chiffres clés' },
        { id: 'slides', label: 'Gestion du Carousel' },
        { id: 'executive-members', label: 'Bureau Exécutif' },
        { id: 'impacts', label: 'Impacts' },
        { id: 'support-projects', label: 'Projets à financer' },
        { id: 'support-goals', label: 'Objectifs de soutien' },
        { id: 'charts', label: 'Graphiques' },
        { id: 'contacts', label: 'Messages' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Overlay pour mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-[#204F01] to-[#A2140F] transform transition-transform duration-300 ease-in-out ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                }`}
            >
                <div className="flex flex-col h-screen overflow-hidden justify-between">
                    {/* Logo/Header de la sidebar */}
                    <div className="flex-shrink-0">
                        <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/20">
                            <h1 className="text-lg font-bold text-white">Admin Panel</h1>
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="lg:hidden text-white hover:text-gray-200 transition-colors"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>

                        {/* Menu items */}
                        <nav className="py-2">
                            {menuItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        setActiveTab(item.id);
                                        setSidebarOpen(false);
                                    }}
                                    className={`w-full flex items-center px-4 py-3.5 text-left transition-all duration-200 ${
                                        activeTab === item.id
                                            ? 'bg-white/20 text-white border-r-4 border-white'
                                            : 'text-white/80 hover:bg-white/10 hover:text-white'
                                    }`}
                                >
                                    <span className="font-medium">{item.label}</span>
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* User info et déconnexion */}
                    <div className="px-4 py-2.5 border-t border-white/20 flex-shrink-0">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center px-3 py-2 bg-white/20 hover:bg-white/30 text-white rounded-md font-medium transition-colors text-sm"
                        >
                            <svg
                                className="w-4 h-4 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                />
                            </svg>
                            Déconnexion
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col lg:ml-64">
                {/* Top Header */}
                <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
                    <div className="px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-4">
                            <div className="flex items-center">
                        <button
                                    onClick={() => setSidebarOpen(!sidebarOpen)}
                                    className="lg:hidden text-gray-600 hover:text-gray-900 mr-4"
                                >
                                    <svg
                                        className="w-6 h-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                    </svg>
                        </button>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Tableau de bord Admin
                                </h1>
                            </div>
                            <div className="hidden md:flex items-center space-x-4">
                                <span className="text-sm text-gray-600">
                                    Bonjour, <span className="font-medium">{user?.name}</span>
                                </span>
                            </div>
                </div>
            </div>
                </header>

            {/* Main Content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
                    <div className="max-w-7xl mx-auto">
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
                    </div>
            </main>
            </div>
        </div>
    );
}

export default Dashboard;

