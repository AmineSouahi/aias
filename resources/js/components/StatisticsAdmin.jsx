import React, { useEffect, useState } from 'react';
import axios from 'axios';

function StatisticsAdmin() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);
    
    // Les 4 statistiques fixes
    const fixedStats = [
        { key: 'beneficiaires', title: 'BÉNÉFICIAIRES', order: 1 },
        { key: 'formations', title: 'FORMATIONS PROFESSIONNELLES', order: 2 },
        { key: 'bourses', title: 'BOURSES', order: 3 },
        { key: 'insertions', title: 'INSERTIONS PROFESSIONNELLES', order: 4 },
    ];

    // État pour les 4 valeurs
    const [values, setValues] = useState({
        beneficiaires: '',
        formations: '',
        bourses: '',
        insertions: '',
    });

    const loadStatistics = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get('/statistics/all');
            const data = response.data?.data || [];
            setItems(Array.isArray(data) ? data : []);
            
            // Remplir les valeurs depuis la base de données
            const newValues = {
                beneficiaires: '',
                formations: '',
                bourses: '',
                insertions: '',
            };
            
            data.forEach((stat) => {
                const statKey = fixedStats.find(s => 
                    stat.title.toUpperCase() === s.title || 
                    stat.title.toUpperCase().includes(s.title.split(' ')[0])
                )?.key;
                if (statKey) {
                    newValues[statKey] = stat.value;
                }
            });
            
            setValues(newValues);
        } catch (e) {
            console.error('Erreur lors du chargement:', e);
            setError("Impossible de charger les statistiques.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStatistics();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSaving(true);

        try {
            // Sauvegarder ou mettre à jour chaque statistique
            const promises = fixedStats.map(async (stat) => {
                const value = values[stat.key]?.trim();
                if (!value) return; // Ignorer si vide

                // Chercher si la statistique existe déjà
                const existing = items.find(item => 
                    item.title.toUpperCase() === stat.title ||
                    item.title.toUpperCase().includes(stat.title.split(' ')[0])
                );

                const payload = {
                    title: stat.title,
                    value: value,
                    order: stat.order,
                    is_active: true,
                };

                if (existing) {
                    // Mettre à jour
                    return axios.put(`/statistics/${existing.id}`, payload);
                } else {
                    // Créer
                    return axios.post('/statistics', payload);
                }
            });

            await Promise.all(promises.filter(Boolean));
            await loadStatistics();
            setError('');
        } catch (e) {
            console.error('Erreur complète:', e);
            const errorMessage = e.response?.data?.message || e.message || "Erreur lors de l'enregistrement.";
            setError(errorMessage);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Supprimer cette statistique ?')) return;
        setError('');
        try {
            await axios.delete(`/statistics/${id}`);
            await loadStatistics();
        } catch (e) {
            console.error(e);
            setError('Impossible de supprimer cette statistique.');
        }
    };

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-[#204F01] mb-2">
                        Tableau de bord – Chiffres clés
                    </h1>
                    <p className="text-gray-600">
                        Gérez vos statistiques et chiffres clés depuis ce panneau. Ces chiffres s'afficheront sur la page d'accueil.
                    </p>
                </div>

                {error && (
                    <div className="mb-4 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {/* Formulaire pour les 4 statistiques fixes */}
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 md:p-8 mb-12">
                    <h2 className="text-xl font-bold text-[#204F01] mb-4">
                        Modifier les chiffres clés
                    </h2>
                    <p className="text-sm text-gray-600 mb-6">
                        Modifiez uniquement les valeurs. Les titres sont fixes et ne peuvent pas être changés.
                    </p>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {fixedStats.map((stat) => (
                            <div key={stat.key} className="bg-white rounded-lg p-4 border border-gray-200">
                                <label className="block text-sm font-semibold text-[#204F01] mb-2 uppercase">
                                    {stat.title}
                                </label>
                                <input
                                    type="text"
                                    value={values[stat.key]}
                                    onChange={(e) =>
                                        setValues((v) => ({
                                            ...v,
                                            [stat.key]: e.target.value,
                                        }))
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-[#A2140F]"
                                    placeholder="Ex: 634"
                                />
                            </div>
                        ))}

                        <div className="flex flex-wrap items-center gap-3 pt-4">
                            <button
                                type="submit"
                                disabled={saving}
                                className="bg-[#A2140F] text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-[#c91a14] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Liste */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-[#204F01]">
                            Statistiques existantes
                        </h2>
                        {loading && (
                            <span className="text-sm text-gray-500">Chargement...</span>
                        )}
                    </div>

                    {loading ? (
                        <div className="text-center py-8">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#A2140F]"></div>
                            <p className="mt-2 text-sm text-gray-500">Chargement des statistiques...</p>
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
                                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                />
                            </svg>
                            <p className="text-gray-600 text-sm mb-2">
                                Aucune statistique pour le moment.
                            </p>
                            <p className="text-gray-500 text-xs">
                                Utilisez le formulaire ci-dessus pour créer votre première statistique.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto border border-gray-200 rounded-xl">
                            <table className="min-w-full text-sm">
                                <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
                                    <tr>
                                        <th className="px-4 py-3">Titre</th>
                                        <th className="px-4 py-3">Valeur</th>
                                        <th className="px-4 py-3">Icône</th>
                                        <th className="px-4 py-3">Ordre</th>
                                        <th className="px-4 py-3">Actif</th>
                                        <th className="px-4 py-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 bg-white">
                                    {items.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-3 font-medium text-gray-900">
                                                {item.title}
                                            </td>
                                            <td className="px-4 py-3 text-[#204F01] font-bold text-lg">
                                                {item.value}
                                            </td>
                                            <td className="px-4 py-3 text-gray-600">
                                                {item.icon || '-'}
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
                                                        title="Modifier cette statistique"
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
                                                        title="Supprimer cette statistique"
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

export default StatisticsAdmin;

