import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

function WhoWeAre() {
    const { t } = useTranslation(['common', 'home']);
    
    return (
        <section id="about" className="bg-white py-16">
            <div className="max-w-4xl mx-auto text-center mb-10 px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-[#204F01] mb-4">
                    {t('home:whoWeAre.title')}
                </h2>
                <div className="w-24 h-1 bg-[#A2140F] mx-auto mb-4"></div>
            </div>

            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        {/* Image */}
                        <div className="order-1 md:order-1">
                            <div className="bg-gray-100 rounded-lg p-4">
                                <img
                                    src="/images/team_2025.webp"
                                    alt={t('home:whoWeAre.imageAlt')}
                                    className="w-full h-auto rounded-lg object-cover"
                                />
                            </div>
                        </div>

                        {/* Text Content */}
                        <div className="order-2 md:order-2">
                            <div className="space-y-6">
                                <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                                    {t('home:whoWeAre.associationName')}
                                </h3>
                                
                                <p className="text-gray-700 leading-relaxed">
                                    {t('home:whoWeAre.description')}
                                </p>

                                <Link
                                    to="/qui-nous-sommes"
                                    className="inline-block bg-[#A2140F] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#c91a14] transition-colors"
                                >
                                    {t('home:whoWeAre.learnMore')}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default WhoWeAre;

