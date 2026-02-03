import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import PartnerRequestForm from './PartnerRequestForm';

function Partenaires() {
    const { t, i18n } = useTranslation(['common', 'partners']);
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isManualScrolling, setIsManualScrolling] = useState(false);
    const scrollContainerRef = useRef(null);
    const autoScrollIntervalRef = useRef(null);
    const isRTL = i18n.language === 'ar';

    useEffect(() => {
        const fetchPartners = async () => {
            try {
                // Envoyer la langue actuelle dans les headers
                const currentLang = i18n.language || 'fr';
                const response = await axios.get('/partners', {
                    headers: {
                        'Accept-Language': currentLang
                    }
                });
                const data = response.data?.data || [];
                setPartners(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error fetching partners:', error);
                setPartners([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPartners();
    }, [i18n.language]);

    // Auto-scroll effect
    useEffect(() => {
        if (!loading && partners.length > 0 && !isManualScrolling && scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const scrollElement = container.querySelector('.scroll-content');
            
            if (scrollElement) {
                autoScrollIntervalRef.current = setInterval(() => {
                    if (isRTL) {
                        // En RTL, on scroll vers la gauche (négatif)
                        if (container.scrollLeft <= 0) {
                            container.scrollLeft = scrollElement.scrollWidth / 2;
                        } else {
                            container.scrollLeft -= 1;
                        }
                    } else {
                        // En LTR, on scroll vers la droite (positif)
                        if (container.scrollLeft >= scrollElement.scrollWidth / 2) {
                            container.scrollLeft = 0;
                        } else {
                            container.scrollLeft += 1;
                        }
                    }
                }, 30);
            }
        }

        return () => {
            if (autoScrollIntervalRef.current) {
                clearInterval(autoScrollIntervalRef.current);
            }
        };
    }, [loading, partners, isManualScrolling, isRTL]);

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            setIsManualScrolling(true);
            const scrollAmount = isRTL ? 80 : -80;
            scrollContainerRef.current.scrollBy({
                left: scrollAmount,
                behavior: 'smooth',
            });
            setTimeout(() => setIsManualScrolling(false), 700);
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            setIsManualScrolling(true);
            const scrollAmount = isRTL ? -80 : 80;
            scrollContainerRef.current.scrollBy({
                left: scrollAmount,
                behavior: 'smooth',
            });
            setTimeout(() => setIsManualScrolling(false), 700);
        }
    };

    return (
        <>
            {/* Style pour le carousel */}
            <style>{`
                .scroll-container {
                    scroll-behavior: smooth;
                }
                .scroll-container::-webkit-scrollbar {
                    display: none;
                }
                .scroll-container {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>

            {/* Hero Section avec image de partenariat */}
            <section className="relative h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden">
                <div className="relative h-full">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: `url(/images/partenaire1.webp)`,
                        }}
                    >
                        {/* Overlay gradient rouge-vert */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#A2140F]/95 via-[#A2140F]/85 to-[#204F01]/85" />
                    </div>
                    <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
                        <div className="max-w-2xl text-white animate-fade-in">
                            <p className="mb-2 md:mb-3 text-sm sm:text-base md:text-lg lg:text-xl font-medium text-white/90">
                                {t('partners:hero.associationName')}
                            </p>
                            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-3 md:mb-4 drop-shadow-lg leading-tight">
                                {t('partners:hero.title')}
                            </h2>
                            <p className="text-base sm:text-lg md:text-xl mb-2 md:mb-3 text-white/95 leading-relaxed">
                                {t('partners:hero.description')}
                            </p>
                            <p className="text-xs sm:text-sm md:text-base mb-6 md:mb-8 text-white/80 max-w-xl">
                                {t('partners:hero.description2')}
                            </p>
                            <div className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4">
                                <a
                                    href="#partner-form"
                                    className="inline-block bg-white text-[#A2140F] px-6 md:px-8 py-2.5 md:py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm md:text-base text-center"
                                >
                                    {t('partners:hero.becomePartner')}
                                </a>
                                <Link
                                    to="/ce-que-nous-faisons"
                                    className="inline-block bg-transparent border-2 border-white/80 text-white px-6 md:px-8 py-2.5 md:py-3 rounded-lg font-semibold hover:bg-white hover:text-[#A2140F] transition-colors text-sm md:text-base text-center"
                                >
                                    {t('partners:hero.ourPrograms')}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section Carousel automatique des logos */}
            <section className="py-12 bg-white overflow-hidden">
                <div className="container mx-auto px-4 mb-8">
                    <div className="text-center">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-[#204F01] mb-4">
                            {t('partners:carousel.title')}
                        </h2>
                        <div className="w-24 h-1.5 bg-gradient-to-r from-[#A2140F] to-[#204F01] mx-auto rounded-full mb-4"></div>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            {t('partners:carousel.description')}
                        </p>
                    </div>
                </div>

                {/* Carousel automatique */}
                <div className="relative">
                    {/* Bouton précédent */}
                    <button
                        onClick={scrollLeft}
                        className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 z-20 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-[#A2140F] hover:text-white group`}
                        aria-label={t('partners:carousel.previous')}
                    >
                        <svg
                            className={`w-6 h-6 text-[#A2140F] group-hover:text-white transition-colors ${isRTL ? 'transform scale-x-[-1]' : ''}`}
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

                    {/* Bouton suivant */}
                    <button
                        onClick={scrollRight}
                        className={`absolute ${isRTL ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 z-20 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-[#A2140F] hover:text-white group`}
                        aria-label={t('partners:carousel.next')}
                    >
                        <svg
                            className={`w-6 h-6 text-[#A2140F] group-hover:text-white transition-colors ${isRTL ? 'transform scale-x-[-1]' : ''}`}
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

                    {/* Gradient de gauche */}
                    <div className={`absolute ${isRTL ? 'right-0' : 'left-0'} top-0 bottom-0 w-32 ${isRTL ? 'bg-gradient-to-l' : 'bg-gradient-to-r'} from-white to-transparent z-10 pointer-events-none`}></div>
                    {/* Gradient de droite */}
                    <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} top-0 bottom-0 w-32 ${isRTL ? 'bg-gradient-to-r' : 'bg-gradient-to-l'} from-white to-transparent z-10 pointer-events-none`}></div>

                    <div 
                        className="overflow-x-auto scroll-container" 
                        ref={scrollContainerRef}
                        onMouseEnter={() => setIsManualScrolling(true)}
                        onMouseLeave={() => setTimeout(() => setIsManualScrolling(false), 1000)}
                    >
                        <div className="flex scroll-content" style={{ width: 'max-content' }}>
                            {/* Première série de logos */}
                            {loading ? (
                                <div className="flex items-center justify-center min-w-full">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#A2140F]"></div>
                                </div>
                            ) : partners.length === 0 ? (
                                <div className="flex items-center justify-center min-w-full text-gray-600">
                                    <p>{t('partners:carousel.noPartners')}</p>
                                </div>
                            ) : (
                                <>
                                    {[...partners, ...partners].map((partner, index) => (
                                        <div
                                            key={`${partner.id}-${index}`}
                                            className="flex-shrink-0 mx-6 flex items-center justify-center"
                                            style={{ minWidth: '160px', maxWidth: '160px', height: '160px' }}
                                        >
                                            <Link
                                                to={`/partenaires/${partner.id}`}
                                                className="w-full h-full flex items-center justify-center bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 p-6 border-2 border-gray-100 hover:border-[#A2140F]/30 cursor-pointer group overflow-hidden"
                                                style={{ aspectRatio: '1/1' }}
                                            >
                                                {partner.logo ? (
                                                    <img
                                                        src={partner.logo}
                                                        alt={partner.name}
                                                        className="w-24 h-24 object-contain group-hover:scale-110 transition-transform duration-300"
                                                    />
                                                ) : partner.image ? (
                                                    <img
                                                        src={partner.image}
                                                        alt={partner.name}
                                                        className="w-24 h-24 object-contain group-hover:scale-110 transition-transform duration-300"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center group-hover:from-[#A2140F]/10 group-hover:to-[#204F01]/10 transition-all duration-300">
                                                        <span className="text-gray-400 text-3xl font-bold group-hover:text-[#A2140F] transition-colors duration-300">
                                                            {partner.name?.charAt(0) || 'P'}
                                                        </span>
                                                    </div>
                                                )}
                                            </Link>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Formulaire de demande de partenariat */}
            <PartnerRequestForm />
        </>
    );
}

export default Partenaires;

