import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Statistics from './Statistics';
import axios from 'axios';
import {
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

function PillarsSection({ pillars }) {
    const { t, i18n } = useTranslation('whatWeDo');
    const [visibleIndices, setVisibleIndices] = useState(new Set());
    
    // S'assurer que le namespace est chargé
    useEffect(() => {
        const currentLang = i18n.language || 'fr';
        if (!i18n.hasResourceBundle(currentLang, 'whatWeDo')) {
            i18n.loadNamespaces('whatWeDo').catch(err => {
                console.error('Error loading whatWeDo namespace:', err);
            });
        }
    }, [i18n]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const index = parseInt(entry.target.dataset.index);
                        setVisibleIndices((prev) => new Set([...prev, index]));
                    }
                });
            },
            { threshold: 0.2 }
        );

        const elements = document.querySelectorAll('[data-pillar-card]');
        elements.forEach((el) => observer.observe(el));

        return () => {
            elements.forEach((el) => observer.unobserve(el));
        };
    }, []);

    return (
        <section className="mb-12 relative">
            {/* Background décoratif */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div className="absolute top-1/4 left-0 w-96 h-96 bg-[#A2140F] rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-[#204F01] rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10">
                <div className="text-center mb-10">
                    <h3 className="text-4xl md:text-5xl font-extrabold text-[#204F01] mb-4">
                        {t('whatWeDo:pillars.title').replace(t('whatWeDo:pillars.subtitle'), '').trim()}{' '}
                        <span className="relative inline-block">
                            {t('whatWeDo:pillars.subtitle')}
                            <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#A2140F] rounded-full"></span>
                        </span>
                    </h3>
                </div>

                <div className="grid md:grid-cols-3 gap-8 md:gap-10">
                    {pillars.map((pillar, index) => {
                        const isVisible = visibleIndices.has(index);
                        
                        return (
                            <article
                                key={pillar.title}
                                data-pillar-card
                                data-index={index}
                                className="relative group"
                                style={{
                                    transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                                    transitionDelay: `${index * 0.15}s`,
                                    transform: isVisible
                                        ? 'translateY(0) scale(1)'
                                        : 'translateY(40px) scale(0.95)',
                                    opacity: isVisible ? 1 : 0,
                                }}
                            >
                                {/* Carte principale */}
                                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 flex flex-col h-full hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden">
                                    {/* Effet de brillance au hover */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#A2140F]/0 via-[#A2140F]/0 to-[#204F01]/0 group-hover:from-[#A2140F]/5 group-hover:via-transparent group-hover:to-[#204F01]/5 transition-all duration-500 rounded-3xl"></div>
                                    
                                    <div className="relative z-10">
                                        {/* Header avec numéro carré rouge et ligne horizontale */}
                                        <div className="mb-6 flex items-center gap-3">
                                            <span className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-[#A2140F] text-white font-bold text-xl shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                                                {index + 1}
                                            </span>
                                            <div className="flex-1 h-0.5 bg-gradient-to-r from-[#A2140F] to-transparent rounded-full"></div>
                                        </div>
                                        
                                        {/* Titre en vert foncé */}
                                        <h4 className="text-2xl md:text-3xl font-bold text-[#204F01] mb-5 group-hover:text-[#A2140F] transition-colors duration-300">
                                            {pillar.title}
                                        </h4>
                                        
                                        {/* Description */}
                                        <p className="text-gray-700 mb-8 leading-relaxed text-base flex-1">
                                            {pillar.description}
                                        </p>
                                        
                                        {/* Liste avec checkmarks rouges */}
                                        <ul className="space-y-3">
                                            {Array.isArray(pillar.details) && pillar.details.map((item, idx) => (
                                                <li 
                                                    key={idx} 
                                                    className="flex items-start gap-3 group/item"
                                                    style={{
                                                        transition: 'all 0.3s ease',
                                                        transitionDelay: `${idx * 0.05}s`,
                                                    }}
                                                >
                                                    <div className="flex-shrink-0 mt-0.5">
                                                        <svg 
                                                            className="w-5 h-5 text-[#A2140F] group-hover/item:scale-125 transition-transform duration-300" 
                                                            fill="currentColor" 
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path 
                                                                fillRule="evenodd" 
                                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                                                                clipRule="evenodd" 
                                                            />
                                                        </svg>
                                                    </div>
                                                    <span className="leading-relaxed text-sm md:text-base text-gray-700 group-hover/item:text-gray-900 transition-colors">
                                                        {item}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Ligne décorative en bas */}
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#A2140F]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

function ProfilesSection({ profiles }) {
    const { t, i18n } = useTranslation('whatWeDo');
    const [visibleIndices, setVisibleIndices] = useState(new Set());
    
    // S'assurer que le namespace est chargé
    useEffect(() => {
        const currentLang = i18n.language || 'fr';
        if (!i18n.hasResourceBundle(currentLang, 'whatWeDo')) {
            i18n.loadNamespaces('whatWeDo').catch(err => {
                console.error('Error loading whatWeDo namespace:', err);
            });
        }
    }, [i18n]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const index = parseInt(entry.target.dataset.index);
                        setVisibleIndices((prev) => new Set([...prev, index]));
                    }
                });
            },
            { threshold: 0.2 }
        );

        const elements = document.querySelectorAll('[data-profile-card]');
        elements.forEach((el) => observer.observe(el));

        return () => {
            elements.forEach((el) => observer.unobserve(el));
        };
    }, []);

    const getTagColors = (color) => {
        switch (color) {
            case 'red':
                return 'bg-gradient-to-r from-[#A2140F] to-[#c91a14] text-white shadow-lg';
            case 'green':
                return 'bg-gradient-to-r from-[#204F01] to-[#2d6a02] text-white shadow-lg';
            case 'yellow':
                return 'bg-gradient-to-r from-[#FBBF24] to-[#F59E0B] text-white shadow-lg';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getBorderColor = (color) => {
        switch (color) {
            case 'red':
                return 'border-[#A2140F]';
            case 'green':
                return 'border-[#204F01]';
            case 'yellow':
                return 'border-[#FBBF24]';
            default:
                return 'border-gray-200';
        }
    };

    const getTextColor = (color) => {
        switch (color) {
            case 'red':
                return 'text-[#A2140F]';
            case 'green':
                return 'text-[#204F01]';
            case 'yellow':
                return 'text-[#92400E]';
            default:
                return 'text-gray-800';
        }
    };

    const getCheckmarkColor = (color) => {
        switch (color) {
            case 'red':
                return 'text-[#A2140F]';
            case 'green':
                return 'text-[#204F01]';
            case 'yellow':
                return 'text-[#FBBF24]';
            default:
                return 'text-gray-600';
        }
    };

    return (
        <section id="profils" className="mb-12 relative py-12">
            {/* Background décoratif avec gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-50 rounded-3xl"></div>
            <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#A2140F] rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#204F01] rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FBBF24] rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 container mx-auto px-4 max-w-7xl">
                <div className="text-center mb-10">
                    <h3 className="text-4xl md:text-5xl font-extrabold text-[#204F01] mb-4">
                        {t('whatWeDo:beneficiaries.title').replace(t('whatWeDo:beneficiaries.subtitle'), '').trim()}{' '}
                        <span className="relative inline-block">
                            {t('whatWeDo:beneficiaries.subtitle')}
                            <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#A2140F] rounded-full"></span>
                        </span>
                    </h3>
                    <p className="text-gray-700 text-lg md:text-xl max-w-4xl mx-auto leading-relaxed mt-6">
                        {t('whatWeDo:beneficiaries.description')}
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 md:gap-10">
                    {profiles.map((profile, index) => {
                        const isVisible = visibleIndices.has(index);
                        
                        return (
                            <article
                                key={profile.title}
                                data-profile-card
                                data-index={index}
                                className="relative group"
                                style={{
                                    transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                                    transitionDelay: `${index * 0.15}s`,
                                    transform: isVisible
                                        ? 'translateY(0) scale(1)'
                                        : 'translateY(40px) scale(0.95)',
                                    opacity: isVisible ? 1 : 0,
                                }}
                            >
                                {/* Carte principale */}
                                <div className={`bg-white rounded-3xl shadow-xl border-l-6 ${getBorderColor(profile.tagColor)} p-8 flex flex-col h-full hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 relative overflow-hidden`}>
                                    {/* Effet de brillance au hover avec couleur du tag */}
                                    <div 
                                        className="absolute inset-0 rounded-3xl transition-all duration-500 opacity-0 group-hover:opacity-100"
                                        style={{
                                            background: profile.tagColor === 'red' 
                                                ? 'linear-gradient(135deg, rgba(162, 20, 15, 0.05), transparent, transparent)' 
                                                : profile.tagColor === 'green' 
                                                ? 'linear-gradient(135deg, rgba(32, 79, 1, 0.05), transparent, transparent)' 
                                                : 'linear-gradient(135deg, rgba(251, 191, 36, 0.05), transparent, transparent)',
                                        }}
                                    ></div>
                                    
                                    <div className="relative z-10">
                                        {/* Header avec titre et tag */}
                                        <div className="flex items-center justify-between mb-6">
                                            <h4 className={`text-2xl md:text-3xl font-bold ${getTextColor(profile.tagColor)} group-hover:scale-105 transition-transform duration-300`}>
                                                {profile.title}
                                            </h4>
                                            <span className={`text-xs font-bold px-4 py-2 rounded-full ${getTagColors(profile.tagColor)} transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-md`}>
                                                {profile.tag}
                                            </span>
                                        </div>
                                        
                                        {/* Description */}
                                        <p className="text-gray-700 text-base leading-relaxed mb-8 flex-1">
                                            {profile.description}
                                        </p>
                                        
                                        {/* Liste avec checkmarks colorés */}
                                        <ul className="space-y-3">
                                            {Array.isArray(profile.details) && profile.details.map((item, idx) => (
                                                <li 
                                                    key={idx} 
                                                    className="flex items-start gap-3 group/item"
                                                    style={{
                                                        transition: 'all 0.3s ease',
                                                        transitionDelay: `${idx * 0.05}s`,
                                                    }}
                                                >
                                                    <div className="flex-shrink-0 mt-0.5">
                                                        <svg 
                                                            className={`w-5 h-5 ${getCheckmarkColor(profile.tagColor)} group-hover/item:scale-125 group-hover/item:rotate-12 transition-all duration-300`}
                                                            fill="currentColor" 
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path 
                                                                fillRule="evenodd" 
                                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                                                                clipRule="evenodd" 
                                                            />
                                                        </svg>
                                                    </div>
                                                    <span className="leading-relaxed text-sm md:text-base text-gray-700 group-hover/item:text-gray-900 transition-colors">
                                                        {item}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Ligne décorative en bas avec couleur du tag */}
                                    <div 
                                        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                        style={{
                                            background: `linear-gradient(to right, transparent, ${profile.tagColor === 'red' ? 'rgba(162, 20, 15, 0.3)' : profile.tagColor === 'green' ? 'rgba(32, 79, 1, 0.3)' : 'rgba(251, 191, 36, 0.3)'}, transparent)`,
                                        }}
                                    ></div>
                                    
                                    {/* Bordure animée au hover */}
                                    <div className={`absolute inset-0 rounded-3xl border-2 ${getBorderColor(profile.tagColor)} opacity-0 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none`}></div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

function ChartsSection() {
    const { t, i18n } = useTranslation('whatWeDo');
    const [lineChartData, setLineChartData] = useState([]);
    const [pieChartData, setPieChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Fonction pour traduire les noms des catégories du graphique en camembert
    const translatePieChartName = (name) => {
        const nameMap = {
            'NEET': t('whatWeDo:profilesData.neet.title'),
            'Diplômés': t('whatWeDo:profilesData.graduates.title'),
            'Bacheliers': t('whatWeDo:profilesData.bacheliers.title'),
        };
        return nameMap[name] || name;
    };
    
    // S'assurer que le namespace est chargé
    useEffect(() => {
        const currentLang = i18n.language || 'fr';
        if (!i18n.hasResourceBundle(currentLang, 'whatWeDo')) {
            i18n.loadNamespaces('whatWeDo').catch(err => {
                console.error('Error loading whatWeDo namespace:', err);
            });
        }
    }, [i18n]);

    useEffect(() => {
        const fetchChartData = async () => {
            try {
                // Récupérer les données du graphique linéaire
                const lineResponse = await axios.get('/chart-data?type=line');
                const lineData = lineResponse.data?.data || [];
                const formattedLineData = lineData
                    .filter(item => item.is_active)
                    .map(item => ({
                        year: parseInt(item.year),
                        value: parseFloat(item.value),
                    }))
                    .sort((a, b) => a.year - b.year);
                
                console.log('Chart data loaded:', formattedLineData);
                setLineChartData(formattedLineData);

                // Récupérer les données du graphique en camembert
                const pieResponse = await axios.get('/chart-data?type=pie');
                const pieData = pieResponse.data?.data || [];
                const formattedPieData = pieData
                    .filter(item => item.is_active)
                    .map(item => ({
                        name: translatePieChartName(item.name),
                        value: parseFloat(item.value),
                        color: item.color || '#A2140F',
                    }))
                    .sort((a, b) => b.value - a.value);
                setPieChartData(formattedPieData);
            } catch (error) {
                console.error('Error fetching chart data:', error);
                // Données par défaut en cas d'erreur
                setLineChartData([
                    { year: 2018, value: 35 },
                    { year: 2019, value: 40 },
                    { year: 2020, value: 35 },
                    { year: 2021, value: 55 },
                    { year: 2022, value: 78 },
                ]);
                setPieChartData([
                    { name: t('whatWeDo:profilesData.neet.title'), value: 55, color: '#FBBF24' },
                    { name: t('whatWeDo:profilesData.graduates.title'), value: 30, color: '#204F01' },
                    { name: t('whatWeDo:profilesData.bacheliers.title'), value: 15, color: '#A2140F' },
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchChartData();
    }, [t]);

    // Composant Tooltip personnalisé pour le graphique linéaire
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-4">
                    <p className="text-sm font-semibold text-gray-800 mb-2">
                        {t('whatWeDo:analysis.year', { year: payload[0].payload.year })}
                    </p>
                                    <p className="text-base font-bold text-[#A2140F]">
                        {t('whatWeDo:analysis.beneficiariesLabel', { count: payload[0].value })}
                    </p>
                </div>
            );
        }
        return null;
    };

    // Composant Tooltip personnalisé pour le camembert
    const CustomPieTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0];
            return (
                <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: data.payload.color }}
                        ></div>
                        <p className="text-sm font-semibold text-gray-800">
                            {data.name}
                        </p>
                    </div>
                    <p className="text-base font-bold" style={{ color: data.payload.color }}>
                        {`${data.value}%`}
                    </p>
                </div>
            );
            }
        return null;
    };

    return (
        <section className="mb-12 py-12">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="text-center mb-8">
                    <h3 className="text-4xl md:text-5xl font-extrabold text-[#204F01] mb-4">
                        {t('whatWeDo:analysis.title')}
                    </h3>
                    <div className="w-32 h-1.5 bg-gradient-to-r from-[#A2140F] to-[#204F01] mx-auto rounded-full"></div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                    {/* Graphique linéaire */}
                    <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border border-gray-100 relative overflow-hidden group hover:shadow-3xl transition-all duration-300">
                        {/* Effet de brillance */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#A2140F]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        <div className="relative z-10">
                            <h4 className="text-xl md:text-2xl font-bold text-[#204F01] mb-6 text-center">
                                {t('whatWeDo:analysis.lineChartTitle')}
                            </h4>
                            <ResponsiveContainer width="100%" height={450}>
                                <LineChart 
                                    key={`chart-${lineChartData.map(d => d.year).join('-')}`}
                                    data={lineChartData} 
                                    margin={{ top: 20, right: 30, left: 20, bottom: lineChartData.length > 6 ? 80 : 50 }}
                                >
                                    <defs>
                                        <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#A2140F" stopOpacity={0.3} />
                                            <stop offset="100%" stopColor="#A2140F" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid 
                                        strokeDasharray="3 3" 
                                        stroke="#e5e7eb" 
                                        vertical={false}
                                    />
                                    <XAxis 
                                        dataKey="year" 
                                        stroke="#6b7280"
                                        tick={{ fill: '#6b7280', fontSize: 13, fontWeight: 500 }}
                                        axisLine={{ stroke: '#d1d5db' }}
                                        tickLine={{ stroke: '#d1d5db' }}
                                        ticks={lineChartData.length > 0 ? lineChartData.map(item => item.year) : []}
                                        interval={0}
                                        tickFormatter={(value) => value}
                                        minTickGap={0}
                                        angle={lineChartData.length > 6 ? -45 : 0}
                                        textAnchor={lineChartData.length > 6 ? 'end' : 'middle'}
                                        height={lineChartData.length > 6 ? 80 : 50}
                                    />
                                    <YAxis 
                                        stroke="#6b7280"
                                        tick={{ fill: '#6b7280', fontSize: 14, fontWeight: 500 }}
                                        axisLine={{ stroke: '#d1d5db' }}
                                        tickLine={{ stroke: '#d1d5db' }}
                                        domain={['dataMin - 10', 'dataMax + 10']}
                                        allowDecimals={false}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Line 
                                        type="monotone" 
                                        dataKey="value" 
                                        stroke="#A2140F" 
                                        strokeWidth={4}
                                        dot={{ 
                                            fill: '#A2140F', 
                                            r: 6,
                                            strokeWidth: 2,
                                            stroke: '#fff',
                                            className: 'drop-shadow-md'
                                        }}
                                        activeDot={{ 
                                            r: 8,
                                            strokeWidth: 3,
                                            stroke: '#fff',
                                            fill: '#A2140F',
                                            className: 'drop-shadow-lg'
                                        }}
                                        strokeLinecap="round"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Graphique en camembert */}
                    <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border border-gray-100 relative overflow-hidden group hover:shadow-3xl transition-all duration-300">
                        {/* Effet de brillance */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#FBBF24]/5 via-transparent to-[#204F01]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        <div className="relative z-10 flex flex-col h-full">
                            {/* Titre */}
                            <h4 className="text-xl md:text-2xl font-bold text-[#204F01] mb-6 text-center">
                                {t('whatWeDo:analysis.pieChartTitle')}
                            </h4>
                            
                            {/* Contenu principal */}
                            <div className="flex-1 flex flex-col items-center justify-between">
                                {/* Graphique */}
                                <div className="w-full flex-1 flex items-center justify-center mb-6">
                                    <ResponsiveContainer width="100%" height={280}>
                                    <PieChart>
                                        <defs>
                                            {pieChartData.map((entry, index) => (
                                                <linearGradient 
                                                    key={`gradient-${index}`} 
                                                    id={`gradient-${index}`}
                                                    x1="0%" 
                                                    y1="0%" 
                                                    x2="100%" 
                                                    y2="100%"
                                                >
                                                    <stop offset="0%" stopColor={entry.color} stopOpacity={1} />
                                                    <stop offset="100%" stopColor={entry.color} stopOpacity={0.8} />
                                                </linearGradient>
                                            ))}
                                        </defs>
                                        <Pie
                                            data={pieChartData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) => {
                                                const percentage = (percent * 100).toFixed(0);
                                                return percentage > 10 ? `${name}: ${percentage}%` : '';
                                            }}
                                            outerRadius={100}
                                            innerRadius={35}
                                            fill="#8884d8"
                                            dataKey="value"
                                            stroke="#fff"
                                            strokeWidth={3}
                                            paddingAngle={2}
                                        >
                                            {pieChartData.map((entry, index) => (
                                                <Cell 
                                                    key={`cell-${index}`} 
                                                    fill={`url(#gradient-${index})`}
                                                    className="hover:opacity-90 transition-opacity duration-200"
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<CustomPieTooltip />} />
                                    </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                
                                {/* Légende améliorée */}
                                <div className="flex flex-wrap justify-center gap-3 w-full">
                                    {pieChartData.map((entry, index) => (
                                        <div 
                                            key={index} 
                                            className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 hover:bg-gray-100 transition-colors duration-200 shadow-sm"
                                        >
                                            <div 
                                                className="w-4 h-4 rounded-full flex-shrink-0"
                                                style={{ backgroundColor: entry.color }}
                                            ></div>
                                            <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                                                {entry.name}
                                            </span>
                                            <span 
                                                className="text-sm font-bold whitespace-nowrap"
                                                style={{ color: entry.color }}
                                            >
                                                {entry.value}%
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function WhatWeDo() {
    const { t } = useTranslation(['common', 'whatWeDo']);
    
    // Fonction helper pour s'assurer que les détails sont toujours un tableau
    const getDetailsArray = (key) => {
        const details = t(key, { returnObjects: true });
        return Array.isArray(details) ? details : [];
    };
    
    // Fonction pour traduire les noms des catégories du graphique en camembert
    const translatePieChartName = (name) => {
        const nameMap = {
            'NEET': t('whatWeDo:profilesData.neet.title'),
            'Diplômés': t('whatWeDo:profilesData.graduates.title'),
            'Bacheliers': t('whatWeDo:profilesData.bacheliers.title'),
        };
        return nameMap[name] || name;
    };

    const pillars = [
        {
            title: t('whatWeDo:pillarsData.supervision.title'),
            description: t('whatWeDo:pillarsData.supervision.description'),
            details: getDetailsArray('whatWeDo:pillarsData.supervision.details'),
        },
        {
            title: t('whatWeDo:pillarsData.training.title'),
            description: t('whatWeDo:pillarsData.training.description'),
            details: getDetailsArray('whatWeDo:pillarsData.training.details'),
        },
        {
            title: t('whatWeDo:pillarsData.integration.title'),
            description: t('whatWeDo:pillarsData.integration.description'),
            details: getDetailsArray('whatWeDo:pillarsData.integration.details'),
        },
    ];

    const profiles = [
        {
            title: t('whatWeDo:profilesData.bacheliers.title'),
            tag: t('whatWeDo:profilesData.bacheliers.tag'),
            tagColor: 'red',
            description: t('whatWeDo:profilesData.bacheliers.description'),
            details: getDetailsArray('whatWeDo:profilesData.bacheliers.details'),
        },
        {
            title: t('whatWeDo:profilesData.graduates.title'),
            tag: t('whatWeDo:profilesData.graduates.tag'),
            tagColor: 'green',
            description: t('whatWeDo:profilesData.graduates.description'),
            details: getDetailsArray('whatWeDo:profilesData.graduates.details'),
        },
        {
            title: t('whatWeDo:profilesData.neet.title'),
            tag: t('whatWeDo:profilesData.neet.tag'),
            tagColor: 'yellow',
            description: t('whatWeDo:profilesData.neet.description'),
            details: getDetailsArray('whatWeDo:profilesData.neet.details'),
        },
    ];


    return (
        <>
            {/* Hero amélioré */}
            <section className="relative mt-16 md:mt-20 overflow-hidden">
                <div className="relative h-[420px] md:h-[520px] lg:h-[620px]">
                    <div
                        className="absolute inset-0 bg-cover bg-center hero-zoom"
                        style={{
                            backgroundImage: `url(/images/success.webp)`,
                        }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-[#A2140F]/95 via-[#A2140F]/85 to-[#204F01]/85" />
                    </div>
                    <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
                        <div className="max-w-2xl text-white animate-fade-in">
                            <p className="mb-2 md:mb-3 text-sm sm:text-base md:text-lg lg:text-xl font-medium text-white/90">
                                {t('whatWeDo:hero.programName')}
                            </p>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-3 md:mb-4 drop-shadow-lg leading-tight">
                                {t('whatWeDo:hero.title')}
                            </h1>
                            <p className="text-base sm:text-lg md:text-xl mb-2 md:mb-3 text-white/95 leading-relaxed">
                                {t('whatWeDo:hero.description1')}
                            </p>
                            <p className="text-xs sm:text-sm md:text-base mb-6 md:mb-8 text-white/80 max-w-xl">
                                {t('whatWeDo:hero.description2')}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <a
                                    href="#presentation"
                                    className="inline-block bg-white text-[#A2140F] px-6 md:px-8 py-2.5 md:py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm md:text-base text-center"
                                >
                                    {t('whatWeDo:hero.discoverProgram')}
                                </a>
                                <a
                                    href="#profils"
                                    className="inline-block bg-transparent border-2 border-white/80 text-white px-6 md:px-8 py-2.5 md:py-3 rounded-lg font-semibold hover:bg-white hover:text-[#A2140F] transition-colors text-sm md:text-base text-center"
                                >
                                    {t('whatWeDo:hero.seeAccompanied')}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mini timeline */}
                <div className="relative z-20 bg-white/95 backdrop-blur-sm border-t border-[#F3C28A]/60">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-5">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-sm md:text-base">
                            <div className="flex items-center gap-3">
                                <span className="inline-flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-full bg-[#A2140F]/10 text-[#A2140F] font-semibold text-xs md:text-sm">
                                    2021
                                </span>
                                <div>
                                    <p className="font-semibold text-[#204F01]">
                                        {t('whatWeDo:timeline.launch')}
                                    </p>
                                    <p className="text-xs md:text-sm text-gray-600">
                                        {t('whatWeDo:timeline.launchDescription')}
                                    </p>
                                </div>
                            </div>
                            <div className="flex-1 hidden md:flex items-center justify-center gap-2 text-gray-500 text-xs uppercase tracking-[0.2em]">
                                <span className="w-6 h-px bg-gray-300" />
                                <span>{t('whatWeDo:timeline.supervision')}</span>
                                <span className="w-6 h-px bg-gray-300" />
                                <span>{t('whatWeDo:timeline.training')}</span>
                                <span className="w-6 h-px bg-gray-300" />
                                <span>{t('whatWeDo:timeline.integration')}</span>
                                <span className="w-6 h-px bg-gray-300" />
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <p className="text-[11px] md:text-xs text-gray-500 uppercase tracking-[0.16em]">
                                        {t('whatWeDo:timeline.accompanied')}
                                    </p>
                                    <p className="text-lg md:text-xl font-extrabold text-[#A2140F]">
                                        634+
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contenu */}
            <section id="presentation" className="py-12 bg-gradient-to-b from-white to-gray-50">
                <div className="container mx-auto px-4 max-w-7xl">
                    {/* Présentation / Problématique / Objectif */}
                    <header className="mb-10 text-center">
                        <div className="inline-block mb-4">
                            <span className="inline-flex items-center px-4 py-2 rounded-full bg-[#A2140F]/10 text-[#A2140F] text-sm font-semibold">
                                {t('whatWeDo:program.subtitle')}
                            </span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-[#204F01] mb-6">
                            {t('whatWeDo:program.title')}
                        </h2>
                        <div className="w-32 h-1.5 bg-gradient-to-r from-[#A2140F] to-[#204F01] mx-auto mb-6 rounded-full" />
                        <p className="text-gray-700 text-lg md:text-xl max-w-4xl mx-auto leading-relaxed">
                            {t('whatWeDo:program.description')}
                        </p>
                    </header>

                    {/* Section Présentation / Problématique / Objectif - Design moderne et créatif */}
                    <div className="mb-10">
                        <div className="space-y-8">
                                {/* Présentation - Grande carte avec design premium */}
                                <div className="group relative bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                                    {/* Effet de brillance au hover */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#A2140F]/0 via-transparent to-[#A2140F]/0 group-hover:from-[#A2140F]/5 group-hover:via-[#A2140F]/10 group-hover:to-transparent transition-all duration-700"></div>
                                    
                                    {/* Bordure colorée animée */}
                                    <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-[#A2140F] via-[#c91a14] to-[#A2140F] group-hover:w-3 transition-all duration-300"></div>
                                    
                                    {/* Ligne décorative en haut */}
                                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#A2140F]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    
                                    <div className="relative z-10 p-8 md:p-10">
                                        <div className="flex items-start gap-6">
                                            {/* Icône circulaire avec gradient et animation */}
                                            <div className="flex-shrink-0 relative">
                                                <div className="absolute inset-0 bg-gradient-to-br from-[#A2140F] to-[#c91a14] rounded-2xl blur-lg opacity-50 group-hover:opacity-75 group-hover:scale-110 transition-all duration-300"></div>
                                                <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-[#A2140F] to-[#c91a14] flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                                                    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <h3 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-[#A2140F] to-[#c91a14] bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                                                        {t('whatWeDo:presentation.title')}
                                                    </h3>
                                                    <div className="flex-1 h-0.5 bg-gradient-to-r from-[#A2140F] to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                </div>
                                                <p className="text-gray-700 leading-relaxed text-base md:text-lg group-hover:text-gray-900 transition-colors duration-300">
                                    {t('whatWeDo:presentation.description')}
                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Ligne décorative en bas */}
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#A2140F]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                </div>

                                {/* Problématique et Objectif - Deux cartes côte à côte avec design moderne */}
                                <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                                    {/* Problématique */}
                                    <div className="group relative bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                                        {/* Effet de brillance au hover */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-[#204F01]/0 via-transparent to-[#204F01]/0 group-hover:from-[#204F01]/5 group-hover:via-[#204F01]/10 group-hover:to-transparent transition-all duration-700"></div>
                                        
                                        {/* Bordure colorée animée */}
                                        <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-[#204F01] via-[#2d6a02] to-[#204F01] group-hover:w-3 transition-all duration-300"></div>
                                        
                                        <div className="relative z-10 p-8">
                                            <div className="flex items-start gap-5 mb-5">
                                                {/* Icône circulaire avec gradient */}
                                                <div className="flex-shrink-0 relative">
                                                    <div className="absolute inset-0 bg-gradient-to-br from-[#204F01] to-[#2d6a02] rounded-2xl blur-lg opacity-50 group-hover:opacity-75 group-hover:scale-110 transition-all duration-300"></div>
                                                    <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-[#204F01] to-[#2d6a02] flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                                                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <h3 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-[#204F01] to-[#2d6a02] bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                                                            {t('whatWeDo:problematic.title')}
                                                        </h3>
                                                        <div className="flex-1 h-0.5 bg-gradient-to-r from-[#204F01] to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-gray-700 leading-relaxed text-sm md:text-base group-hover:text-gray-900 transition-colors duration-300">
                                    {t('whatWeDo:problematic.description')}
                                </p>
                                        </div>
                                        
                                        {/* Ligne décorative en bas */}
                                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#204F01]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    </div>

                                    {/* Objectif */}
                                    <div className="group relative bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                                        {/* Effet de brillance au hover */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-[#A2140F]/0 via-transparent to-[#A2140F]/0 group-hover:from-[#A2140F]/5 group-hover:via-[#A2140F]/10 group-hover:to-transparent transition-all duration-700"></div>
                                        
                                        {/* Bordure colorée animée */}
                                        <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-[#A2140F] via-[#c91a14] to-[#A2140F] group-hover:w-3 transition-all duration-300"></div>
                                        
                                        <div className="relative z-10 p-8">
                                            <div className="flex items-start gap-5 mb-5">
                                                {/* Icône circulaire avec gradient */}
                                                <div className="flex-shrink-0 relative">
                                                    <div className="absolute inset-0 bg-gradient-to-br from-[#A2140F] to-[#c91a14] rounded-2xl blur-lg opacity-50 group-hover:opacity-75 group-hover:scale-110 transition-all duration-300"></div>
                                                    <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-[#A2140F] to-[#c91a14] flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                                                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <h3 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-[#A2140F] to-[#c91a14] bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                                                            {t('whatWeDo:objective.title')}
                                                        </h3>
                                                        <div className="flex-1 h-0.5 bg-gradient-to-r from-[#A2140F] to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-gray-700 leading-relaxed text-sm md:text-base group-hover:text-gray-900 transition-colors duration-300">
                                    {t('whatWeDo:objective.description')}
                                </p>
                        </div>

                                        {/* Ligne décorative en bas */}
                                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#A2140F]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                            </div>
                                        </div>
                                </div>
                    </div>

                    {/* Résultats obtenus - Section horizontale */}
                    <section className="mb-12">
                        <div className="text-center mb-10">
                            <div className="inline-block mb-4">
                                <span className="inline-flex items-center px-4 py-2 rounded-full bg-[#204F01]/10 text-[#204F01] text-sm font-semibold">
                                    {t('whatWeDo:results.impactLabel')}
                                        </span>
                                    </div>
                            <h3 className="text-4xl md:text-5xl font-extrabold text-[#204F01] mb-4">
                                {t('whatWeDo:results.title')}
                        </h3>
                            <div className="w-32 h-1.5 bg-gradient-to-r from-[#A2140F] to-[#204F01] mx-auto rounded-full"></div>
                                </div>
                        <div className="relative bg-white rounded-3xl shadow-2xl border-2 border-gray-100 p-10 md:p-16 overflow-hidden">
                            {/* Éléments décoratifs modernes */}
                            <div className="absolute top-0 right-0 w-96 h-96 bg-[#A2140F]/3 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#204F01]/3 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
                            
                            {/* Lignes décoratives */}
                            <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-[#A2140F]/10 to-transparent"></div>
                            <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-[#204F01]/10 to-transparent"></div>
                            
                            {/* Contenu */}
                            <div className="relative z-10">
                                <Statistics />
                                </div>
                        </div>
                    </section>

                    {/* Trois piliers */}
                    <PillarsSection pillars={pillars} />

                    {/* Section Graphiques */}
                    <ChartsSection />

                    {/* Profils accompagnés */}
                    <ProfilesSection profiles={profiles} />

                    <div className="mt-10 text-center">
                        <a
                            href={`/documents/${encodeURIComponent('LAssociation-Initiative-Al-Amal-pour-lIntegration-Sociale.pdf')}`}
                            download="forsa-taahil-details.pdf"
                            className="inline-block bg-[#A2140F] text-white px-8 py-3 rounded-lg text-sm md:text-base font-semibold hover:bg-[#c91a14] transition-colors"
                        >
                            {t('whatWeDo:download.button')}
                        </a>
                    </div>
                </div>
            </section>
        </>
    );
}

export default WhatWeDo;


