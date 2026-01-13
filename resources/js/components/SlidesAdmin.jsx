import React, { useEffect, useState } from 'react';
import axios from 'axios';

function SlidesAdmin() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [form, setForm] = useState({
        id: null,
        title: '',
        title_fr: '',
        title_ar: '',
        title_en: '',
        description: '',
        description_fr: '',
        description_ar: '',
        description_en: '',
        image: '',
        imageFile: null,
        button_text: '',
        button_text_fr: '',
        button_text_ar: '',
        button_text_en: '',
        button_link: '',
        order: 0,
        is_active: true,
    });

    const resetForm = () =>
        setForm({
            id: null,
            title: '',
            title_fr: '',
            title_ar: '',
            title_en: '',
            description: '',
            description_fr: '',
            description_ar: '',
            description_en: '',
            image: '',
            imageFile: null,
            button_text: '',
            button_text_fr: '',
            button_text_ar: '',
            button_text_en: '',
            button_link: '',
            order: 0,
            is_active: true,
        });

    const loadSlides = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get('/slides/all');
            const data = response.data?.data || [];
            setItems(Array.isArray(data) ? data : []);
        } catch (e) {
            console.error('Erreur lors du chargement:', e);
            setError("Impossible de charger les slides.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSlides();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const formData = new FormData();
            formData.append('title', form.title_fr || form.title.trim());
            formData.append('title_fr', form.title_fr || form.title.trim());
            formData.append('title_ar', form.title_ar || '');
            formData.append('title_en', form.title_en || '');
            if (form.description_fr || form.description) formData.append('description', form.description_fr || form.description.trim());
            if (form.description_fr) formData.append('description_fr', form.description_fr.trim());
            if (form.description_ar) formData.append('description_ar', form.description_ar.trim());
            if (form.description_en) formData.append('description_en', form.description_en.trim());
            if (form.button_text_fr || form.button_text) formData.append('button_text', form.button_text_fr || form.button_text.trim());
            if (form.button_text_fr) formData.append('button_text_fr', form.button_text_fr.trim());
            if (form.button_text_ar) formData.append('button_text_ar', form.button_text_ar.trim());
            if (form.button_text_en) formData.append('button_text_en', form.button_text_en.trim());
            if (form.button_link) formData.append('button_link', form.button_link.trim());
            formData.append('order', parseInt(form.order) || 0);
            formData.append('is_active', form.is_active ? '1' : '0');

            if (form.imageFile) {
                formData.append('image', form.imageFile);
            }

            if (form.id) {
                // Utiliser POST pour la mise à jour avec FormData
                await axios.post(`/slides/${form.id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            } else {
                await axios.post('/slides', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            }

            await loadSlides();
            resetForm();
        } catch (e) {
            console.error(e);
            setError("Erreur lors de l'enregistrement du slide.");
        }
    };

    const handleEdit = (item) => {
        setForm({
            id: item.id,
            title: item.title || item.title_fr || '',
            title_fr: item.title_fr || item.title || '',
            title_ar: item.title_ar || '',
            title_en: item.title_en || '',
            description: item.description || item.description_fr || '',
            description_fr: item.description_fr || item.description || '',
            description_ar: item.description_ar || '',
            description_en: item.description_en || '',
            image: item.image || '',
            imageFile: null,
            button_text: item.button_text || item.button_text_fr || '',
            button_text_fr: item.button_text_fr || item.button_text || '',
            button_text_ar: item.button_text_ar || '',
            button_text_en: item.button_text_en || '',
            button_link: item.button_link || '',
            order: item.order || 0,
            is_active: Boolean(item.is_active),
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Supprimer ce slide ?')) return;
        setError('');
        try {
            await axios.delete(`/slides/${id}`);
            await loadSlides();
        } catch (e) {
            console.error(e);
            setError('Impossible de supprimer ce slide.');
        }
    };

    if (loading) {
        return (
            <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#A2140F]"></div>
                <p className="mt-4 text-gray-600">Chargement...</p>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#204F01] mb-2">
                    Gestion du Carousel
                </h1>
                <p className="text-gray-600">
                    Gérez les slides du carousel de la page d'accueil. Les slides actifs
                    s'afficheront automatiquement sur le site.
                </p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    {error}
                </div>
            )}

            {/* Formulaire */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 md:p-8 mb-12">
                <h2 className="text-xl font-bold text-[#204F01] mb-4">
                    {form.id ? 'Modifier un slide' : 'Créer un nouveau slide'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Traductions - Titre */}
                    <div className="border border-gray-200 rounded-lg p-4 bg-white">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Titre *</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Français *</label>
                                <input
                                    type="text"
                                    required
                                    value={form.title_fr}
                                    onChange={(e) =>
                                        setForm((f) => ({ ...f, title_fr: e.target.value, title: e.target.value }))
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A2140F]"
                                    placeholder="Ex: Cérémonie d'Accueil des Jeunes Orphelins Bacheliers"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Arabe</label>
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
                                <label className="block text-xs font-medium text-gray-600 mb-1">Anglais</label>
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

                    {/* Traductions - Description */}
                    <div className="border border-gray-200 rounded-lg p-4 bg-white">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Description</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Français</label>
                                <textarea
                                    rows={3}
                                    value={form.description_fr}
                                    onChange={(e) =>
                                        setForm((f) => ({ ...f, description_fr: e.target.value, description: e.target.value }))
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A2140F]"
                                    placeholder="Description du slide..."
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Arabe</label>
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
                                <label className="block text-xs font-medium text-gray-600 mb-1">Anglais</label>
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

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Image *
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
                            required={!form.id || !form.image}
                        />
                        {form.image && (
                            <div className="mt-2">
                                <p className="text-xs text-gray-500 mb-1">Image actuelle :</p>
                                <img
                                    src={form.image}
                                    alt="Slide actuel"
                                    className="w-full max-w-md h-48 object-cover rounded-md"
                                />
                            </div>
                        )}
                    </div>

                    {/* Traductions - Texte du bouton */}
                    <div className="border border-gray-200 rounded-lg p-4 bg-white">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Texte du bouton</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Français</label>
                                <input
                                    type="text"
                                    value={form.button_text_fr}
                                    onChange={(e) =>
                                        setForm((f) => ({ ...f, button_text_fr: e.target.value, button_text: e.target.value }))
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A2140F]"
                                    placeholder="Ex: En savoir plus"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Arabe</label>
                                <input
                                    type="text"
                                    value={form.button_text_ar}
                                    onChange={(e) =>
                                        setForm((f) => ({ ...f, button_text_ar: e.target.value }))
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A2140F]"
                                    dir="rtl"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Anglais</label>
                                <input
                                    type="text"
                                    value={form.button_text_en}
                                    onChange={(e) =>
                                        setForm((f) => ({ ...f, button_text_en: e.target.value }))
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A2140F]"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Lien du bouton
                        </label>
                        <input
                            type="text"
                            value={form.button_link}
                            onChange={(e) =>
                                setForm((f) => ({ ...f, button_link: e.target.value }))
                            }
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A2140F]"
                            placeholder="Ex: /ce-que-nous-faisons"
                        />
                    </div>

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
                                    setForm((f) => ({
                                        ...f,
                                        order: parseInt(e.target.value) || 0,
                                    }))
                                }
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A2140F]"
                            />
                        </div>
                        <div className="flex items-center">
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
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                        <button
                            type="submit"
                            className="bg-[#A2140F] text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-[#c91a14] transition-colors"
                        >
                            {form.id ? 'Enregistrer les modifications' : 'Créer le slide'}
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

            {/* Liste des slides */}
            <div>
                <h2 className="text-xl font-bold text-[#204F01] mb-4">
                    Slides existants ({items.length})
                </h2>
                {items.length === 0 ? (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center text-gray-500">
                        <p>Aucun slide créé pour le moment.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                            >
                                {item.image && (
                                    <div className="relative h-48 overflow-hidden bg-gray-100">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-full h-full object-cover"
                                        />
                                        {!item.is_active && (
                                            <div className="absolute top-2 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                                                Inactif
                                            </div>
                                        )}
                                    </div>
                                )}
                                <div className="p-4">
                                    <h3 className="font-semibold text-[#204F01] mb-2 line-clamp-2">
                                        {item.title}
                                    </h3>
                                    {item.description && (
                                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                            {item.description}
                                        </p>
                                    )}
                                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                                        <span>Ordre: {item.order}</span>
                                        {item.button_text && (
                                            <span className="bg-gray-100 px-2 py-1 rounded">
                                                {item.button_text}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="flex-1 bg-[#204F01] text-white px-3 py-2 rounded text-sm font-medium hover:bg-[#2d6a02] transition-colors"
                                        >
                                            Modifier
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="bg-red-600 text-white px-3 py-2 rounded text-sm font-medium hover:bg-red-700 transition-colors"
                                        >
                                            Supprimer
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default SlidesAdmin;

