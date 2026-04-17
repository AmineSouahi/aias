import React, { useEffect, useState } from 'react';
import axios from 'axios';

function NewsAdmin() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [stats, setStats] = useState({
        total: 0,
        published: 0,
        drafts: 0,
    });
    const [form, setForm] = useState({
        id: null,
        title: '',
        title_fr: '',
        title_ar: '',
        title_en: '',
        excerpt: '',
        excerpt_fr: '',
        excerpt_ar: '',
        excerpt_en: '',
        content: '',
        content_fr: '',
        content_ar: '',
        content_en: '',
        image: '', // chemin existant éventuel
        images: [], // chemins existants éventuels
        video_url: '', // URL ou chemin de la vidéo
        imageFile: null,
        deleteImage: false,
        galleryFiles: [],
        deleteGalleryImages: [],
        videoFile: null,
        deleteVideo: false,
        published_at: '',
        is_published: true,
    });

    const resetForm = () =>
        setForm({
            id: null,
            title: '',
            title_fr: '',
            title_ar: '',
            title_en: '',
            excerpt: '',
            excerpt_fr: '',
            excerpt_ar: '',
            excerpt_en: '',
            content: '',
            content_fr: '',
            content_ar: '',
            content_en: '',
            image: '',
            images: [],
            video_url: '',
            imageFile: null,
            deleteImage: false,
            galleryFiles: [],
            deleteGalleryImages: [],
            videoFile: null,
            deleteVideo: false,
            published_at: '',
            is_published: true,
        });

    const loadNews = async () => {
        setLoading(true);
        setError('');
        try {
            // On ne dépend plus de /news/stats (qui te donnait un 404),
            // on calcule les stats directement à partir de la liste.
            const listRes = await axios.get('/news');

            // L'API retourne: { success: true, data: [...] }
            let data = [];

            if (listRes.data?.success && Array.isArray(listRes.data.data)) {
                data = listRes.data.data;
            } else if (Array.isArray(listRes.data?.data)) {
                data = listRes.data.data;
            } else if (Array.isArray(listRes.data)) {
                data = listRes.data;
            }

            const safeItems = Array.isArray(data) ? data : [];
            setItems(safeItems);

            // Calcul des statistiques côté frontend
            const total = safeItems.length;
            const published = safeItems.filter((n) => n.is_published).length;
            const drafts = total - published;

            setStats({
                total,
                published,
                drafts,
            });
        } catch (e) {
            console.error('Erreur lors du chargement des actualités:', e);
            setError("Impossible de charger les actualités.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadNews();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const formData = new FormData();
            formData.append('title', form.title_fr || form.title);
            formData.append('title_fr', form.title_fr || form.title);
            formData.append('title_ar', form.title_ar || '');
            formData.append('title_en', form.title_en || '');
            formData.append('excerpt', form.excerpt_fr || form.excerpt);
            formData.append('excerpt_fr', form.excerpt_fr || form.excerpt);
            formData.append('excerpt_ar', form.excerpt_ar || '');
            formData.append('excerpt_en', form.excerpt_en || '');
            if (form.content_fr || form.content) formData.append('content', form.content_fr || form.content);
            if (form.content_fr) formData.append('content_fr', form.content_fr);
            if (form.content_ar) formData.append('content_ar', form.content_ar);
            if (form.content_en) formData.append('content_en', form.content_en);
            if (form.published_at) formData.append('published_at', form.published_at);
            formData.append('is_published', form.is_published ? '1' : '0');

            // Fichiers
            if (form.deleteImage) {
                formData.append('delete_image', '1');
            } else if (form.imageFile) {
                formData.append('image', form.imageFile);
            }
            
            if (form.deleteGalleryImages && form.deleteGalleryImages.length > 0) {
                form.deleteGalleryImages.forEach((img) => {
                    formData.append('delete_gallery_images[]', img);
                });
            }
            
            if (form.galleryFiles && form.galleryFiles.length) {
                form.galleryFiles.forEach((file) => {
                    formData.append('images[]', file);
                });
            }
            
            if (form.deleteVideo) {
                formData.append('delete_video', '1');
            } else if (form.videoFile) {
                formData.append('video', form.videoFile);
            }

            // Si tu veux continuer à supporter une URL distante en plus
            if (form.video_url) {
                formData.append('video_url', form.video_url);
            }

            if (form.id) {
                formData.append('_method', 'PUT');
                await axios.post(`/news/${form.id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            } else {
                await axios.post('/news', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            }

            await loadNews();
            resetForm();
        } catch (e) {
            console.error(e);
            setError("Erreur lors de l'enregistrement de l'actualité.");
        }
    };

    const handleEdit = (item) => {
        setForm({
            id: item.id,
            title: item.title || item.title_fr || '',
            title_fr: item.title_fr || item.title || '',
            title_ar: item.title_ar || '',
            title_en: item.title_en || '',
            excerpt: item.excerpt || item.excerpt_fr || '',
            excerpt_fr: item.excerpt_fr || item.excerpt || '',
            excerpt_ar: item.excerpt_ar || '',
            excerpt_en: item.excerpt_en || '',
            content: item.content || item.content_fr || '',
            content_fr: item.content_fr || item.content || '',
            content_ar: item.content_ar || '',
            content_en: item.content_en || '',
            image: item.image || '',
            images: item.images || [],
            video_url: item.video_url || '',
            imageFile: null,
            deleteImage: false,
            galleryFiles: [],
            deleteGalleryImages: [],
            videoFile: null,
            deleteVideo: false,
            published_at: item.published_at || '',
            is_published: Boolean(item.is_published),
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Supprimer cette actualité ?')) return;
        setError('');
        try {
            await axios.delete(`/news/${id}`);
            await loadNews();
        } catch (e) {
            console.error(e);
            setError('Impossible de supprimer cette actualité.');
        }
    };

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-[#204F01] mb-2">
                        Tableau de bord – Actualités
                    </h1>
                    <p className="text-gray-600">
                        Suivez l&apos;activité des actualités et gérez leur contenu depuis ce panneau.
                    </p>
                </div>

                {/* Cards de stats */}
                <div className="grid md:grid-cols-3 gap-4 mb-10">
                    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500 mb-1">
                            Total actualités
                        </p>
                        <p className="text-2xl font-extrabold text-[#204F01]">
                            {stats.total}
                        </p>
                    </div>
                    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500 mb-1">
                            Publiées
                        </p>
                        <p className="text-2xl font-extrabold text-green-700">
                            {stats.published}
                        </p>
                    </div>
                    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500 mb-1">
                            Brouillons
                        </p>
                        <p className="text-2xl font-extrabold text-amber-600">
                            {stats.drafts}
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="mb-4 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {/* Formulaire */}
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 md:p-8 mb-12">
                    <h2 className="text-xl font-bold text-[#204F01] mb-4">
                        {form.id ? 'Modifier une actualité' : 'Créer une nouvelle actualité'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Date de publication
                                </label>
                                <input
                                    type="date"
                                    value={form.published_at || ''}
                                    onChange={(e) =>
                                        setForm((f) => ({ ...f, published_at: e.target.value }))
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A2140F]"
                                />
                            </div>
                        </div>

                        {/* Traductions - Titre */}
                        <div className="border border-gray-200 rounded-lg p-4 bg-white">
                            <h3 className="text-sm font-semibold text-gray-700 mb-3">Titre *</h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                        Français *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={form.title_fr}
                                        onChange={(e) =>
                                            setForm((f) => ({ ...f, title_fr: e.target.value, title: e.target.value }))
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A2140F]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                        Arabe
                                    </label>
                                    <input
                                        type="text"
                                        value={form.title_ar}
                                        onChange={(e) =>
                                            setForm((f) => ({ ...f, title_ar: e.target.value }))
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A2140F]"
                                        dir="rtl"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                        Anglais
                                    </label>
                                    <input
                                        type="text"
                                        value={form.title_en}
                                        onChange={(e) =>
                                            setForm((f) => ({ ...f, title_en: e.target.value }))
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A2140F]"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Traductions - Extrait */}
                        <div className="border border-gray-200 rounded-lg p-4 bg-white">
                            <h3 className="text-sm font-semibold text-gray-700 mb-3">Extrait (court résumé) *</h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                        Français *
                                    </label>
                                    <textarea
                                        required
                                        rows={2}
                                        value={form.excerpt_fr}
                                        onChange={(e) =>
                                            setForm((f) => ({ ...f, excerpt_fr: e.target.value, excerpt: e.target.value }))
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A2140F]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                        Arabe
                                    </label>
                                    <textarea
                                        rows={2}
                                        value={form.excerpt_ar}
                                        onChange={(e) =>
                                            setForm((f) => ({ ...f, excerpt_ar: e.target.value }))
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A2140F]"
                                        dir="rtl"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                        Anglais
                                    </label>
                                    <textarea
                                        rows={2}
                                        value={form.excerpt_en}
                                        onChange={(e) =>
                                            setForm((f) => ({ ...f, excerpt_en: e.target.value }))
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A2140F]"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Traductions - Contenu */}
                        <div className="border border-gray-200 rounded-lg p-4 bg-white">
                            <h3 className="text-sm font-semibold text-gray-700 mb-3">Contenu détaillé</h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                        Français
                                    </label>
                                    <textarea
                                        rows={5}
                                        value={form.content_fr}
                                        onChange={(e) =>
                                            setForm((f) => ({ ...f, content_fr: e.target.value, content: e.target.value }))
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A2140F]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                        Arabe
                                    </label>
                                    <textarea
                                        rows={5}
                                        value={form.content_ar}
                                        onChange={(e) =>
                                            setForm((f) => ({ ...f, content_ar: e.target.value }))
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A2140F]"
                                        dir="rtl"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                        Anglais
                                    </label>
                                    <textarea
                                        rows={5}
                                        value={form.content_en}
                                        onChange={(e) =>
                                            setForm((f) => ({ ...f, content_en: e.target.value }))
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A2140F]"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 items-start">
                            <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Image principale (depuis votre ordinateur)
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    setForm((f) => ({
                                        ...f,
                                        imageFile: e.target.files?.[0] || null,
                                    }))
                                }
                                className="w-full text-sm"
                            />
                            {form.image && !form.deleteImage && (
                                <div className="mt-2 relative">
                                    <p className="text-xs text-gray-500 mb-2">Image actuelle :</p>
                                    <div className="relative inline-block">
                                        <img
                                            src={form.image}
                                            alt="Image actuelle"
                                            className="w-full max-w-xs h-32 object-cover rounded-lg border border-gray-300"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setForm((f) => ({ ...f, deleteImage: true, image: '', imageFile: null }))}
                                            className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1.5 hover:bg-red-700 transition-colors shadow-lg"
                                            title="Supprimer l'image"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            )}
                            {form.deleteImage && (
                                <div className="mt-2 text-sm text-red-600 italic">
                                    Image marquée pour suppression
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Autres images (plusieurs fichiers)
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) =>
                                    setForm((f) => {
                                        const newFiles = Array.from(e.target.files || []);
                                        const existing = Array.isArray(f.galleryFiles) ? f.galleryFiles : [];
                                        return {
                                            ...f,
                                            // Keep previously selected files and append new ones.
                                            galleryFiles: [...existing, ...newFiles],
                                        };
                                    })
                                }
                                className="w-full text-sm"
                            />
                            {form.images && form.images.length > 0 && (
                                <div className="mt-2">
                                    <p className="text-xs text-gray-500 mb-2">
                                        Images actuelles ({form.images.filter(img => !form.deleteGalleryImages.includes(img)).length}) :
                                    </p>
                                    <div className="grid grid-cols-3 gap-2">
                                        {form.images.map((img, idx) => {
                                            const isDeleted = form.deleteGalleryImages.includes(img);
                                            return (
                                                <div key={idx} className="relative">
                                                    {!isDeleted ? (
                                                        <>
                                                            <img
                                                                src={img}
                                                                alt={`Galerie ${idx + 1}`}
                                                                className="w-full h-20 object-cover rounded border border-gray-300"
                                                                onError={(e) => {
                                                                    e.target.style.display = 'none';
                                                                }}
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => setForm((f) => ({
                                                                    ...f,
                                                                    deleteGalleryImages: [...f.deleteGalleryImages, img]
                                                                }))}
                                                                className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition-colors shadow-lg"
                                                                title="Supprimer cette image"
                                                            >
                                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                </svg>
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <div className="w-full h-20 bg-gray-200 rounded border border-gray-300 flex items-center justify-center">
                                                            <span className="text-xs text-red-600 italic">Supprimée</span>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Vidéo (fichier local)
                                    </label>
                                    <input
                                        type="file"
                                        accept="video/*"
                                        onChange={(e) =>
                                            setForm((f) => ({
                                                ...f,
                                                videoFile: e.target.files?.[0] || null,
                                            }))
                                        }
                                        className="w-full text-sm"
                                    />
                                    {form.video_url && !form.deleteVideo && (
                                        <div className="mt-2 relative">
                                            <p className="text-xs text-gray-500 mb-2">Vidéo actuelle :</p>
                                            <div className="relative inline-block">
                                                <div className="bg-gray-100 border border-gray-300 rounded-lg p-3 max-w-xs">
                                                    <p className="text-xs text-gray-600 truncate">{form.video_url}</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setForm((f) => ({ ...f, deleteVideo: true, video_url: '', videoFile: null }))}
                                                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1.5 hover:bg-red-700 transition-colors shadow-lg"
                                                    title="Supprimer la vidéo"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    {form.deleteVideo && (
                                        <div className="mt-2 text-sm text-red-600 italic">
                                            Vidéo marquée pour suppression
                                        </div>
                                    )}
                                </div>
                            </div>
                            <label className="inline-flex items-center gap-2 mt-4 md:mt-7 text-sm text-gray-700">
                                <input
                                    type="checkbox"
                                    checked={form.is_published}
                                    onChange={(e) =>
                                        setForm((f) => ({
                                            ...f,
                                            is_published: e.target.checked,
                                        }))
                                    }
                                    className="rounded border-gray-300 text-[#A2140F] focus:ring-[#A2140F]"
                                />
                                <span>Afficher sur le site public</span>
                            </label>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 pt-2">
                            <button
                                type="submit"
                                className="bg-[#A2140F] text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-[#c91a14] transition-colors"
                            >
                                {form.id ? 'Enregistrer les modifications' : 'Créer l’actualité'}
                            </button>
                            {form.id && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="text-sm font-medium text-gray-600 hover:text-gray-800"
                                >
                                    Annuler la modification
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Liste */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-[#204F01]">
                            Actualités existantes
                        </h2>
                        {loading && (
                            <span className="text-sm text-gray-500">Chargement...</span>
                        )}
                    </div>

                    {loading ? (
                        <div className="text-center py-8">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#A2140F]"></div>
                            <p className="mt-2 text-sm text-gray-500">Chargement des actualités...</p>
                        </div>
                    ) : items.length === 0 ? (
                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
                            <svg
                                className="mx-auto h-12 w-12 text-gray-400 mb-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                                />
                            </svg>
                            <p className="text-gray-600 text-sm mb-2">
                                Aucune actualité pour le moment.
                            </p>
                            <p className="text-gray-500 text-xs">
                                Utilisez le formulaire ci-dessus pour créer votre première actualité.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto border border-gray-200 rounded-xl">
                            <table className="min-w-full text-sm">
                                <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
                                    <tr>
                                        <th className="px-4 py-3">Titre</th>
                                        <th className="px-4 py-3">Date</th>
                                        <th className="px-4 py-3">Publiée</th>
                                        <th className="px-4 py-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 bg-white">
                                    {items.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-3 font-medium text-gray-900">
                                                {item.title}
                                            </td>
                                            <td className="px-4 py-3 text-gray-600">
                                                {item.published_at ||
                                                    (item.created_at ?? '').slice(0, 10)}
                                            </td>
                                            <td className="px-4 py-3">
                                                {item.is_published ? (
                                                    <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                                                        Oui
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600">
                                                        Non
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleEdit(item)}
                                                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-[#204F01] rounded-md hover:bg-[#2d6a02] transition-colors"
                                                        title="Modifier cette actualité"
                                                    >
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
                                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                            />
                                                        </svg>
                                                        Modifier
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(item.id)}
                                                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                                                        title="Supprimer cette actualité"
                                                    >
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
                                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                            />
                                                        </svg>
                                                        Supprimer
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

export default NewsAdmin;


