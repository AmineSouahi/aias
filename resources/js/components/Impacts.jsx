import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart,
} from 'recharts';

// Fonction pour obtenir l'icône SVG
const getIcon = (iconName) => {
    const icons = {
        house: (
            <svg
                className="w-12 h-12 text-[#A2140F] mx-auto"
                fill="currentColor"
                viewBox="0 0 20 20"
            >
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
        ),
        meal: (
            <svg
                className="w-12 h-12 text-[#A2140F] mx-auto"
                fill="currentColor"
                viewBox="0 0 20 20"
            >
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
            </svg>
        ),
        people: (
            <svg
                className="w-12 h-12 text-[#A2140F] mx-auto"
                fill="currentColor"
                viewBox="0 0 20 20"
            >
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
        ),
        education: (
            <svg
                className="w-12 h-12 text-[#A2140F] mx-auto"
                fill="currentColor"
                viewBox="0 0 20 20"
            >
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
            </svg>
        ),
        health: (
            <svg
                className="w-12 h-12 text-[#A2140F] mx-auto"
                fill="currentColor"
                viewBox="0 0 20 20"
            >
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4H5a1 1 0 100 2h4v4a1 1 0 102 0v-4h4a1 1 0 100-2h-4V6z" clipRule="evenodd" />
            </svg>
        ),
        job: (
            <svg
                className="w-12 h-12 text-[#A2140F] mx-auto"
                fill="currentColor"
                viewBox="0 0 20 20"
            >
                <path fillRule="evenodd" d="M6 6V5a2 2 0 012-2h2a2 2 0 012 2v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
            </svg>
        ),
        family: (
            <svg
                className="w-12 h-12 text-[#A2140F] mx-auto"
                fill="currentColor"
                viewBox="0 0 20 20"
            >
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
            </svg>
        ),
        child: (
            <svg
                className="w-12 h-12 text-[#A2140F] mx-auto"
                fill="currentColor"
                viewBox="0 0 20 20"
            >
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
            </svg>
        ),
        heart: (
            <svg
                className="w-12 h-12 text-[#A2140F] mx-auto"
                fill="currentColor"
                viewBox="0 0 20 20"
            >
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
        ),
        hand: (
            <svg
                className="w-12 h-12 text-[#A2140F] mx-auto"
                fill="currentColor"
                viewBox="0 0 20 20"
            >
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
        ),
        book: (
            <svg
                className="w-12 h-12 text-[#A2140F] mx-auto"
                fill="currentColor"
                viewBox="0 0 20 20"
            >
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
            </svg>
        ),
        graduation: (
            <svg
                className="w-12 h-12 text-[#A2140F] mx-auto"
                fill="currentColor"
                viewBox="0 0 20 20"
            >
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
                <path d="M3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
            </svg>
        ),
        money: (
            <svg
                className="w-12 h-12 text-[#A2140F] mx-auto"
                fill="currentColor"
                viewBox="0 0 20 20"
            >
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
            </svg>
        ),
        calendar: (
            <svg
                className="w-12 h-12 text-[#A2140F] mx-auto"
                fill="currentColor"
                viewBox="0 0 20 20"
            >
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
        ),
        star: (
            <svg
                className="w-12 h-12 text-[#A2140F] mx-auto"
                fill="currentColor"
                viewBox="0 0 20 20"
            >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ),
    };
    return icons[iconName] || icons.house;
};

