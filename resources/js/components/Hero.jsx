import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Hero() {
    const { t, i18n } = useTranslation(['common', 'home']);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [slides, setSlides] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSlides = async () => {
            try {
                // Envoyer la langue actuelle dans les headers
                const currentLang = i18n.language || 'fr';
                const response = await axios.get('/slides', {
                    headers: {
                        'Accept-Language': currentLang
                    }
                });
                const data = response.data?.data || [];
                setSlides(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error fetching slides:', error);
                // Slides par défaut en cas d'erreur
                setSlides([
                    {
                        title: 'Cérémonie d\'Accueil des Jeunes Orphelins Bacheliers',
                        description: 'Une cérémonie de graduation mémorable pour nos jeunes bacheliers, au siège du conseil de la région Casablanca-Settat',
                        image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200',
                        button_text: '',
                        button_link: '',
                    },
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchSlides();
    }, [i18n.language]);

    useEffect(() => {
        if (slides.length > 0) {
            const interval = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % slides.length);
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [slides.length]);

    const missionText = t('home:hero.mission');

    if (loading) {
        return (
            <section className="relative mt-16 md:mt-20 h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden bg-gray-200 flex items-center justify-center" id="home">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#A2140F]"></div>
                    <p className="mt-4 text-gray-600">{t('common:common.loading')}</p>
                </div>
            </section>
        );
    }

    if (slides.length === 0) {
        return null;
    }

    return (
        <section className="relative mt-16 md:mt-20 h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden" id="home">
            {/* Slides */}
            <div className="relative h-full">
                {slides.map((slide, index) => (
                    <div
                        key={slide.id || index}
                        className={`absolute inset-0 transition-opacity duration-1000 ${
                            index === currentSlide ? 'opacity-100' : 'opacity-0'
                        }`}
                    >
                        <div
                            className="absolute inset-0 bg-cover bg-center hero-zoom"
                            style={{
                                backgroundImage: slide.image ? `url(${slide.image})` : 'none',
                                backgroundColor: slide.image ? 'transparent' : '#A2140F',
                            }}
                        >
                            {/* Overlay plus marqué pour une meilleure lisibilité */}
                            <div className="absolute inset-0 bg-gradient-to-r from-[#A2140F]/95 via-[#A2140F]/85 to-[#204F01]/85" />
                        </div>
                        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
                            <div className="max-w-2xl text-white animate-fade-in">
                                <p className="mb-2 md:mb-3 text-sm sm:text-base md:text-lg lg:text-xl font-medium text-white/90">
                                    {t('home:hero.subtitle')}
                                </p>
                                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-3 md:mb-4 drop-shadow-lg leading-tight">
                                    {slide.title}
                                </h2>
                                {slide.description && (
                                    <p className="text-base sm:text-lg md:text-xl mb-2 md:mb-3 text-white/95 leading-relaxed">
                                        {slide.description}
                                    </p>
                                )}
                                <p className="text-xs sm:text-sm md:text-base mb-6 md:mb-8 text-white/80 max-w-xl">
                                    {missionText}
                                </p>
                                <div className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4">
                                    {slide.button_text && slide.button_link ? (
                                        <Link
                                            to={slide.button_link}
                                            className="inline-block bg-white text-[#A2140F] px-6 md:px-8 py-2.5 md:py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm md:text-base text-center"
                                        >
                                            {slide.button_text}
                                        </Link>
                                    ) : (
                                        <>
                                            <a
                                                href="#about"
                                                className="inline-block bg-white text-[#A2140F] px-6 md:px-8 py-2.5 md:py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm md:text-base text-center"
                                            >
                                                {t('home:hero.learnMore')}
                                            </a>
                                            <a
                                                href="#donation"
                                                className="inline-block bg-transparent border-2 border-white/80 text-white px-6 md:px-8 py-2.5 md:py-3 rounded-lg font-semibold hover:bg-white hover:text-[#A2140F] transition-colors text-sm md:text-base text-center"
                                            >
                                                {t('home:hero.makeDonation')}
                                            </a>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Slide Indicators */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all ${
                            index === currentSlide
                                ? 'bg-white w-8'
                                : 'bg-white/50'
                        }`}
                    />
                ))}
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={() =>
                    setCurrentSlide(
                        (currentSlide - 1 + slides.length) % slides.length
                    )
                }
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-colors"
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
                        d="M15 19l-7-7 7-7"
                    />
                </svg>
            </button>
            <button
                onClick={() =>
                    setCurrentSlide((currentSlide + 1) % slides.length)
                }
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-colors"
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
                        d="M9 5l7 7-7 7"
                    />
                </svg>
            </button>
        </section>
    );
}

export default Hero;

