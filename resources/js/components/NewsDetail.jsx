import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

function NewsDetail() {
    const { t, i18n } = useTranslation(['common', 'news']);
    const { id } = useParams();
    const navigate = useNavigate();
    const [news, setNews] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                // Envoyer la langue actuelle dans les headers
                const currentLang = i18n.language || 'fr';
                const response = await axios.get(`/news/${id}`, {
                    headers: {
                        'Accept-Language': currentLang
                    }
                });
                const newsData = response.data?.data || response.data;
                setNews(newsData);

                // Réinitialiser l'image courante quand on charge une nouvelle actu
                if (newsData?.images && Array.isArray(newsData.images) && newsData.images.length > 0) {
                    setCurrentImageIndex(0);
                }
            } catch (err) {
                console.error('Error fetching news:', err);
                setError(t('news:detail.notFound'));
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchNews();
        }
    }, [id, i18n.language]);

    if (loading) {
        return (
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#A2140F]"></div>
                    <p className="mt-4 text-gray-600">{t('common.loading')}</p>
                </div>
            </section>
        );
    }

    if (error || !news) {
        return (
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-2xl font-bold text-[#204F01] mb-4">{t('news:detail.notFound')}</h1>
                    <p className="text-gray-600 mb-6">{error || t('news:detail.notExists')}</p>
                    <Link
                        to="/news"
                        className="inline-block bg-[#A2140F] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#c91a14] transition-colors"
                    >
                        {t('news:detail.backToNews')}
                    </Link>
                </div>
            </section>
        );
    }

    return (
        <>
            {/* Hero Section - Positionné au maximum en haut */}
            <section className="relative h-[450px] md:h-[550px] lg:h-[600px] overflow-hidden" style={{ marginTop: 0, paddingTop: 0, top: 0 }}>
                <div className="relative h-full">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={
                            news.image
                                ? { backgroundImage: `url(${news.image})`, top: 0 }
                                : { backgroundColor: '#A2140F', top: 0 }
                        }
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-[#A2140F]/95 via-[#A2140F]/85 to-[#204F01]/85" style={{ top: 0 }} />
                    </div>
                    <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center pt-8 md:pt-12 lg:pt-16">
                        <div className="max-w-3xl text-white">
                            <p className="mb-2 text-sm md:text-base text-white/90">
                                {news.published_at
                                    ? new Date(news.published_at).toLocaleDateString(
                                          i18n.language === 'ar' ? 'ar-MA' : i18n.language === 'en' ? 'en-US' : 'fr-FR',
                                          {
                                              year: 'numeric',
                                              month: 'long',
                                              day: 'numeric',
                                          }
                                      )
                                    : t('news:badge')}
                            </p>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 drop-shadow-lg leading-tight">
                                {news.title}
                            </h1>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contenu détaillé */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4 max-w-4xl">
                    {/* Bouton retour */}
                    <Link
                        to="/news"
                        className="inline-flex items-center text-[#A2140F] font-semibold hover:text-[#c91a14] mb-8 transition-colors"
                    >
                        <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                        {t('news:detail.backToNews')}
                    </Link>

                    {/* Extrait */}
                    <div className="mb-8">
                        <p className="text-xl text-gray-700 leading-relaxed">{news.excerpt}</p>
                    </div>

                    {/* Contenu */}
                    {news.content && (
                        <div className="mb-8 prose prose-lg max-w-none">
                            <div
                                className="text-gray-700 leading-relaxed whitespace-pre-wrap"
                                dangerouslySetInnerHTML={{
                                    __html: news.content.replace(/\n/g, '<br />'),
                                }}
                            />
                        </div>
                    )}

                    {/* Galerie d'images - Slider moderne */}
                    {news.images && Array.isArray(news.images) && news.images.length > 0 && (
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-[#204F01] mb-4">{t('news:detail.gallery')}</h2>

                            {/* Image principale avec navigation */}
                            <div className="relative rounded-2xl overflow-hidden shadow-lg bg-gray-100 flex items-center justify-center min-h-[360px] md:min-h-[420px]">
                                <img
                                    src={news.images[currentImageIndex]}
                                    alt={`${news.title} - Image ${currentImageIndex + 1}`}
                                    className="w-full max-h-[480px] md:max-h-[560px] object-contain transition-all duration-500"
                                />

                                {/* Badge compteur */}
                                <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
                                    {currentImageIndex + 1} / {news.images.length}
                                </div>

                                {/* Boutons précédent/suivant */}
                                {news.images.length > 1 && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setCurrentImageIndex((prev) =>
                                                    prev === 0 ? news.images.length - 1 : prev - 1
                                                )
                                            }
                                            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-md transition-colors"
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
                                                    d="M15 19l-7-7 7-7"
                                                />
                                            </svg>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setCurrentImageIndex((prev) =>
                                                    prev === news.images.length - 1 ? 0 : prev + 1
                                                )
                                            }
                                            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-md transition-colors"
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
                                                    d="M9 5l7 7-7 7"
                                                />
                                            </svg>
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Vignettes */}
                            {news.images.length > 1 && (
                                <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
                                    {news.images.map((img, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => setCurrentImageIndex(index)}
                                            className={`relative flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden border transition-all bg-gray-100 flex items-center justify-center ${
                                                currentImageIndex === index
                                                    ? 'border-[#A2140F] ring-2 ring-[#A2140F]/40'
                                                    : 'border-gray-200 hover:border-[#A2140F]/60'
                                            }`}
                                        >
                                            <img
                                                src={img}
                                                alt={`${news.title} - vignette ${index + 1}`}
                                                className="w-full h-full object-contain"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Vidéo */}
                    {news.video_url && (
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-[#204F01] mb-4">{t('news:detail.video')}</h2>
                            <div className="rounded-lg overflow-hidden shadow-md">
                                {news.video_url.startsWith('http') ? (
                                    // URL externe (YouTube, Vimeo, etc.)
                                    <div className="aspect-video">
                                        <iframe
                                            src={news.video_url}
                                            className="w-full h-full"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                ) : (
                                    // Fichier vidéo local
                                    <video
                                        src={news.video_url}
                                        controls
                                        className="w-full"
                                    >
                                        {t('news:detail.videoNotSupported')}
                                    </video>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Informations supplémentaires */}
                    {news.published_at && (
                        <div className="border-t border-gray-200 pt-8 mt-8">
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                <div>
                                    <span className="font-semibold">{t('news:detail.publicationDate')}</span>{' '}
                                    {new Date(news.published_at).toLocaleDateString(
                                        i18n.language === 'ar' ? 'ar-MA' : i18n.language === 'en' ? 'en-US' : 'fr-FR',
                                        {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        }
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}

export default NewsDetail;