function ImpactCard({ impact }) {
    const { t } = useTranslation(['common', 'about']);
    const [showGraph, setShowGraph] = useState(false);
    const graphData = impact.graph_data || [];

    // Formater les données pour le graphique
    const formattedData = graphData.map((item) => ({
        year: item.year || item.label || '',
        value: parseFloat(item.value) || 0,
    }));

    const hasGraphData = formattedData.length > 0 && formattedData.every(d => d.year && d.value);

    return (
        <div className="bg-white rounded-lg shadow-md p-6 text-center relative">
            {/* Icône */}
            {impact.icon && (
                <div className="mb-4">{getIcon(impact.icon)}</div>
            )}

            {/* Valeur */}
            <div className="text-5xl font-bold text-[#A2140F] mb-4">
                {impact.value}
            </div>

            {/* Titre */}
            <h3 className="text-xl font-semibold text-[#204F01] mb-4">
                {impact.title}
            </h3>

            {/* Graphique ou bouton */}
            {hasGraphData ? (
                <div className="mt-4">
                    {/* Bouton pour ouvrir/fermer le graphique */}
                    {!showGraph ? (
                        <button
                            onClick={() => setShowGraph(true)}
                            className="flex items-center gap-2 text-gray-500 text-sm hover:text-gray-700 transition-colors mx-auto cursor-pointer"
                        >
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                />
                            </svg>
                            <span>{t('about:impacts.viewGraph')}</span>
                        </button>
                    ) : (
                        <div className="relative">
                            {/* Graphique avec animation */}
                            <div
                                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                                    showGraph
                                        ? 'max-h-[500px] opacity-100'
                                        : 'max-h-0 opacity-0'
                                }`}
                                style={{
                                    transition: 'max-height 0.5s ease-in-out, opacity 0.5s ease-in-out',
                                }}
                            >
                                {showGraph && (
                                    <div className="h-48 w-full mt-2 animate-fadeIn">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={formattedData}>
                                                <defs>
                                                    <linearGradient
                                                        id={`color${impact.id}`}
                                                        x1="0"
                                                        y1="0"
                                                        x2="0"
                                                        y2="1"
                                                    >
                                                        <stop
                                                            offset="5%"
                                                            stopColor="#A2140F"
                                                            stopOpacity={0.3}
                                                        />
                                                        <stop
                                                            offset="95%"
                                                            stopColor="#A2140F"
                                                            stopOpacity={0}
                                                        />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid
                                                    strokeDasharray="3 3"
                                                    stroke="#e0e0e0"
                                                />
                                                <XAxis
                                                    dataKey="year"
                                                    tick={{ fontSize: 10 }}
                                                    stroke="#666"
                                                />
                                                <YAxis
                                                    tick={{ fontSize: 10 }}
                                                    stroke="#666"
                                                />
                                                <Tooltip
                                                    contentStyle={{
                                                        backgroundColor: '#fff',
                                                        border: '1px solid #ccc',
                                                        borderRadius: '4px',
                                                    }}
                                                />
                                                <Area
                                                    type="monotone"
                                                    dataKey="value"
                                                    stroke="#A2140F"
                                                    strokeWidth={2}
                                                    fillOpacity={1}
                                                    fill={`url(#color${impact.id})`}
                                                    dot={{ fill: '#A2140F', r: 4 }}
                                                    animationDuration={500}
                                                    animationBegin={0}
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                )}
                            </div>
                            {/* Bouton pour fermer */}
                            {showGraph && (
                                <button
                                    onClick={() => setShowGraph(false)}
                                    className="mt-2 flex items-center gap-2 text-gray-500 text-sm hover:text-gray-700 transition-colors mx-auto animate-fadeIn"
                                >
                                    <svg
                                        className="w-4 h-4"
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
                                    <span>Fermer le graphique</span>
                                </button>
                            )}
                        </div>
                    )}
                </div>
            ) : (
                <div className="mt-4 flex items-center gap-2 text-gray-400 text-sm mx-auto">
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                    </svg>
                    <span>No graph data</span>
                </div>
            )}
        </div>
    );
}

function Impacts() {
    const { t, i18n } = useTranslation(['common', 'about']);
    const [impacts, setImpacts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchImpacts = async () => {
            try {
                // Envoyer la langue actuelle dans les headers
                const currentLang = i18n.language || 'fr';
                const response = await axios.get('/impacts', {
                    headers: {
                        'Accept-Language': currentLang
                    }
                });
                const data = response.data?.data || [];
                setImpacts(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error fetching impacts:', error);
                setImpacts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchImpacts();
    }, [i18n.language]);

    if (loading) {
        return (
            <section className="py-16 bg-[#A2140F]">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
                        {t('about:impacts.title')}
                    </h2>
                    <div className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                </div>
            </section>
        );
    }

    if (impacts.length === 0) {
        return null;
    }

    return (
        <section className="py-16 bg-[#A2140F]">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
                    {t('about:impacts.title')}
                </h2>
                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {impacts.map((impact) => (
                        <ImpactCard key={impact.id} impact={impact} />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Impacts;
