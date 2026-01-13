import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ImpactsAdmin() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [form, setForm] = useState({
        id: null,
        title: '',
        title_fr: '',
        title_ar: '',
        title_en: '',
        icon: '',
        value: '0',
        graph_data: [],
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
            icon: '',
            value: '0',
            graph_data: [],
            order: 0,
            is_active: true,
        });

    const loadImpacts = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get('/impacts/all');
            const data = response.data?.data || [];
            setItems(Array.isArray(data) ? data : []);
        } catch (e) {
            console.error('Erreur lors du chargement:', e);
            setError("Impossible de charger les impacts.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadImpacts();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const payload = {
                title: form.title_fr || form.title.trim(),
                title_fr: form.title_fr || form.title.trim(),
                title_ar: form.title_ar || '',
                title_en: form.title_en || '',
                icon: form.icon || null,
                value: form.value.trim(),
                graph_data: form.graph_data.length > 0 ? form.graph_data : null,
                order: parseInt(form.order) || 0,
                is_active: form.is_active,
            };

            if (form.id) {
                await axios.post(`/impacts/${form.id}`, payload);
            } else {
                await axios.post('/impacts', payload);
            }

            await loadImpacts();
            resetForm();
        } catch (e) {
            console.error(e);
            setError("Erreur lors de l'enregistrement de l'impact.");
        }
    };

    const handleEdit = (item) => {
        setForm({
            id: item.id,
            title: item.title || item.title_fr || '',
            title_fr: item.title_fr || item.title || '',
            title_ar: item.title_ar || '',
            title_en: item.title_en || '',
            icon: item.icon || '',
            value: item.value || '0',
            graph_data: item.graph_data || [],
            order: item.order || 0,
            is_active: Boolean(item.is_active),
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const addGraphDataPoint = () => {
        setForm((f) => ({
            ...f,
            graph_data: [...f.graph_data, { year: '', value: '' }],
        }));
    };

    const updateGraphDataPoint = (index, field, value) => {
        setForm((f) => {
            const newData = [...f.graph_data];
            newData[index] = { ...newData[index], [field]: value };
            return { ...f, graph_data: newData };
        });
    };

    const removeGraphDataPoint = (index) => {
        setForm((f) => ({
            ...f,
            graph_data: f.graph_data.filter((_, i) => i !== index),
        }));
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Supprimer cet impact ?')) return;
        setError('');
        try {
            await axios.delete(`/impacts/${id}`);
            await loadImpacts();
        } catch (e) {
            console.error(e);
            setError('Impossible de supprimer cet impact.');
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
                    Gestion des Impacts
                </h1>
                <p className="text-gray-600">
                    Gérez les impacts affichés dans la section "Certains de nos impacts"
                    sur la page "Qui nous sommes". Les impacts actifs s'afficheront
                    automatiquement.
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
                    {form.id ? 'Modifier un impact' : 'Ajouter un nouvel impact'}
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
                                    placeholder="Ex: Bénéficiaires logés"
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

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Icône
                            </label>
                            <select
                                value={form.icon}
                                onChange={(e) =>
                                    setForm((f) => ({ ...f, icon: e.target.value }))
                                }
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A2140F]"
                            >
                                <option value="">Aucune icône</option>
                                <option value="house">Maison</option>
                                <option value="meal">Repas</option>
                                <option value="people">Personnes</option>
                                <option value="education">Éducation</option>
                                <option value="health">Santé</option>
                                <option value="job">Emploi</option>
                                <option value="family">Famille</option>
                                <option value="child">Enfant</option>
                                <option value="heart">Cœur / Charité</option>
                                <option value="hand">Main / Aide</option>
                                <option value="book">Livre / Formation</option>
                                <option value="graduation">Diplôme</option>
                                <option value="money">Argent / Bourse</option>
                                <option value="calendar">Calendrier / Événement</option>
                                <option value="star">Étoile / Excellence</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Valeur *
                        </label>
                        <input
                            type="text"
                            required
                            value={form.value}
                            onChange={(e) =>
                                setForm((f) => ({ ...f, value: e.target.value }))
                            }
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A2140F]"
                            placeholder="Ex: 150"
                        />
                    </div>

                    {/* Données du graphique */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Données du graphique (optionnel)
                            </label>
                            <button
                                type="button"
                                onClick={addGraphDataPoint}
                                className="text-sm text-[#A2140F] hover:text-[#c91a14] font-medium"
                            >
                                + Ajouter un point
                            </button>
                        </div>
                        {form.graph_data.length > 0 && (
                            <div className="space-y-2 bg-white p-3 rounded-lg border border-gray-200">
                                {form.graph_data.map((point, index) => (
                                    <div
                                        key={index}
                                        className="flex gap-2 items-center"
                                    >
                                        <input
                                            type="text"
                                            value={point.year}
                                            onChange={(e) =>
                                                updateGraphDataPoint(
                                                    index,
                                                    'year',
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Année (ex: 2020)"
                                            className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
                                        />
                                        <input
                                            type="number"
                                            value={point.value}
                                            onChange={(e) =>
                                                updateGraphDataPoint(
                                                    index,
                                                    'value',
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Valeur"
                                            className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeGraphDataPoint(index)
                                            }
                                            className="text-red-600 hover:text-red-800 px-2"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        {form.graph_data.length === 0 && (
                            <p className="text-xs text-gray-500">
                                Ajoutez des données pour afficher un graphique
                                linéaire sur la carte
                            </p>
                        )}
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
                            {form.id ? 'Enregistrer les modifications' : 'Ajouter l\'impact'}
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

            {/* Liste des impacts */}
            <div>
                <h2 className="text-xl font-bold text-[#204F01] mb-4">
                    Impacts existants ({items.length})
                </h2>
                {items.length === 0 ? (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center text-gray-500">
                        <p>Aucun impact créé pour le moment.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto border border-gray-200 rounded-xl">
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
                                <tr>
                                    <th className="px-4 py-3">Titre</th>
                                    <th className="px-4 py-3">Valeur</th>
                                    <th className="px-4 py-3">Ordre</th>
                                    <th className="px-4 py-3">Actif</th>
                                    <th className="px-4 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white">
                                {items.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-4 py-3 font-medium text-gray-900">
                                            {item.title}
                                        </td>
                                        <td className="px-4 py-3 text-[#A2140F] font-bold text-lg">
                                            {item.value}
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
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleEdit(item)}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-[#204F01] rounded-md hover:bg-[#2d6a02] transition-colors"
                                                >
                                                    Modifier
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                                                >
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
    );
}

export default ImpactsAdmin;

