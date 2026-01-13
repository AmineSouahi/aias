import React, { useEffect, useState } from 'react';
import axios from 'axios';

function SupportProjectsAdmin() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [editingId, setEditingId] = useState(null);

    const emptyForm = {
        title: '',
        title_fr: '',
        title_ar: '',
        title_en: '',
        excerpt: '',
        excerpt_fr: '',
        excerpt_ar: '',
        excerpt_en: '',
        description: '',
        description_fr: '',
        description_ar: '',
        description_en: '',
        target_amount: '',
        current_amount: '',
        category: '',
        category_fr: '',
        category_ar: '',
        category_en: '',
        cta_label: 'Soutenir ce projet',
        cta_label_fr: 'Soutenir ce projet',
        cta_label_ar: '',
        cta_label_en: '',
        cta_link: '/don',
        order: 0,
        is_highlighted: false,
        is_active: true,
        image: null, // Pour le fichier
        imagePreview: '', // Pour l'aperçu
        existingImage: '', // Pour l'image existante lors de l'édition
    };

    const [form, setForm] = useState(emptyForm);

    const loadProjects = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get('/support-projects/all');
            const data = response.data?.data || [];
            setProjects(Array.isArray(data) ? data : []);
        } catch (e) {
            console.error('Erreur lors du chargement des projets:', e);
            setError("Impossible de charger les projets de soutien.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProjects();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        
        if (type === 'file' && files && files[0]) {
            const file = files[0];
            setForm((prev) => ({
                ...prev,
                image: file,
                imagePreview: URL.createObjectURL(file),
            }));
        } else {
            setForm((prev) => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value,
            }));
        }
    };

    const handleEdit = (project) => {
        setEditingId(project.id);
        setForm({
            title: project.title || project.title_fr || '',
            title_fr: project.title_fr || project.title || '',
            title_ar: project.title_ar || '',
            title_en: project.title_en || '',
            excerpt: project.excerpt || project.excerpt_fr || '',
            excerpt_fr: project.excerpt_fr || project.excerpt || '',
            excerpt_ar: project.excerpt_ar || '',
            excerpt_en: project.excerpt_en || '',
            description: project.description || project.description_fr || '',
            description_fr: project.description_fr || project.description || '',
            description_ar: project.description_ar || '',
            description_en: project.description_en || '',
            target_amount: project.target_amount || '',
            current_amount: project.current_amount || '',
            category: project.category || project.category_fr || '',
            category_fr: project.category_fr || project.category || '',
            category_ar: project.category_ar || '',
            category_en: project.category_en || '',
            cta_label: project.cta_label || project.cta_label_fr || 'Soutenir ce projet',
            cta_label_fr: project.cta_label_fr || project.cta_label || 'Soutenir ce projet',
            cta_label_ar: project.cta_label_ar || '',
            cta_label_en: project.cta_label_en || '',
            cta_link: project.cta_link || '/don',
            order: project.order || 0,
            is_highlighted: !!project.is_highlighted,
            is_active: !!project.is_active,
            image: null,
            imagePreview: '',
            existingImage: project.image || '',
        });
    };

    const handleCancel = () => {
        setEditingId(null);
        // Nettoyer l'aperçu d'image si nécessaire
        if (form.imagePreview) {
            URL.revokeObjectURL(form.imagePreview);
        }
        setForm(emptyForm);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('title', form.title_fr || form.title);
            formData.append('title_fr', form.title_fr || form.title);
            formData.append('title_ar', form.title_ar || '');
            formData.append('title_en', form.title_en || '');
            formData.append('excerpt', form.excerpt_fr || form.excerpt || '');
            formData.append('excerpt_fr', form.excerpt_fr || form.excerpt || '');
            formData.append('excerpt_ar', form.excerpt_ar || '');
            formData.append('excerpt_en', form.excerpt_en || '');
            formData.append('description', form.description_fr || form.description || '');
            formData.append('description_fr', form.description_fr || form.description || '');
            formData.append('description_ar', form.description_ar || '');
            formData.append('description_en', form.description_en || '');
            formData.append('target_amount', form.target_amount ? parseFloat(form.target_amount) : 0);
            formData.append('current_amount', form.current_amount ? parseFloat(form.current_amount) : 0);
            formData.append('category', form.category_fr || form.category || '');
            formData.append('category_fr', form.category_fr || form.category || '');
            formData.append('category_ar', form.category_ar || '');
            formData.append('category_en', form.category_en || '');
            formData.append('cta_label', form.cta_label_fr || form.cta_label || 'Soutenir ce projet');
            formData.append('cta_label_fr', form.cta_label_fr || form.cta_label || 'Soutenir ce projet');
            formData.append('cta_label_ar', form.cta_label_ar || '');
            formData.append('cta_label_en', form.cta_label_en || '');
            formData.append('cta_link', form.cta_link || '/don');
            formData.append('order', form.order ? parseInt(form.order, 10) : 0);
            formData.append('is_highlighted', form.is_highlighted ? 1 : 0);
            formData.append('is_active', form.is_active ? 1 : 0);

            // Ajouter l'image seulement si un nouveau fichier est sélectionné
            if (form.image) {
                formData.append('image', form.image);
            }

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };

            if (editingId) {
                await axios.put(`/support-projects/${editingId}`, formData, config);
            } else {
                await axios.post('/support-projects', formData, config);
            }

            await loadProjects();
            handleCancel();
        } catch (e) {
            console.error('Erreur lors de la sauvegarde:', e);
            setError("Erreur lors de l'enregistrement du projet.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Supprimer ce projet ?')) return;
        try {
            await axios.delete(`/support-projects/${id}`);
            await loadProjects();
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
            <h2 className="text-2xl font-bold text-[#204F01] mb-6">Projets à financer</h2>

            {error && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-8">
                {/* Traductions - Titre */}
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 mb-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Titre *</h3>
                    <div className="space-y-3">
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Français *</label>
                            <input
                                type="text"
                                value={form.title_fr}
                                onChange={(e) => setForm((f) => ({ ...f, title_fr: e.target.value, title: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A2140F]"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Arabe</label>
                            <input
                                type="text"
                                value={form.title_ar}
                                onChange={(e) => setForm((f) => ({ ...f, title_ar: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A2140F]"
                                dir="rtl"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Anglais</label>
                            <input
                                type="text"
                                value={form.title_en}
                                onChange={(e) => setForm((f) => ({ ...f, title_en: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A2140F]"
                            />
                        </div>
                    </div>
                </div>

                {/* Traductions - Extrait */}
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 mb-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Accroche courte</h3>
                    <div className="space-y-3">
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Français</label>
                            <input
                                type="text"
                                value={form.excerpt_fr}
                                onChange={(e) => setForm((f) => ({ ...f, excerpt_fr: e.target.value, excerpt: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A2140F]"
                                placeholder="Une phrase pour résumer le projet"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Arabe</label>
                            <input
                                type="text"
                                value={form.excerpt_ar}
                                onChange={(e) => setForm((f) => ({ ...f, excerpt_ar: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A2140F]"
                                dir="rtl"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Anglais</label>
                            <input
                                type="text"
                                value={form.excerpt_en}
                                onChange={(e) => setForm((f) => ({ ...f, excerpt_en: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A2140F]"
                            />
                        </div>
                    </div>
                </div>

                {/* Traductions - Description */}
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 mb-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Description</h3>
                    <div className="space-y-3">
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Français</label>
                            <textarea
                                value={form.description_fr}
                                onChange={(e) => setForm((f) => ({ ...f, description_fr: e.target.value, description: e.target.value }))}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A2140F]"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Arabe</label>
                            <textarea
                                value={form.description_ar}
                                onChange={(e) => setForm((f) => ({ ...f, description_ar: e.target.value }))}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A2140F]"
                                dir="rtl"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Anglais</label>
                            <textarea
                                value={form.description_en}
                                onChange={(e) => setForm((f) => ({ ...f, description_en: e.target.value }))}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A2140F]"
                            />
                        </div>
                    </div>
                </div>

                {/* Traductions - Catégorie */}
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 mb-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Catégorie</h3>
                    <div className="space-y-3">
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Français</label>
                            <input
                                type="text"
                                value={form.category_fr}
                                onChange={(e) => setForm((f) => ({ ...f, category_fr: e.target.value, category: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A2140F]"
                                placeholder="Ex: Bourses, Logement, Formations"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Arabe</label>
                            <input
                                type="text"
                                value={form.category_ar}
                                onChange={(e) => setForm((f) => ({ ...f, category_ar: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A2140F]"
                                dir="rtl"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Anglais</label>
                            <input
                                type="text"
                                value={form.category_en}
                                onChange={(e) => setForm((f) => ({ ...f, category_en: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A2140F]"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Montant cible (MAD) *</label>
                        <input
                            type="number"
                            name="target_amount"
                            value={form.target_amount}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A2140F]"
                            min="0"
                            step="0.01"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Montant collecté (MAD)</label>
                        <input
                            type="number"
                            name="current_amount"
                            value={form.current_amount}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A2140F]"
                            min="0"
                            step="0.01"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ordre</label>
                        <input
                            type="number"
                            name="order"
                            value={form.order}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A2140F]"
                            min="0"
                        />
                    </div>
                </div>

                {/* Traductions - Texte du bouton */}
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 mb-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Libellé du bouton</h3>
                    <div className="space-y-3">
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Français</label>
                            <input
                                type="text"
                                value={form.cta_label_fr}
                                onChange={(e) => setForm((f) => ({ ...f, cta_label_fr: e.target.value, cta_label: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A2140F]"
                                placeholder="Soutenir ce projet"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Arabe</label>
                            <input
                                type="text"
                                value={form.cta_label_ar}
                                onChange={(e) => setForm((f) => ({ ...f, cta_label_ar: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A2140F]"
                                dir="rtl"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Anglais</label>
                            <input
                                type="text"
                                value={form.cta_label_en}
                                onChange={(e) => setForm((f) => ({ ...f, cta_label_en: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A2140F]"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Lien du bouton</label>
                        <input
                            type="text"
                            name="cta_link"
                            value={form.cta_link}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A2140F]"
                            placeholder="/don"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A2140F]"
                        />
                        {(form.imagePreview || form.existingImage) && (
                            <div className="mt-2">
                                <img
                                    src={form.imagePreview || form.existingImage}
                                    alt="Aperçu"
                                    className="w-32 h-32 object-cover rounded-md border border-gray-300"
                                />
                            </div>
                        )}
                        <p className="mt-1 text-xs text-gray-500">Format accepté: JPG, PNG, GIF (max 4MB)</p>
                    </div>
                </div>

                <div className="flex items-center space-x-6 mb-4">
                    <label className="inline-flex items-center">
                        <input
                            type="checkbox"
                            name="is_highlighted"
                            checked={form.is_highlighted}
                            onChange={handleChange}
                            className="h-4 w-4 text-[#A2140F] border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Mettre en avant ce projet</span>
                    </label>
                    <label className="inline-flex items-center">
                        <input
                            type="checkbox"
                            name="is_active"
                            checked={form.is_active}
                            onChange={handleChange}
                            className="h-4 w-4 text-[#A2140F] border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Actif</span>
                    </label>
                </div>

                <div className="flex space-x-2">
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-4 py-2 bg-[#A2140F] text-white rounded-md hover:bg-[#c91a14] disabled:opacity-50"
                    >
                        {saving ? 'Enregistrement...' : editingId ? 'Mettre à jour' : 'Créer le projet'}
                    </button>
                    {editingId && (
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                        >
                            Annuler
                        </button>
                    )}
                </div>
            </form>

            {/* Tableau des projets */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Titre
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Objectif
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Collecté
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actif
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {projects.map((project) => (
                            <tr key={project.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {project.title}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {project.target_amount} MAD
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {project.current_amount} MAD
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    {project.is_active ? (
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                            Actif
                                        </span>
                                    ) : (
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                            Inactif
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={() => handleEdit(project)}
                                        className="text-[#A2140F] hover:text-[#c91a14] mr-4"
                                    >
                                        Modifier
                                    </button>
                                    <button
                                        onClick={() => handleDelete(project.id)}
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

export default SupportProjectsAdmin;


