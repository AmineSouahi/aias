import React, { useEffect, useState } from 'react';
import axios from 'axios';

function SupportGoalsAdmin() {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [editingId, setEditingId] = useState(null);

    const emptyForm = {
        title: '',
        subtitle: '',
        description: '',
        target_amount: '',
        current_amount: '',
        deadline: '',
        order: 0,
        is_highlighted: false,
        is_active: true,
    };

    const [form, setForm] = useState(emptyForm);

    const loadGoals = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get('/support-goals/all');
            const data = response.data?.data || [];
            setGoals(Array.isArray(data) ? data : []);
        } catch (e) {
            console.error('Erreur lors du chargement des objectifs:', e);
            setError("Impossible de charger les objectifs de soutien.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadGoals();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleEdit = (goal) => {
        setEditingId(goal.id);
        setForm({
            title: goal.title || '',
            subtitle: goal.subtitle || '',
            description: goal.description || '',
            target_amount: goal.target_amount || '',
            current_amount: goal.current_amount || '',
            deadline: goal.deadline || '',
            order: goal.order || 0,
            is_highlighted: !!goal.is_highlighted,
            is_active: !!goal.is_active,
        });
    };

    const handleCancel = () => {
        setEditingId(null);
        setForm(emptyForm);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            const payload = {
                ...form,
                target_amount: form.target_amount ? parseFloat(form.target_amount) : 0,
                current_amount: form.current_amount ? parseFloat(form.current_amount) : 0,
                order: form.order ? parseInt(form.order, 10) : 0,
            };

            if (editingId) {
                await axios.put(`/support-goals/${editingId}`, payload);
            } else {
                await axios.post('/support-goals', payload);
            }

            await loadGoals();
            handleCancel();
        } catch (e) {
            console.error('Erreur lors de la sauvegarde:', e);
            setError("Erreur lors de l'enregistrement de l'objectif.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Supprimer cet objectif ?')) return;
        try {
            await axios.delete(`/support-goals/${id}`);
            await loadGoals();
        } catch (e) {
            console.error('Erreur lors de la suppression:', e);
            setError('Erreur lors de la suppression.');
        }
    };

    if (loading) {
        return (
            <div className="p-6">
                <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#A2140F]" />
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-[#204F01] mb-6">
                Objectifs de soutien
            </h2>

            {error && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-lg shadow-md p-6 mb-8"
            >
                <h3 className="text-lg font-semibold text-[#204F01] mb-4">
                    {editingId ? 'Modifier un objectif' : 'Créer un nouvel objectif'}
                </h3>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Titre *
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A2140F]"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Sous-titre
                        </label>
                        <input
                            type="text"
                            name="subtitle"
                            value={form.subtitle}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A2140F]"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Montant cible (MAD) *
                        </label>
                        <input
                            type="number"
                            name="target_amount"
                            value={form.target_amount}
                            onChange={handleChange}
                            required
                            min="0"
                            step="0.01"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A2140F]"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Montant actuel (MAD)
                        </label>
                        <input
                            type="number"
                            name="current_amount"
                            value={form.current_amount}
                            onChange={handleChange}
                            min="0"
                            step="0.01"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A2140F]"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Deadline (texte)
                        </label>
                        <input
                            type="text"
                            name="deadline"
                            value={form.deadline}
                            onChange={handleChange}
                            placeholder="Ex: Décembre 2025"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A2140F]"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ordre d&apos;affichage
                        </label>
                        <input
                            type="number"
                            name="order"
                            value={form.order}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A2140F]"
                        />
                    </div>
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                    </label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A2140F]"
                    />
                </div>
                <div className="flex items-center gap-4 mb-4">
                    <label className="inline-flex items-center">
                        <input
                            type="checkbox"
                            name="is_highlighted"
                            checked={form.is_highlighted}
                            onChange={handleChange}
                            className="h-4 w-4 text-[#A2140F] border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                            Mettre en avant
                        </span>
                    </label>
                    <label className="inline-flex items-center">
                        <input
                            type="checkbox"
                            name="is_active"
                            checked={form.is_active}
                            onChange={handleChange}
                            className="h-4 w-4 text-[#A2140F] border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                            Actif
                        </span>
                    </label>
                </div>
                <div className="flex gap-2">
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-4 py-2 bg-[#A2140F] text-white rounded-md hover:bg-[#c91a14] disabled:opacity-50"
                    >
                        {saving
                            ? 'Enregistrement...'
                            : editingId
                            ? 'Mettre à jour'
                            : 'Créer'}
                    </button>
                    {editingId && (
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                        >
                            Annuler
                        </button>
                    )}
                </div>
            </form>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Titre
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Montant
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Deadline
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Statut
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {goals.map((goal) => (
                            <tr key={goal.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {goal.title}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {goal.current_amount} / {goal.target_amount} MAD
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {goal.deadline || '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span
                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            goal.is_active
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                        }`}
                                    >
                                        {goal.is_active ? 'Actif' : 'Inactif'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={() => handleEdit(goal)}
                                        className="text-[#A2140F] hover:text-[#c91a14] mr-4"
                                    >
                                        Modifier
                                    </button>
                                    <button
                                        onClick={() => handleDelete(goal.id)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        Supprimer
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default SupportGoalsAdmin;


