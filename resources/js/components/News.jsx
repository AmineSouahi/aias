import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

function News({ limit = null, showMoreButton = false }) {
    const { t, i18n } = useTranslation(['common', 'news']);
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedYear, setSelectedYear] = useState('all');

    // Données de fallback par défaut
    const defaultNews = [
        {
            id: 1,
            title: "L'Association Initiative Al Amal pour l'Intégration Sociale organise la 4ème Édition de la Journée d'Intégration 2025",
            excerpt:
                "L'Association Initiative Al Amal pour l'Intégration Sociale organise la 4ème Édition de la Journée d'Intégration 2025, le lundi 22 septembre 2025 à 14h00. Un événement marquant pour célébrer l'intégration sociale des jeunes.",
            image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
            published_at: '2025-09-15',
        },
        {
            id: 2,
            title: 'Best Of – Cérémonie de Remise des Diplômes',
            excerpt:
                'Revivez en images et en émotions les moments forts de la cérémonie de remise des diplômes des étudiants en Assistance Sociale du Centre Al Amal de Sou...',
            image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800',
            published_at: '2025-08-20',
        },
        {
            id: 3,
            title: 'La cérémonie de remise des diplômes',
            excerpt:
                "Un moment d'émotion, de fierté et d'espoir 🎓 Le 25 juillet 2025, nous avons célébré un chapitre inoubliable dans l'histoire de notre association...",
            image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800',
            published_at: '2025-07-25',
        },
    ];

    useEffect(() => {
        const fetchNews = async () => {
            try {
                // Envoyer la langue actuelle dans les headers
                const currentLang = i18n.language || 'fr';
                const response = await axios.get('/news', {
                    headers: {
                        'Accept-Language': currentLang
                    }
                });
                const newsData = response.data?.data?.data || response.data?.data || response.data || [];
                
                // Si on a des données valides, on les utilise, sinon on utilise les données par défaut
                if (Array.isArray(newsData) && newsData.length > 0) {
                    setNews(newsData);
                } else {
                    setNews(defaultNews);
                }
            } catch (error) {
                console.error('Error fetching news:', error);
                // En cas d'erreur, utiliser les données par défaut
                setNews(defaultNews);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, [i18n.language]);

    // Liste des années disponibles pour le filtre
    const years = Array.from(
        new Set(
            news
                .map((item) => {
                    const date = item.published_at || item.date;
                    return date ? new Date(date).getFullYear() : null;
                })
                .filter(Boolean)
        )
    ).sort((a, b) => b - a);

    const filteredNews =
        selectedYear === 'all'
            ? news
            : news.filter((item) => {
                  const date = item.published_at || item.date;
                  if (!date) return false;
                  const itemYear = new Date(date).getFullYear();
                  return itemYear.toString() === selectedYear;
              });

    return (
        <section id="news" className="bg-white py-16">
            <div className="max-w-4xl mx-auto text-center mb-10 px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-[#204F01] mb-4">
                    {t('news:title')}
                </h2>
                <div className="w-24 h-1 bg-[#A2140F] mx-auto mb-4"></div>
                <p className="text-gray-700">
                    {t('news:subtitle')}
                </p>
            </div>

            <div className="container mx-auto px-4">
                {/* Filtres - seulement si pas de limite (page complète) */}
                {!limit && years.length > 0 && (
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-gray-700">
                                {t('news:filter.label')}
                            </span>
                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A2140F]"
                            >
                                <option value="all">{t('news:filter.all')}</option>
                                {years.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#A2140F]"></div>
                    </div>
                ) : filteredNews.length === 0 ? (
                    <div className="text-center py-12 text-gray-600">
                        {t('news:noNews')}
                    </div>
                ) : (
                    <>
                        <div className="grid md:grid-cols-3 gap-8">
                            {(limit ? filteredNews.slice(0, limit) : filteredNews).map((item) => (
                            <article
                                key={item.id}
                                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                            >
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                                    />
                                    <div className="absolute top-4 left-4 bg-[#A2140F] text-white px-3 py-1 rounded text-sm font-semibold">
                                        {t('news:badge')}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <p className="text-gray-500 text-sm mb-2">
                                        {t('news:published')} {new Date(item.published_at || item.date).toLocaleDateString(
                                            i18n.language === 'ar' ? 'ar-MA' : i18n.language === 'en' ? 'en-US' : 'fr-FR',
                                            {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            }
                                        )}
                                    </p>
                                    <h3 className="text-xl font-bold text-[#204F01] mb-3 line-clamp-2">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-600 mb-4 line-clamp-3">
                                        {item.excerpt}
                                    </p>
                                    <Link
                                        to={`/news/${item.id}`}
                                        className="text-[#A2140F] font-semibold hover:text-[#c91a14] transition-colors inline-flex items-center"
                                    >
                                        {t('news:readMore')}
                                        <svg
                                            className="w-4 h-4 ml-2"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 5l7 7-7 7"
                                            />
                                        </svg>
                                    </Link>
                                </div>
                            </article>
                        ))}
                        </div>
                        {showMoreButton && limit && filteredNews.length > limit && (
                            <div className="text-center mt-10">
                                <Link
                                    to="/news"
                                    className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-gradient-to-r from-[#A2140F] to-[#c91a14] text-white font-semibold hover:from-[#c91a14] hover:to-[#A2140F] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                                >
                                    {t('news:seeMore')}
                                    <svg
                                        className="w-5 h-5 ml-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                                        />
                                    </svg>
                                </Link>
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
}

export default News;

