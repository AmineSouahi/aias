import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { Link } from 'react-router-dom';

function SupportProjects() {
    const { t, i18n } = useTranslation(['common', 'contact']);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                // Envoyer la langue actuelle dans les headers
                const currentLang = i18n.language || 'fr';
                const response = await axios.get('/support-projects', {
                    headers: {
                        'Accept-Language': currentLang
                    }
                });
                const data = response.data?.data || [];
                console.log('Projects récupérés:', data);
                // Debug: vérifier les images
                data.forEach(project => {
                    if (project.image) {
                        console.log(`Projet "${project.title}" - Image: ${project.image}`);
                    } else {
                        console.log(`Projet "${project.title}" - Pas d'image`);
                    }
                });
                setProjects(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error fetching support projects:', error);
                setProjects([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, [i18n.language]);

    if (loading || projects.length === 0) {
        return null;
    }

    const formatCurrency = (value) =>
        new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'MAD',
            maximumFractionDigits: 0,
        }).format(value || 0);

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-[#204F01] mb-3">
                        {t('contact:projects.title')}
                    </h2>
                    <div className="w-24 h-1.5 bg-gradient-to-r from-[#A2140F] to-[#204F01] mx-auto rounded-full" />
                    <p className="mt-4 text-gray-700 max-w-3xl mx-auto">
                        {t('contact:projects.subtitle')}
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {projects.map((project) => {
                        const target = Number(project.target_amount) || 0;
                        const current = Number(project.current_amount) || 0;
                        const progress = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;

                        const CTA = project.cta_link
                            ? (
                                <Link
                                    to={project.cta_link}
                                    className="mt-auto inline-flex items-center justify-center px-4 py-2 rounded-lg bg-[#A2140F] text-white text-sm font-semibold hover:bg-[#c91a14] transition-colors"
                                >
                                    {project.cta_label || t('contact:projects.supportButton')}
                                </Link>
                            )
                            : null;

                        // Vérifier si l'image existe et est valide (doit contenir /storage/ ou être une URL)
                        const imageValue = project.image ? project.image.trim() : '';
                        const hasValidImage = imageValue !== '' && 
                            (imageValue.startsWith('/storage/') || 
                             imageValue.startsWith('storage/') || 
                             imageValue.startsWith('http') ||
                             imageValue.includes('/'));
                        
                        let imageUrl = null;
                        
                        if (hasValidImage) {
                            // Normaliser le chemin de l'image
                            let normalizedPath = imageValue;
                            
                            // Si le chemin commence déjà par /storage/, utiliser tel quel
                            if (!normalizedPath.startsWith('/storage/') && !normalizedPath.startsWith('http')) {
                                if (normalizedPath.startsWith('storage/')) {
                                    normalizedPath = '/' + normalizedPath;
                                } else if (normalizedPath.includes('/')) {
                                    // Si ça contient un slash mais ne commence pas par /storage/, ajouter /storage/
                                    normalizedPath = '/storage/' + normalizedPath.replace(/^\/+/, '');
                                } else {
                                    // Si c'est juste un nom de fichier, construire le chemin complet
                                    normalizedPath = '/storage/projects/images/' + normalizedPath;
                                }
                            }
                            
                            // Construire l'URL absolue
                            imageUrl = normalizedPath.startsWith('http') 
                                ? normalizedPath 
                                : `${window.location.origin}${normalizedPath}`;
                            
                            console.log(`📸 Image valide pour "${project.title}":`, {
                                original: project.image,
                                normalized: normalizedPath,
                                fullUrl: imageUrl
                            });
                        } else {
                            console.log(`⚠️ Image invalide ou manquante pour "${project.title}":`, imageValue);
                        }

                        return (
                            <article
                                key={project.id}
                                className="bg-white rounded-2xl shadow-md border border-gray-100 flex flex-col overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                            >
                                <div className="h-48 w-full overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 relative">
                                    {hasValidImage && imageUrl ? (
                                        <>
                                            <img
                                                src={imageUrl}
                                                alt={project.title || 'Projet'}
                                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                                onError={(e) => {
                                                    console.error('❌ ERREUR chargement image:', {
                                                        url: imageUrl,
                                                        original: project.image,
                                                        project: project.title
                                                    });
                                                    // Afficher le placeholder en cas d'erreur
                                                    e.target.style.display = 'none';
                                                    const placeholder = e.target.nextElementSibling;
                                                    if (placeholder) {
                                                        placeholder.style.display = 'flex';
                                                    }
                                                }}
                                                onLoad={() => {
                                                    console.log('✅ Image chargée avec succès:', imageUrl);
                                                }}
                                            />
                                            <div className="w-full h-full flex items-center justify-center absolute inset-0" style={{ display: 'none' }}>
                                                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                <div className="p-6 flex flex-col flex-1">
                                    <h3 className="text-xl font-bold text-[#204F01] mb-2">
                                        {project.title}
                                    </h3>
                                    {project.excerpt && (
                                        <p className="text-sm text-gray-700 mb-3">
                                            {project.excerpt}
                                        </p>
                                    )}
                                    {project.description && (
                                        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                                            {project.description}
                                        </p>
                                    )}

                                    <div className="mb-4">
                                        <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1">
                                            <span>{formatCurrency(current)} {t('contact:projects.collected')}</span>
                                            <span>{t('contact:projects.target')}: {formatCurrency(target)}</span>
                                        </div>
                                        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-3 bg-gradient-to-r from-[#A2140F] to-[#204F01] rounded-full transition-all duration-500"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                        <p className="mt-1 text-xs font-semibold text-[#204F01]">
                                            {progress}% {t('contact:projects.reached')}
                                        </p>
                                    </div>

                                    {CTA}
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


