import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ChartsAdmin() {
    const [lineData, setLineData] = useState([]);
    const [pieData, setPieData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('line'); // 'line' ou 'pie'

    // Formulaires
    const [lineForm, setLineForm] = useState({ year: '', value: '' });
    const [pieForm, setPieForm] = useState({ name: '', value: '', color: '' });
    const [editingId, setEditingId] = useState(null);

    const loadChartData = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get('/chart-data/all');
            const data = response.data?.data || [];
            
            const line = data.filter(item => item.chart_type === 'line');
            const pie = data.filter(item => item.chart_type === 'pie');
            
            setLineData(line.sort((a, b) => (a.year || 0) - (b.year || 0)));
            setPieData(pie.sort((a, b) => (a.order || 0) - (b.order || 0)));
        } catch (e) {
            console.error('Erreur lors du chargement:', e);
            setError("Impossible de charger les données des graphiques.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadChartData();
    }, []);

    const handleLineSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSaving(true);

        try {
            const payload = {
                chart_type: 'line',
                name: `Année ${lineForm.year}`,
                value: parseFloat(lineForm.value),
                year: parseInt(lineForm.year),
                order: parseInt(lineForm.year),
                is_active: true,
            };

            if (editingId) {
                await axios.put(`/chart-data/${editingId}`, payload);
            } else {
                await axios.post('/chart-data', payload);
            }

            setLineForm({ year: '', value: '' });
            setEditingId(null);
            await loadChartData();
        } catch (e) {
            console.error('Erreur:', e);
            setError("Erreur lors de la sauvegarde.");
        } finally {
            setSaving(false);
        }
    };

    const handlePieSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSaving(true);

        try {
            const payload = {
                chart_type: 'pie',
                name: pieForm.name,
                value: parseFloat(pieForm.value),
                color: pieForm.color || '#A2140F',
                order: pieData.length + 1,
                is_active: true,
            };

            if (editingId) {
                await axios.put(`/chart-data/${editingId}`, payload);
            } else {
                await axios.post('/chart-data', payload);
            }

            setPieForm({ name: '', value: '', color: '' });
            setEditingId(null);
            await loadChartData();
        } catch (e) {
            console.error('Erreur:', e);
            setError("Erreur lors de la sauvegarde.");
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (item) => {
        setEditingId(item.id);
        if (item.chart_type === 'line') {
            setLineForm({ year: item.year?.toString() || '', value: item.value?.toString() || '' });
            setActiveTab('line');
        } else {
            setPieForm({ name: item.name || '', value: item.value?.toString() || '', color: item.color || '' });
            setActiveTab('pie');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette donnée ?')) {
            return;
        }

        try {
            await axios.delete(`/chart-data/${id}`);
            await loadChartData();
        } catch (e) {
            console.error('Erreur:', e);
            setError("Erreur lors de la suppression.");
        }
    };

    const handleCancel = () => {
        setEditingId(null);
        setLineForm({ year: '', value: '' });
        setPieForm({ name: '', value: '', color: '' });
    };

    if (loading) {
        return (
            <div className="p-6">
                <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#A2140F]"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-[#204F01] mb-6">Gestion des Graphiques</h2>

            {error && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            {/* Tabs */}
            <div className="mb-6 border-b border-gray-200">
                <div className="flex space-x-4">
                    <button
                        onClick={() => {
                            setActiveTab('line');
                            handleCancel();
                        }}
                        className={`px-4 py-2 font-semibold ${
                            activeTab === 'line'
                                ? 'border-b-2 border-[#A2140F] text-[#A2140F]'
                                : 'text-gray-600 hover:text-[#A2140F]'
                        }`}
                    >
                        Graphique Linéaire
                    </button>
                    <button
                        onClick={() => {
                            setActiveTab('pie');
                            handleCancel();
                        }}
                        className={`px-4 py-2 font-semibold ${
                            activeTab === 'pie'
                                ? 'border-b-2 border-[#A2140F] text-[#A2140F]'
                                : 'text-gray-600 hover:text-[#A2140F]'
                        }`}
                    >
                        Graphique en Camembert
                    </button>
                </div>
            </div>

            {/* Formulaire Graphique Linéaire */}
            {activeTab === 'line' && (
                <div className="mb-8">
                    <h3 className="text-xl font-bold text-[#204F01] mb-4">
                        {editingId ? 'Modifier' : 'Ajouter'} une donnée
                    </h3>
                    <form onSubmit={handleLineSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Année *
                                </label>
                                <input
                                    type="number"
                                    value={lineForm.year}
                                    onChange={(e) => setLineForm({ ...lineForm, year: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A2140F]"
                                    required
                                    min="2000"
                                    max="2100"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Valeur (nombre de bénéficiaires) *
                                </label>
                                <input
                                    type="number"
                                    value={lineForm.value}
                                    onChange={(e) => setLineForm({ ...lineForm, value: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A2140F]"
                                    required
                                    min="0"
                                    step="0.01"
                                />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-4 py-2 bg-[#A2140F] text-white rounded-md hover:bg-[#c91a14] disabled:opacity-50"
                            >
                                {saving ? 'Enregistrement...' : editingId ? 'Modifier' : 'Ajouter'}
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

                    {/* Liste des données */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Année
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Valeur
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {lineData.map((item) => (
                                    <tr key={item.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {item.year}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {item.value}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => handleEdit(item)}
                                                className="text-[#A2140F] hover:text-[#c91a14] mr-4"
                                            >
                                                Modifier
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id)}
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
            )}

            {/* Formulaire Graphique en Camembert */}
            {activeTab === 'pie' && (
                <div className="mb-8">
                    <h3 className="text-xl font-bold text-[#204F01] mb-4">
                        {editingId ? 'Modifier' : 'Ajouter'} une catégorie
                    </h3>
                    <form onSubmit={handlePieSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
                        <div className="grid md:grid-cols-3 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nom *
                                </label>
                                <input
                                    type="text"
                                    value={pieForm.name}
                                    onChange={(e) => setPieForm({ ...pieForm, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A2140F]"
                                    required
                                    placeholder="Ex: NEET"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Valeur (%) *
                                </label>
                                <input
                                    type="number"
                                    value={pieForm.value}
                                    onChange={(e) => setPieForm({ ...pieForm, value: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A2140F]"
                                    required
                                    min="0"
                                    max="100"
                                    step="0.01"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Couleur (hex)
                                </label>
                                <input
                                    type="color"
                                    value={pieForm.color || '#A2140F'}
                                    onChange={(e) => setPieForm({ ...pieForm, color: e.target.value })}
                                    className="w-full h-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A2140F]"
                                />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-4 py-2 bg-[#A2140F] text-white rounded-md hover:bg-[#c91a14] disabled:opacity-50"
                            >
                                {saving ? 'Enregistrement...' : editingId ? 'Modifier' : 'Ajouter'}
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

                    {/* Liste des données */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Nom
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Valeur (%)
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Couleur
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {pieData.map((item) => (
                                    <tr key={item.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {item.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {item.value}%
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div
                                                className="w-8 h-8 rounded-full border border-gray-300"
                                                style={{ backgroundColor: item.color || '#A2140F' }}
                                            ></div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => handleEdit(item)}
                                                className="text-[#A2140F] hover:text-[#c91a14] mr-4"
                                            >
                                                Modifier
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id)}
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
            )}
        </div>
    );
}

export default ChartsAdmin;

