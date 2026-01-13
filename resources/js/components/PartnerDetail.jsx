import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

function PartnerDetail() {
    const { t, i18n } = useTranslation(['common', 'partners']);
    const { id } = useParams();
    const [partner, setPartner] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const fetchPartner = async () => {
            try {
                // Envoyer la langue actuelle dans les headers
                const currentLang = i18n.language || 'fr';
                const response = await axios.get(`/partners/${id}`, {
                    headers: {
                        'Accept-Language': currentLang
                    }
                });
                const partnerData = response.data?.data || response.data;
                setPartner(partnerData);
            } catch (err) {
                console.error('Error fetching partner:', err);
                setError(t('partners:detail.notFound'));
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchPartner();
        }
    }, [id, i18n.language]);

    if (loading) {
        return (
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#A2140F]"></div>
                    <p className="mt-4 text-gray-600">{t('partners:detail.loading')}</p>
                </div>
            </section>
        );
    }

    if (error || !partner) {
        return (
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-2xl font-bold text-[#204F01] mb-4">{t('partners:detail.notFound')}</h1>
                    <p className="text-gray-600 mb-6">{error || t('partners:detail.notFoundDescription')}</p>
                    <Link
                        to="/partenaires"
                        className="inline-block bg-[#A2140F] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#c91a14] transition-colors"
                    >
                        {t('partners:detail.backToPartners')}
                    </Link>
                </div>
            </section>
        );
    }

    // Combiner l'image principale et les images de la galerie
    const allImages = [];
    if (partner.image) allImages.push(partner.image);
    if (partner.images && Array.isArray(partner.images)) {
        allImages.push(...partner.images);
    }

    return (
        <>
            {/* Contenu détaillé */}
            <section className="pt-20 md:pt-24 pb-12 md:pb-16 bg-white">
                <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-[95%] lg:max-w-[1400px]">
                    {/* Bouton retour */}
                    <Link
                        to="/partenaires"
                        className="inline-flex items-center text-gray-600 hover:text-[#A2140F] mb-10 transition-colors group"
                    >
                        <svg
                            className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform"
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
                        {t('partners:detail.backToPartners')}
                    </Link>

                    {/* Carte principale */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-10">
                        {/* Header avec logo et titre */}
                        <div className="bg-gradient-to-r from-gray-50 to-white p-8 md:p-10 border-b border-gray-100">
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                                {partner.logo && (
                                    <div className="flex-shrink-0">
                                        <div className="bg-white rounded-xl p-5 shadow-md border border-gray-200">
                                            <img
                                                src={partner.logo}
                                                alt={`Logo ${partner.name}`}
                                                className="w-28 h-28 md:w-36 md:h-36 object-contain"
                                            />
                                        </div>
                                    </div>
                                )}
                                <div className="flex-1">
                                    <div className="mb-3">
                                        <span className="inline-block bg-[#A2140F] text-white px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider">
                                            {t('partners:detail.partnerBadge')}
                                        </span>
                                    </div>
                                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#204F01] leading-tight">
                                        {partner.name}
                                    </h1>
                                </div>
                            </div>
                        </div>

                        {/* Contenu */}
                        <div className="p-8 md:p-10">
                            {/* Description */}
                            {partner.description && (
                                <div className="mb-10">
                                    <div className="w-16 h-1 bg-[#A2140F] rounded-full mb-6"></div>
                                    <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-4xl">
                                        {partner.description}
                                    </p>
                                </div>
                            )}

                            {/* Stats et actions */}
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Bénéficiaires */}
                                {partner.beneficiaries_count && partner.beneficiaries_count > 0 && (
                                    <div className="flex items-center">
                                        <div className="w-full bg-[#A2140F] rounded-lg px-6 py-4 text-white shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center h-full">
                                            <div className="text-center">
                                                <div className="text-4xl md:text-5xl font-bold mb-1">
                                                    {partner.beneficiaries_count.toLocaleString()}
                                                </div>
                                                <p className="text-xs uppercase tracking-wider font-semibold">
                                                    {t('partners:detail.beneficiaries')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Bouton site web */}
                                {partner.website_url && (
                                    <div className="flex items-center">
                                        <a
                                            href={partner.website_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full bg-white border-2 border-[#A2140F] text-[#A2140F] px-6 py-4 rounded-lg font-semibold text-center hover:bg-[#A2140F] hover:text-white transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 h-full text-sm"
                                        >
                                            <span>{t('partners:detail.visitWebsite')}</span>
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
                                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                                />
                                            </svg>
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Galerie d'images */}
                    {allImages.length > 0 && (
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                            <div className="p-8 md:p-10">
                                <div className="mb-8">
                                    <h2 className="text-2xl md:text-3xl font-bold text-[#204F01] mb-3">{t('partners:detail.gallery')}</h2>
                                    <div className="w-16 h-1 bg-[#A2140F] rounded-full"></div>
                                </div>
                                
                                {/* Image principale */}
                                <div className="relative mb-6 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shadow-md group">
                                    <div className="relative aspect-video">
                                        <img
                                            src={allImages[currentImageIndex]}
                                            alt={`${partner.name} - Image ${currentImageIndex + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                        
                                        {/* Badge compteur */}
                                        {allImages.length > 1 && (
                                            <div className="absolute top-4 right-4 bg-[#A2140F] text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-lg">
                                                {currentImageIndex + 1} / {allImages.length}
                                            </div>
                                        )}

                                        {/* Navigation */}
                                        {allImages.length > 1 && (
                                            <>
                                                <button
                                                    onClick={() =>
                                                        setCurrentImageIndex((prev) =>
                                                            prev === 0 ? allImages.length - 1 : prev - 1
                                                        )
                                                    }
                                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2.5 rounded-lg shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100"
                                                    aria-label={t('partners:detail.previousImage')}
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
                                                    onClick={() =>
                                                        setCurrentImageIndex((prev) =>
                                                            prev === allImages.length - 1 ? 0 : prev + 1
                                                        )
                                                    }
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2.5 rounded-lg shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100"
                                                    aria-label={t('partners:detail.nextImage')}
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
                                </div>

                                {/* Miniatures */}
                                {allImages.length > 1 && (
                                    <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                                        {allImages.map((img, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setCurrentImageIndex(index)}
                                                className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                                                    currentImageIndex === index
                                                        ? 'border-[#A2140F] ring-2 ring-[#A2140F]/20'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            >
                                                <img
                                                    src={img}
                                                    alt={`Miniature ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}

export default PartnerDetail;

