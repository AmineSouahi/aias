import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

// Nom du fichier vidéo dans public/video (modifiable si vous changez la vidéo)
const HERO_VIDEO_FILENAME = "C4907_1.mp4";

function Hero() {
    const { t } = useTranslation(['common', 'home']);

    const videoSrc = '/video/' + encodeURIComponent(HERO_VIDEO_FILENAME);

    return (
        <section className="relative min-h-screen h-[100vh] overflow-hidden" id="home">
            {/* Vidéo en arrière-plan */}
            <div className="absolute inset-0">
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                    src={videoSrc}
                    aria-hidden="true"
                >
                    <source src={videoSrc} type="video/mp4" />
                </video>
                {/* Légère ombre pour garder le texte lisible, sans teinter la vidéo */}
                <div className="absolute inset-0 bg-black/25" />
            </div>

            {/* Contenu texte et boutons */}
            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 h-full pt-12 md:pt-16 flex items-center">
                <div className="max-w-2xl text-white animate-fade-in">
                    <p className="mb-2 md:mb-3 text-sm sm:text-base md:text-lg lg:text-xl font-medium text-white/90">
                        {t('home:hero.subtitle')}
                    </p>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-3 md:mb-4 drop-shadow-lg leading-tight">
                        {t('home:hero.title')}
                    </h2>
                    <p className="text-base sm:text-lg md:text-xl mb-2 md:mb-3 text-white/95 leading-relaxed">
                        {t('home:hero.mission')}
                    </p>
                    <div className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4 mt-6 md:mt-8">
                        <Link
                            to="/news"
                            className="inline-flex items-center justify-center px-7 md:px-8 py-2.5 md:py-3 rounded-full border border-white/70 bg-white/10 text-white font-semibold text-sm md:text-base text-center backdrop-blur-sm hover:bg-white hover:text-[#204F01] hover:border-white transition-all shadow-[0_10px_25px_rgba(15,23,42,0.25)]"
                        >
                            {t('home:hero.learnMore')}
                        </Link>
                        <a
                            href="#donation"
                            className="inline-flex items-center justify-center px-7 md:px-9 py-2.5 md:py-3 rounded-full bg-gradient-to-r from-[#A2140F] to-[#c91a14] text-white font-semibold text-sm md:text-base text-center shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                        >
                            <span className="mr-1.5">{t('home:hero.makeDonation')}</span>
                            <svg
                                className="w-4 h-4 md:w-5 md:h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                                />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Hero;
