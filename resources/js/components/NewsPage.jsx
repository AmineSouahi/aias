import React from 'react';
import { useTranslation } from 'react-i18next';
import News from './News';

function NewsPage() {
    const { t } = useTranslation(['common', 'news']);
    return (
        <>
            {/* Hero Section comme les autres pages */}
            <section className="relative mt-16 md:mt-20 h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden">
                <div className="relative h-full">
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
                                {t('news:hero.associationName')}
                            </p>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-3 md:mb-4 drop-shadow-lg leading-tight">
                                {t('news:hero.title')}
                            </h1>
                            <p className="text-base sm:text-lg md:text-xl mb-2 md:mb-3 text-white/95 leading-relaxed">
                                {t('news:hero.description1')}
                            </p>
                            <p className="text-xs sm:text-sm md:text-base mb-6 md:mb-8 text-white/80 max-w-xl">
                                {t('news:hero.description2')}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Liste des actualités */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <News />
                </div>
            </section>
        </>
    );
}

export default NewsPage;


