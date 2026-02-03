import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import axios from 'axios';

/** Construit l'URL absolue d'une image projet (storage ou http). */
function getProjectImageUrl(value) {
    if (!value || typeof value !== 'string') return null;
    const v = value.trim();
    if (!v) return null;
    if (v.startsWith('http://') || v.startsWith('https://')) return v;
    let path = v;
    if (!path.startsWith('/')) path = path.startsWith('storage/') ? '/' + path : '/storage/' + path.replace(/^\/+/, '');
    return `${window.location.origin}${path}`;
}

function SupportProjects() {
    const { t, i18n } = useTranslation(['common', 'contact']);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;
        const fetchProjects = async () => {
            try {
                const lang = i18n.language || 'fr';
                const res = await axios.get('/support-projects', {
                    headers: { 'Accept-Language': lang },
                });
                const data = res.data?.data ?? res.data;
                const list = Array.isArray(data) ? data : [];
                if (!cancelled) setProjects(list);
            } catch (e) {
                if (!cancelled) {
                    setError(e.message || 'Erreur chargement');
                    setProjects([]);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        fetchProjects();
        return () => { cancelled = true; };
    }, [i18n.language]);

    const formatCurrency = (val) =>
        new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'MAD', maximumFractionDigits: 0 }).format(Number(val) || 0);

    if (loading) {
        return (
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4 max-w-7xl flex justify-center items-center min-h-[200px]">
                    <div className="inline-block animate-spin rounded-full h-10 w-10 border-2 border-[#A2140F] border-t-transparent" />
                </div>
            </section>
        );
    }

    if (error || !projects.length) {
        return null;
    }

    return (
        <section className="py-16 bg-white" aria-labelledby="projects-heading">
            <div className="container mx-auto px-4 max-w-7xl">
                <header className="text-center mb-12">
                    <h2 id="projects-heading" className="text-3xl md:text-4xl font-extrabold text-[#204F01] mb-3">
                        {t('contact:projects.title')}
                    </h2>
                    <div className="w-24 h-1.5 bg-gradient-to-r from-[#A2140F] to-[#204F01] mx-auto rounded-full" />
                    <p className="mt-4 text-gray-700 max-w-3xl mx-auto">
                        {t('contact:projects.subtitle')}
                    </p>
                </header>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {projects.map((project) => {
                        const target = Number(project.target_amount) || 0;
                        const current = Number(project.current_amount) || 0;
                        const progress = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;
                        const imgUrl = getProjectImageUrl(project.image);

                        return (
                            <article
                                key={project.id}
                                className="bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
                            >
                                <div className="relative h-52 bg-gray-100 overflow-hidden">
                                    {imgUrl ? (
                                        <img
                                            src={imgUrl}
                                            alt={project.title || ''}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            <svg className="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
                                            </svg>
                                        </div>
                                    )}
                                    {project.category && (
                                        <span className="absolute top-3 left-3 px-2 py-1 text-xs font-semibold bg-[#204F01] text-white rounded-md">
                                            {project.category}
                                        </span>
                                    )}
                                </div>
                                <div className="p-5 md:p-6 flex flex-col flex-1">
                                    <h3 className="text-lg md:text-xl font-bold text-[#204F01] mb-2 line-clamp-2">
                                        {project.title}
                                    </h3>
                                    {(project.excerpt || project.description) && (
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
                                            {project.excerpt || project.description}
                                        </p>
                                    )}
                                    <div className="mb-4">
                                        <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1">
                                            <span>{formatCurrency(current)} {t('contact:projects.collected')}</span>
                                            <span>{t('contact:projects.target')}: {formatCurrency(target)}</span>
                                        </div>
                                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-2 bg-gradient-to-r from-[#A2140F] to-[#204F01] rounded-full transition-all duration-500"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                        <p className="mt-1 text-xs font-semibold text-[#204F01]">{progress}% {t('contact:projects.reached')}</p>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-auto">
                                        <Link
                                            to={`/projets/${project.id}`}
                                            className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-gray-100 text-gray-800 text-sm font-semibold hover:bg-gray-200 transition-colors"
                                        >
                                            {t('contact:projects.viewDetails')}
                                        </Link>
                                        <Link
                                            to={project.cta_link || '/don'}
                                            className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-[#A2140F] text-white text-sm font-semibold hover:bg-[#c91a14] transition-colors"
                                        >
                                            {project.cta_label || t('contact:projects.supportButton')}
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

export default SupportProjects;
