import React, { useEffect, useState } from 'react';
import axios from 'axios';

function PartnersAdmin() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [form, setForm] = useState({
        id: null,
        name: '',
        name_fr: '',
        name_ar: '',
        name_en: '',
        logo: '',
        logoFile: null,
        deleteLogo: false,
        image: '',
        imageFile: null,
        deleteImage: false,
        images: [],
        galleryFiles: [],
        deleteGalleryImages: [],
        excerpt: '',
        excerpt_fr: '',
        excerpt_ar: '',
        excerpt_en: '',
        description: '',
        description_fr: '',
        description_ar: '',
        description_en: '',
        website_url: '',
        beneficiaries_count: 0,
        order: 0,
        is_active: true,
    });

    const resetForm = () =>
        setForm({
            id: null,
            name: '',
            name_fr: '',
            name_ar: '',
            name_en: '',
            logo: '',
            logoFile: null,
            deleteLogo: false,
            image: '',
            imageFile: null,
            deleteImage: false,
            images: [],
            galleryFiles: [],
            deleteGalleryImages: [],
            excerpt: '',
            excerpt_fr: '',
            excerpt_ar: '',
            excerpt_en: '',
            description: '',
            description_fr: '',
            description_ar: '',
            description_en: '',
            website_url: '',
            beneficiaries_count: 0,
            order: 0,
            is_active: true,
        });

    const loadPartners = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get('/partners/all');
            const data = response.data?.data || [];
            setItems(Array.isArray(data) ? data : []);
        } catch (e) {
            console.error('Erreur lors du chargement:', e);
            setError("Impossible de charger les partenaires.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPartners();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const formData = new FormData();
            formData.append('name', form.name_fr || form.name);
            formData.append('name_fr', form.name_fr || form.name);
            formData.append('name_ar', form.name_ar || '');
            formData.append('name_en', form.name_en || '');
            if (form.excerpt_fr || form.excerpt) formData.append('excerpt', form.excerpt_fr || form.excerpt);
            if (form.excerpt_fr) formData.append('excerpt_fr', form.excerpt_fr);
            if (form.excerpt_ar) formData.append('excerpt_ar', form.excerpt_ar);
            if (form.excerpt_en) formData.append('excerpt_en', form.excerpt_en);
            if (form.description_fr || form.description) formData.append('description', form.description_fr || form.description);
            if (form.description_fr) formData.append('description_fr', form.description_fr);
            if (form.description_ar) formData.append('description_ar', form.description_ar);
            if (form.description_en) formData.append('description_en', form.description_en);
            if (form.website_url) formData.append('website_url', form.website_url);
            formData.append('beneficiaries_count', form.beneficiaries_count.toString());
            formData.append('order', form.order.toString());
            formData.append('is_active', form.is_active ? '1' : '0');

            if (form.deleteLogo) {
                formData.append('delete_logo', '1');
            } else if (form.logoFile) {
                formData.append('logo', form.logoFile);
            }
            
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

            if (form.id) {
                formData.append('_method', 'PUT');
                await axios.post(`/partners/${form.id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            } else {
                await axios.post('/partners', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            }

            await loadPartners();
            resetForm();
        } catch (e) {
            console.error(e);
            setError("Erreur lors de l'enregistrement du partenaire.");
        }
    };

    const handleEdit = (item) => {
        setForm({
            id: item.id,
            name: item.name || item.name_fr || '',
            name_fr: item.name_fr || item.name || '',
            name_ar: item.name_ar || '',
            name_en: item.name_en || '',
            logo: item.logo || '',
            logoFile: null,
            deleteLogo: false,
            image: item.image || '',
            imageFile: null,
            deleteImage: false,
            images: item.images || [],
            galleryFiles: [],
            deleteGalleryImages: [],
            excerpt: item.excerpt || item.excerpt_fr || '',
            excerpt_fr: item.excerpt_fr || item.excerpt || '',
            excerpt_ar: item.excerpt_ar || '',
            excerpt_en: item.excerpt_en || '',
            description: item.description || item.description_fr || '',
            description_fr: item.description_fr || item.description || '',
            description_ar: item.description_ar || '',
            description_en: item.description_en || '',
            website_url: item.website_url || '',
            beneficiaries_count: item.beneficiaries_count || 0,
            order: item.order || 0,
            is_active: Boolean(item.is_active),
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Supprimer ce partenaire ?')) return;
        setError('');
        try {
            await axios.delete(`/partners/${id}`);
            await loadPartners();
        } catch (e) {
            console.error(e);
            setError('Impossible de supprimer ce partenaire.');
        }
    };

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-[#204F01] mb-2">
                        Tableau de bord – Partenaires
                    </h1>
                    <p className="text-gray-600">
                        Gérez vos partenaires depuis ce panneau. Ajoutez, modifiez ou supprimez des partenaires.
                    </p>
                </div>

                {error && (
                    <div className="mb-4 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {/* Formulaire */}
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 md:p-8 mb-12">
                    <h2 className="text-xl font-bold text-[#204F01] mb-4">
                        {form.id ? 'Modifier un partenaire' : 'Créer un nouveau partenaire'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Ordre d'affichage
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={form.order}
                                    onChange={(e) =>
                                        setForm((f) => ({ ...f, order: parseInt(e.target.value) || 0 }))
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A2140F]"
                                />
                            </div>
                        </div>

                        {/* Traductions - Nom */}
                        <div className="border border-gray-200 rounded-lg p-4 bg-white">
                            <h3 className="text-sm font-semibold text-gray-700 mb-3">Nom du partenaire *</h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                        Français *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={form.name_fr}
                                        onChange={(e) =>
                                            setForm((f) => ({ ...f, name_fr: e.target.value, name: e.target.value }))
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
                                        value={form.name_ar}
                                        onChange={(e) =>
                                            setForm((f) => ({ ...f, name_ar: e.target.value }))
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
                                        value={form.name_en}
                                        onChange={(e) =>
                                            setForm((f) => ({ ...f, name_en: e.target.value }))
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A2140F]"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Traductions - Extrait */}
                        <div className="border border-gray-200 rounded-lg p-4 bg-white">
                            <h3 className="text-sm font-semibold text-gray-700 mb-3">Extrait (court résumé pour les cartes)</h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                        Français
                                    </label>
                                    <textarea
                                        rows={2}
                                        value={form.excerpt_fr}
                                        onChange={(e) =>
                                            setForm((f) => ({ ...f, excerpt_fr: e.target.value, excerpt: e.target.value }))
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A2140F]"
                                        placeholder="Court résumé qui apparaîtra sur la carte..."
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

                        {/* Traductions - Description */}
                        <div className="border border-gray-200 rounded-lg p-4 bg-white">
                            <h3 className="text-sm font-semibold text-gray-700 mb-3">Description complète</h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                        Français
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={form.description_fr}
                                        onChange={(e) =>
                                            setForm((f) => ({ ...f, description_fr: e.target.value, description: e.target.value }))
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A2140F]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                        Arabe
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={form.description_ar}
                                        onChange={(e) =>
                                            setForm((f) => ({ ...f, description_ar: e.target.value }))
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
                                        rows={3}
                                        value={form.description_en}
                                        onChange={(e) =>
                                            setForm((f) => ({ ...f, description_en: e.target.value }))
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A2140F]"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Logo (depuis votre ordinateur)
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        setForm((f) => ({
                                            ...f,
                                            logoFile: e.target.files?.[0] || null,
                                        }))
                                    }
                                    className="w-full text-sm"
                                />
                                {form.logo && !form.deleteLogo && (
                                    <div className="mt-2 relative">
                                        <p className="text-xs text-gray-500 mb-2">Logo actuel :</p>
                                        <div className="relative inline-block">
                                            <img
                                                src={form.logo}
                                                alt="Logo actuel"
                                                className="w-32 h-32 object-contain rounded-lg border border-gray-300 bg-white p-2"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setForm((f) => ({ ...f, deleteLogo: true, logo: '', logoFile: null }))}
                                                className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1.5 hover:bg-red-700 transition-colors shadow-lg"
                                                title="Supprimer le logo"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {form.deleteLogo && (
                                    <div className="mt-2 text-sm text-red-600 italic">
                                        Logo marqué pour suppression
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Image principale (pour les cartes)
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
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Autres images (galerie - plusieurs fichiers)
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={(e) =>
                                        setForm((f) => ({
                                            ...f,
                                            galleryFiles: Array.from(e.target.files || []),
                                        }))
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
                                    Site web (URL)
                                </label>
                                <input
                                    type="url"
                                    value={form.website_url}
                                    onChange={(e) =>
                                        setForm((f) => ({ ...f, website_url: e.target.value }))
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A2140F]"
                                    placeholder="https://exemple.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nombre de bénéficiaires
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={form.beneficiaries_count}
                                onChange={(e) =>
                                    setForm((f) => ({ ...f, beneficiaries_count: parseInt(e.target.value) || 0 }))
                                }
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A2140F]"
                                placeholder="0"
                            />
                        </div>

                        <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                            <input
                                type="checkbox"
                                checked={form.is_active}
                                onChange={(e) =>
                                    setForm((f) => ({
                                        ...f,
                                        is_active: e.target.checked,
                                    }))
                                }
                                className="rounded border-gray-300 text-[#A2140F] focus:ring-[#A2140F]"
                            />
                            <span>Afficher sur le site public</span>
                        </label>

                        <div className="flex flex-wrap items-center gap-3 pt-2">
                            <button
                                type="submit"
                                className="bg-[#A2140F] text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-[#c91a14] transition-colors"
                            >
                                {form.id ? 'Enregistrer les modifications' : 'Créer le partenaire'}
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
                            Partenaires existants
                        </h2>
                        {loading && (
                            <span className="text-sm text-gray-500">Chargement...</span>
                        )}
                    </div>

                    {loading ? (
                        <div className="text-center py-8">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#A2140F]"></div>
                            <p className="mt-2 text-sm text-gray-500">Chargement des partenaires...</p>
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
                                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                            </svg>
                            <p className="text-gray-600 text-sm mb-2">
                                Aucun partenaire pour le moment.
                            </p>
                            <p className="text-gray-500 text-xs">
                                Utilisez le formulaire ci-dessus pour créer votre premier partenaire.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto border border-gray-200 rounded-xl">
                            <table className="min-w-full text-sm">
                                <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
                                    <tr>
                                        <th className="px-4 py-3">Logo</th>
                                        <th className="px-4 py-3">Nom</th>
                                        <th className="px-4 py-3">Ordre</th>
                                        <th className="px-4 py-3">Actif</th>
                                        <th className="px-4 py-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 bg-white">
                                    {items.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-3">
                                                {item.logo ? (
                                                    <img
                                                        src={item.logo}
                                                        alt={item.name}
                                                        className="w-16 h-16 object-contain rounded border border-gray-200 bg-white p-1"
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="w-16 h-16 bg-gray-100 rounded border border-gray-200 flex items-center justify-center">
                                                        <span className="text-xs text-gray-400">Pas de logo</span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 font-medium text-gray-900">
                                                {item.name}
                                            </td>
                                            <td className="px-4 py-3 text-gray-600">
                                                {item.order}
                                            </td>
                                            <td className="px-4 py-3">
                                                {item.is_active ? (
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
                                                        title="Modifier ce partenaire"
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
                                                        title="Supprimer ce partenaire"
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

export default PartnersAdmin;

