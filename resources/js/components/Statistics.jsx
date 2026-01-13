import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

function Statistics() {
    const { t } = useTranslation(['common']);
    const [statistics, setStatistics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [visibleIndices, setVisibleIndices] = useState(new Set());
    const sectionRef = useRef(null);
    
    // Fonction pour traduire le titre de la statistique
    const translateStatTitle = (title) => {
        const titleMap = {
            'BÉNÉFICIAIRES': t('common:statistics.beneficiaries'),
            'FORMATIONS PROFESSIONNELLES': t('common:statistics.professionalTrainings'),
            'BOURSES': t('common:statistics.scholarships'),
            'INSERTIONS PROFESSIONNELLES': t('common:statistics.professionalInsertions'),
        };
        return titleMap[title] || title;
    };

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                const response = await axios.get('/statistics');
                const data = response.data?.data || [];
                setStatistics(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error fetching statistics:', error);
                setStatistics([]);
            } finally {
                setLoading(false);
            }
        };

        fetchStatistics();
    }, []);

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
            { threshold: 0.3 }
        );

        const elements = document.querySelectorAll('[data-stat-circle]');
        elements.forEach((el) => observer.observe(el));

        return () => {
            elements.forEach((el) => observer.unobserve(el));
        };
    }, [statistics]);

    // Fonction pour obtenir l'icône SVG selon le nom
    const getIcon = (iconName) => {
        const icons = {
            users: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ),
            calendar: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            ),
            trophy: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
            ),
            heart: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            ),
            star: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
            ),
            chart: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
            handshake: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
            ),
            lightbulb: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
            ),
            book: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            ),
            'graduation-cap': (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14v9M12 14l-9-5m9 5l9-5m-9 5v9m0-9l-9-5m9 5l9-5" />
                </svg>
            ),
        };

        return icons[iconName] || null;
    };

    if (loading) {
        return null; // Ne rien afficher pendant le chargement
    }

    if (statistics.length === 0) {
        return null; // Ne rien afficher si pas de statistiques
    }

    // Couleurs du thème pour les anneaux (alternance rouge/vert)
    const ringColors = ['#A2140F', '#204F01', '#A2140F', '#204F01'];
    const numberColors = ['#A2140F', '#204F01', '#A2140F', '#204F01'];
    const shadowColors = [
        'rgba(162, 20, 15, 0.2)',
        'rgba(32, 79, 1, 0.2)',
        'rgba(162, 20, 15, 0.2)',
        'rgba(32, 79, 1, 0.2)',
    ];

    return (
        <div className="w-full" ref={sectionRef}>
            {/* 4 cercles horizontaux avec anneaux épais */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                {statistics.slice(0, 4).map((stat, index) => {
                    const isVisible = visibleIndices.has(index);
                    
                    return (
                        <div
                            key={stat.id}
                            data-stat-circle
                            data-index={index}
                            className="flex flex-col items-center justify-center group"
                            style={{
                                transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                                transitionDelay: `${index * 0.1}s`,
                                transform: isVisible
                                    ? 'translateY(0) scale(1)'
                                    : 'translateY(30px) scale(0.9)',
                                opacity: isVisible ? 1 : 0,
                            }}
                        >
                            {/* Cercle avec anneau épais et effets */}
                            <div className="relative mb-6 group-hover:scale-110 transition-transform duration-300">
                                {/* Ombre portée colorée */}
                                <div
                                    className="absolute inset-0 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    style={{
                                        backgroundColor: shadowColors[index],
                                        transform: 'scale(1.2)',
                                    }}
                                ></div>
                                
                                {/* Anneau extérieur épais avec effet de brillance */}
                                <svg
                                    width="160"
                                    height="160"
                                    className="relative z-10 transform -rotate-90"
                                >
                                    <defs>
                                        <linearGradient
                                            id={`ringGradient-${index}`}
                                            x1="0%"
                                            y1="0%"
                                            x2="100%"
                                            y2="100%"
                                        >
                                            <stop
                                                offset="0%"
                                                stopColor={ringColors[index]}
                                                stopOpacity="1"
                                            />
                                            <stop
                                                offset="50%"
                                                stopColor={ringColors[index]}
                                                stopOpacity="0.9"
                                            />
                                            <stop
                                                offset="100%"
                                                stopColor={ringColors[index]}
                                                stopOpacity="0.8"
                                            />
                                        </linearGradient>
                                    </defs>
                                    {/* Anneau extérieur épais */}
                                    <circle
                                        cx="80"
                                        cy="80"
                                        r="68"
                                        fill="none"
                                        stroke={`url(#ringGradient-${index})`}
                                        strokeWidth="18"
                                        className="drop-shadow-lg"
                                    />
                                    {/* Cercle intérieur blanc avec ombre */}
                                    <circle
                                        cx="80"
                                        cy="80"
                                        r="50"
                                        fill="white"
                                        className="shadow-inner"
                                    />
                                </svg>
                                
                                {/* Nombre au centre avec animation */}
                                <div className="absolute inset-0 flex items-center justify-center z-20">
                                    <span
                                        className="text-4xl md:text-5xl font-extrabold tracking-tight group-hover:scale-110 transition-transform duration-300"
                                        style={{ color: numberColors[index] }}
                                    >
                                        {stat.value}
                                    </span>
                                </div>
                            </div>
                            
                            {/* Label en dessous avec style amélioré */}
                            <h4 className="text-xs md:text-sm font-bold text-gray-900 uppercase tracking-wider text-center max-w-[140px] leading-tight group-hover:text-[#204F01] transition-colors duration-300">
                                {translateStatTitle(stat.title)}
                            </h4>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Statistics;

