import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

function getProjectImageUrl(value) {
    if (!value || typeof value !== 'string') return null;
    const v = value.trim();
    if (!v) return null;
    if (v.startsWith('http://') || v.startsWith('https://')) return v;
    let path = v;
    if (!path.startsWith('/')) path = path.startsWith('storage/') ? '/' + path : '/storage/' + path.replace(/^\/+/, '');
    return `${window.location.origin}${path}`;
}

function getProjectMediaUrl(value) {
    if (!value || typeof value !== 'string') return null;
    const v = value.trim();
    if (!v) return null;
    if (v.startsWith('http://') || v.startsWith('https://')) return v;
    let path = v;
    if (!path.startsWith('/')) path = path.startsWith('storage/') ? '/' + path : '/storage/' + path.replace(/^\/+/, '');
    return `${window.location.origin}${path}`;
}

function getVideoEmbedUrl(url) {
    if (!url || typeof url !== 'string') return null;
    const u = url.trim();
    if (!u.startsWith('http')) return null;
    try {
        const parsed = new URL(u);
        const host = parsed.hostname || '';
        if (host.includes('youtube.com') && parsed.searchParams.get('v')) {
            return `https://www.youtube.com/embed/${parsed.searchParams.get('v')}`;
        }
        if (host.includes('youtu.be')) {
            const id = parsed.pathname.replace(/^\//, '').split('/')[0];
            return id ? `https://www.youtube.com/embed/${id}` : null;
        }
        if (host.includes('vimeo.com')) {
            const m = u.match(/vimeo\.com\/(?:video\/)?(\d+)/);
            return m ? `https://player.vimeo.com/video/${m[1]}` : null;
        }
        return u;
    } catch {
        return null;
    }
}

function SupportProjectDetail() {
    const { t, i18n } = useTranslation(['common', 'contact']);
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

    useEffect(() => {
        let cancelled = false;
        const fetchProject = async () => {
            try {
                const lang = i18n.language || 'fr';
                const res = await axios.get(`/support-projects/${id}`, {
                    headers: { 'Accept-Language': lang },
                });
                const data = res.data?.data ?? res.data;
                if (!cancelled) setProject(data);
            } catch (e) {
                if (!cancelled) setError(t('contact:projectDetail.notFound'));
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        if (id) fetchProject();
        return () => { cancelled = true; };
    }, [id, i18n.language, t]);

    useEffect(() => {
        setCurrentPhotoIndex(0);
    }, [id]);

    const formatCurrency = (val) =>
        new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'MAD', maximumFractionDigits: 0 }).format(Number(val) || 0);

    if (loading) {
        return (
            <section className="pt-20 md:pt-24 pb-16 bg-white min-h-[50vh] flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-2 border-[#A2140F] border-t-transparent" />
                    <p className="mt-4 text-gray-600">{t('contact:projectDetail.loading')}</p>
                </div>
            </section>
        );
    }

    if (error || !project) {
        return (
            <section className="pt-20 md:pt-24 pb-16 bg-white min-h-[50vh] flex items-center justify-center">
                <div className="text-center px-4">
                    <h1 className="text-2xl font-bold text-[#204F01] mb-4">{t('contact:projectDetail.notFound')}</h1>
                    <p className="text-gray-600 mb-6">{error || t('contact:projectDetail.notFound')}</p>
                    <Link
                        to="/nous-soutenir"
                        className="inline-flex items-center bg-[#A2140F] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#c91a14] transition-colors"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        {t('contact:projectDetail.backToProjects')}
                    </Link>
                </div>
            </section>
        );
    }

    const target = Number(project.target_amount) || 0;
    const current = Number(project.current_amount) || 0;
    const progress = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;
    const imgUrl = getProjectImageUrl(project.image);
    const videoEmbedUrl = getVideoEmbedUrl(project.video);
    const photos = Array.isArray(project.photos) ? project.photos : [];
    const photoUrls = photos.map((p) => getProjectMediaUrl(p)).filter(Boolean);

    return (
        <>
            {/* Hero avec image et titre */}
            <section className="relative mt-16 md:mt-20 min-h-[320px] md:min-h-[400px] overflow-hidden">
                <div className="absolute inset-0">
                    {imgUrl ? (
                        <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#204F01] to-[#A2140F]" />
                    )}
                    <div className="absolute inset-0 bg-black/50" />
                </div>
                <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 h-full min-h-[320px] md:min-h-[400px] flex flex-col justify-end pb-8 md:pb-12">
                    <div className="max-w-4xl">
                        {project.category && (
                            <span className="inline-block px-3 py-1 text-sm font-semibold bg-[#204F01] text-white rounded-md mb-3">
                                {project.category}
                            </span>
                        )}
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg leading-tight">
                            {project.title}
                        </h1>
                        {project.excerpt && (
                            <p className="mt-3 text-lg md:text-xl text-white/95 max-w-2xl">{project.excerpt}</p>
                        )}
                    </div>
                </div>
            </section>

            {/* Contenu */}
            <section className="py-12 md:py-16 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                    <Link
                        to="/nous-soutenir"
                        className="inline-flex items-center text-gray-600 hover:text-[#A2140F] mb-8 transition-colors group"
                    >
                        <svg className="w-4 h-4 mr-2 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        {t('contact:projectDetail.backToProjects')}
                    </Link>

                    {/* Barre de progression */}
                    <div className="bg-gray-50 rounded-2xl p-6 md:p-8 mb-8 border border-gray-100">
                        <div className="flex flex-wrap justify-between gap-4 mb-3">
                            <div>
                                <p className="text-sm font-semibold text-gray-600">{t('contact:projectDetail.collected')}</p>
                                <p className="text-2xl md:text-3xl font-bold text-[#204F01]">{formatCurrency(current)}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-semibold text-gray-600">{t('contact:projectDetail.target')}</p>
                                <p className="text-2xl md:text-3xl font-bold text-gray-800">{formatCurrency(target)}</p>
                            </div>
                        </div>
                        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-3 bg-gradient-to-r from-[#A2140F] to-[#204F01] rounded-full transition-all duration-700"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <p className="mt-2 text-sm font-semibold text-[#204F01]">{progress}% {t('contact:projectDetail.reached')}</p>
                    </div>

                    {/* Description */}
                    {project.description && (
                        <div className="mb-10">
                            <h2 className="text-xl font-bold text-[#204F01] mb-4">{t('contact:projectDetail.description')}</h2>
                            <div className="w-12 h-0.5 bg-[#A2140F] rounded-full mb-4" />
                            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">{project.description}</div>
                        </div>
                    )}

                    {/* Galerie photos — après la description */}
                    {photoUrls.length > 0 && (
                        <div className="mb-10">
                            <h2 className="text-xl font-bold text-[#204F01] mb-4">{t('contact:projectDetail.photos')}</h2>
                            <div className="w-12 h-0.5 bg-[#A2140F] rounded-full mb-6" />
                            <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100 bg-gray-50">
                                {/* Image principale — object-contain pour afficher la photo en entier */}
                                <div className="relative bg-gray-100 flex justify-center items-center min-h-[200px] py-4">
                                    <img
                                        src={photoUrls[currentPhotoIndex]}
                                        alt={`${project.title} - ${currentPhotoIndex + 1}`}
                                        className="max-w-full w-auto max-h-[75vh] object-contain rounded-lg"
                                    />
                                    {photoUrls.length > 1 && (
                                        <>
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-2 md:pl-4">
                                                <button
                                                    type="button"
                                                    onClick={() => setCurrentPhotoIndex((i) => (i === 0 ? photoUrls.length - 1 : i - 1))}
                                                    className="p-2.5 rounded-full bg-white/90 hover:bg-white text-gray-800 shadow-md transition-colors"
                                                    aria-label="Photo précédente"
                                                >
                                                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                                                </button>
                                            </div>
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-2 md:pr-4">
                                                <button
                                                    type="button"
                                                    onClick={() => setCurrentPhotoIndex((i) => (i === photoUrls.length - 1 ? 0 : i + 1))}
                                                    className="p-2.5 rounded-full bg-white/90 hover:bg-white text-gray-800 shadow-md transition-colors"
                                                    aria-label="Photo suivante"
                                                >
                                                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                                </button>
                                            </div>
                                            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-black/60 text-white text-sm font-semibold">
                                                {currentPhotoIndex + 1} / {photoUrls.length}
                                            </div>
                                        </>
                                    )}
                                </div>
                                {/* Miniatures */}
                                {photoUrls.length > 1 && (
                                    <div className="p-3 md:p-4 bg-white border-t border-gray-100">
                                        <div className="flex gap-2 md:gap-3 overflow-x-auto pb-1 scrollbar-thin">
                                            {photoUrls.map((url, i) => (
                                                <button
                                                    key={i}
                                                    type="button"
                                                    onClick={() => setCurrentPhotoIndex(i)}
                                                    className={`flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all focus:outline-none focus:ring-2 focus:ring-[#A2140F] focus:ring-offset-2 ${currentPhotoIndex === i ? 'border-[#A2140F] ring-2 ring-[#A2140F]/40 shadow-md' : 'border-gray-200 hover:border-[#204F01]/50 hover:shadow-sm'}`}
                                                >
                                                    <img src={url} alt="" className="w-20 h-20 md:w-24 md:h-24 object-cover" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Vidéo — après les photos */}
                    {videoEmbedUrl && (
                        <div className="mb-10">
                            <h2 className="text-xl font-bold text-[#204F01] mb-4">{t('contact:projectDetail.video')}</h2>
                            <div className="w-12 h-0.5 bg-[#A2140F] rounded-full mb-4" />
                            <div className="rounded-xl overflow-hidden shadow-lg bg-black aspect-video">
                                <iframe
                                    src={videoEmbedUrl}
                                    title={project.title}
                                    className="w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        </div>
                    )}

                    {/* CTA Soutenir */}
                    <div className="pt-6 border-t border-gray-200">
                        <Link
                            to={project.cta_link || '/don'}
                            className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 rounded-xl bg-[#A2140F] text-white font-bold text-lg hover:bg-[#c91a14] transition-colors shadow-lg hover:shadow-xl"
                        >
                            {project.cta_label || t('contact:projectDetail.supportButton')}
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}

export default SupportProjectDetail;
