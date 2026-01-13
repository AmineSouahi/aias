import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ExecutiveMembersAdmin() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [form, setForm] = useState({
        id: null,
        name: '',
        position: '',
        photo: '',
        photoFile: null,
        order: 0,
        is_active: true,
    });

    const resetForm = () =>
        setForm({
            id: null,
            name: '',
            position: '',
            photo: '',
            photoFile: null,
            order: 0,
            is_active: true,
        });

    const loadMembers = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get('/executive-members/all');
            const data = response.data?.data || [];
            setItems(Array.isArray(data) ? data : []);
        } catch (e) {
            console.error('Erreur lors du chargement:', e);
            setError("Impossible de charger les membres du bureau.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMembers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const formData = new FormData();
            formData.append('name', form.name.trim());
            formData.append('position', form.position.trim());
            formData.append('order', parseInt(form.order) || 0);
            formData.append('is_active', form.is_active ? '1' : '0');

            if (form.photoFile) {
                formData.append('photo', form.photoFile);
            }

            if (form.id) {
                await axios.post(`/executive-members/${form.id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            } else {
                await axios.post('/executive-members', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            }

            await loadMembers();
            resetForm();
        } catch (e) {
            console.error(e);
            setError("Erreur lors de l'enregistrement du membre.");
        }
    };

    const handleEdit = (item) => {
        setForm({
            id: item.id,
            name: item.name || '',
            position: item.position || '',
            photo: item.photo || '',
            photoFile: null,
            order: item.order || 0,
            is_active: Boolean(item.is_active),
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Supprimer ce membre du bureau ?')) return;
        setError('');
        try {
            await axios.delete(`/executive-members/${id}`);
            await loadMembers();
        } catch (e) {
            console.error(e);
            setError('Impossible de supprimer ce membre.');
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
                    Gestion du Bureau Exécutif
                </h1>
                <p className="text-gray-600">
                    Gérez les membres du bureau exécutif. Les membres actifs
                    s'afficheront automatiquement sur la page "Qui nous sommes".
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
                    {form.id ? 'Modifier un membre' : 'Ajouter un nouveau membre'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nom complet *
                            </label>
                            <input
                                type="text"
                                required
                                value={form.name}
                                onChange={(e) =>
                                    setForm((f) => ({ ...f, name: e.target.value }))
                                }
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A2140F]"
                                placeholder="Ex: Hani El Harraq"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Poste *
                            </label>
                            <input
                                type="text"
                                required
                                value={form.position}
                                onChange={(e) =>
                                    setForm((f) => ({ ...f, position: e.target.value }))
                                }
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A2140F]"
                                placeholder="Ex: Président"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Photo
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                setForm((f) => ({
                                    ...f,
                                    photoFile: e.target.files?.[0] || null,
                                }))
                            }
                            className="w-full text-sm"
                            required={!form.id || !form.photo}
                        />
                        {form.photo && (
                            <div className="mt-2">
                                <p className="text-xs text-gray-500 mb-1">Photo actuelle :</p>
                                <img
                                    src={form.photo}
                                    alt={form.name}
                                    className="w-32 h-32 object-cover rounded-full"
                                />
                            </div>
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
                            {form.id ? 'Enregistrer les modifications' : 'Ajouter le membre'}
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

            {/* Liste des membres */}
            <div>
                <h2 className="text-xl font-bold text-[#204F01] mb-4">
                    Membres du bureau ({items.length})
                </h2>
                {items.length === 0 ? (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center text-gray-500">
                        <p>Aucun membre du bureau créé pour le moment.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="p-6 text-center">
                                    <div className="w-32 h-32 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                                        {item.photo ? (
                                            <img
                                                src={item.photo}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-4xl font-bold text-gray-400">
                                                {item.name
                                                    .split(' ')
                                                    .map((n) => n[0])
                                                    .join('')
                                                    .toUpperCase()
                                                    .slice(0, 2)}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-xl font-bold text-[#A2140F] mb-2">
                                        {item.name}
                                    </h3>
                                    <p className="text-gray-600 font-medium mb-3">
                                        {item.position}
                                    </p>
                                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                                        <span>Ordre: {item.order}</span>
                                        {!item.is_active && (
                                            <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded">
                                                Inactif
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

export default ExecutiveMembersAdmin;

