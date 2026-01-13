import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

function DonForm() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedAmount, setSelectedAmount] = useState(null);
    
    const [formData, setFormData] = useState({
        amount: '',
        customAmount: '',
        useCustomAmount: false,
        civility: '',
        full_name: '',
        city: '',
        country: 'Maroc',
        phone: '',
        email: '',
        accept_terms: false,
        newsletter: false,
    });

    useEffect(() => {
        // Vérifier s'il y a une erreur dans l'URL
        const errorParam = searchParams.get('error');
        if (errorParam === 'payment_failed') {
            setError('Le paiement a échoué. Veuillez réessayer.');
        } else if (errorParam === 'payment_cancelled') {
            setError('Le paiement a été annulé.');
        }
    }, [searchParams]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleAmountSelect = (amount) => {
        setSelectedAmount(amount);
        setFormData(prev => ({ 
            ...prev, 
            useCustomAmount: false, 
            amount: amount.toString(),
            customAmount: ''
        }));
    };

    const handleCustomAmount = () => {
        setSelectedAmount('custom');
        setFormData(prev => ({ 
            ...prev, 
            useCustomAmount: true, 
            amount: '',
            customAmount: ''
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            // Déterminer le montant final
            const finalAmount = formData.useCustomAmount ? formData.customAmount : formData.amount;

            if (!finalAmount || parseFloat(finalAmount) <= 0) {
                setError('Veuillez sélectionner ou saisir un montant valide.');
                setLoading(false);
                return;
            }

            // Préparer les données pour l'API
            const donationData = {
                amount: parseFloat(finalAmount),
                civility: formData.civility || null,
                full_name: formData.full_name,
                city: formData.city || null,
                country: formData.country,
                phone: formData.phone || null,
                email: formData.email,
                accept_terms: formData.accept_terms,
                newsletter: formData.newsletter,
            };

            // Envoyer la requête au backend
            const response = await axios.post('/don', donationData);

            if (response.data.success && response.data.payzone_url) {
                // Rediriger vers Payzone
                window.location.href = response.data.payzone_url;
            } else {
                setError(response.data.message || 'Une erreur est survenue. Veuillez réessayer.');
            }
        } catch (err) {
            console.error('Erreur lors de la soumission:', err);
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else if (err.response?.data?.errors) {
                const errors = Object.values(err.response.data.errors).flat();
                setError(errors.join(', '));
            } else {
                setError('Une erreur est survenue. Veuillez réessayer.');
            }
        } finally {
            setLoading(false);
        }
    };

    const amounts = [100, 200, 300, 500, 1000];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden mt-16 md:mt-20">
            {/* Éléments décoratifs en arrière-plan */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-96 h-96 bg-[#A2140F]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#204F01]/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Header avec animation */}
                <div className="text-center mb-12 animate-fadeIn">
                    <div className="inline-block mb-4">
                        <span className="text-sm font-semibold text-[#204F01] bg-[#204F01]/10 px-4 py-2 rounded-full">
                            NOUS SOUTENIR
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4 leading-tight">
                        Changez la vie d'un jeune orphelin
                        <span className="block text-[#A2140F] mt-2">grâce à vos dons</span>
                    </h1>
                    <div className="w-32 h-1.5 bg-gradient-to-r from-[#A2140F] to-[#204F01] mx-auto rounded-full"></div>
                    <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
                        Votre générosité fait la différence. Chaque contribution compte pour offrir un avenir meilleur.
                    </p>
                </div>

                {/* Formulaire principal */}
                <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 border border-gray-100 backdrop-blur-sm">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg animate-slide-down">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <p className="text-red-800 text-sm font-medium">{error}</p>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Section Montant - Design moderne avec cartes */}
                        <div>
                            <label className="block text-gray-900 font-bold text-xl mb-6 flex items-center">
                                <svg className="w-6 h-6 text-[#A2140F] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Choisissez le montant que vous souhaitez donner
                            </label>
                            
                            {/* Grille de montants */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                                {amounts.map((amount) => (
                                    <button
                                        key={amount}
                                        type="button"
                                        onClick={() => handleAmountSelect(amount)}
                                        className={`relative p-6 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                                            selectedAmount === amount
                                                ? 'border-[#A2140F] bg-gradient-to-br from-[#A2140F]/10 to-[#A2140F]/5 shadow-md'
                                                : 'border-gray-200 bg-white hover:border-[#A2140F]/50'
                                        }`}
                                    >
                                        <div className="text-center">
                                            <div className={`text-3xl font-bold mb-2 ${
                                                selectedAmount === amount ? 'text-[#A2140F]' : 'text-gray-800'
                                            }`}>
                                                {amount}
                                            </div>
                                            <div className="text-sm text-gray-600">MAD</div>
                                        </div>
                                        {selectedAmount === amount && (
                                            <div className="absolute top-2 right-2">
                                                <div className="w-6 h-6 bg-[#A2140F] rounded-full flex items-center justify-center">
                                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            </div>
                                        )}
                                    </button>
                                ))}
                                
                                {/* Option montant personnalisé */}
                                <button
                                    type="button"
                                    onClick={handleCustomAmount}
                                    className={`relative p-6 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                                        selectedAmount === 'custom'
                                            ? 'border-[#204F01] bg-gradient-to-br from-[#204F01]/10 to-[#204F01]/5 shadow-md'
                                            : 'border-gray-200 bg-white hover:border-[#204F01]/50'
                                    }`}
                                >
                                    <div className="text-center">
                                        <svg className="w-8 h-8 mx-auto mb-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        <div className={`text-sm font-semibold ${
                                            selectedAmount === 'custom' ? 'text-[#204F01]' : 'text-gray-700'
                                        }`}>
                                            Autre montant
                                        </div>
                                    </div>
                                </button>
                            </div>

                            {/* Input montant personnalisé */}
                            {formData.useCustomAmount && (
                                <div className="animate-fadeIn">
                                    <div className="relative">
                                        <input
                                            type="number"
                                            name="customAmount"
                                            value={formData.customAmount}
                                            onChange={handleChange}
                                            min="1"
                                            step="0.01"
                                            placeholder="Saisissez le montant de votre choix (MAD)"
                                            className="w-full px-6 py-4 border-2 border-[#204F01] rounded-xl focus:ring-2 focus:ring-[#204F01] focus:border-[#204F01] outline-none text-lg font-semibold"
                                            autoFocus
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#204F01] font-bold">
                                            MAD
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Divider */}
                        <div className="border-t border-gray-200"></div>

                        {/* Section Coordonnées */}
                        <div>
                            <label className="block text-gray-900 font-bold text-xl mb-6 flex items-center">
                                <svg className="w-6 h-6 text-[#A2140F] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Vos coordonnées
                            </label>
                            
                            <div className="space-y-5">
                                {/* Civilité - Design moderne */}
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-3">Civilité</label>
                                    <div className="flex space-x-4">
                                        {['Mme', 'M.'].map((civ) => (
                                            <label
                                                key={civ}
                                                className={`flex-1 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                                                    formData.civility === civ
                                                        ? 'border-[#A2140F] bg-[#A2140F]/10'
                                                        : 'border-gray-200 hover:border-[#A2140F]/50'
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="civility"
                                                    value={civ}
                                                    checked={formData.civility === civ}
                                                    onChange={handleChange}
                                                    className="sr-only"
                                                />
                                                <span className={`font-medium ${
                                                    formData.civility === civ ? 'text-[#A2140F]' : 'text-gray-700'
                                                }`}>
                                                    {civ}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Nom & Prénom */}
                                <div>
                                    <label htmlFor="full_name" className="block text-gray-700 font-semibold mb-2">
                                        Nom & prénom <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="full_name"
                                        name="full_name"
                                        value={formData.full_name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#A2140F] focus:border-[#A2140F] outline-none transition-all duration-300"
                                        placeholder="Votre nom et prénom"
                                    />
                                </div>

                                {/* Ville et Pays en ligne */}
                                <div className="grid md:grid-cols-2 gap-5">
                                    <div>
                                        <label htmlFor="city" className="block text-gray-700 font-semibold mb-2">
                                            Ville
                                        </label>
                                        <input
                                            type="text"
                                            id="city"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#A2140F] focus:border-[#A2140F] outline-none transition-all duration-300"
                                            placeholder="Votre ville"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="country" className="block text-gray-700 font-semibold mb-2">
                                            Pays
                                        </label>
                                        <input
                                            type="text"
                                            id="country"
                                            name="country"
                                            value={formData.country}
                                            onChange={handleChange}
                                            className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#A2140F] focus:border-[#A2140F] outline-none transition-all duration-300"
                                        />
                                    </div>
                                </div>

                                {/* Téléphone et Email en ligne */}
                                <div className="grid md:grid-cols-2 gap-5">
                                    <div>
                                        <label htmlFor="phone" className="block text-gray-700 font-semibold mb-2">
                                            Téléphone
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#A2140F] focus:border-[#A2140F] outline-none transition-all duration-300"
                                            placeholder="06 12 34 56 78"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
                                            Email <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#A2140F] focus:border-[#A2140F] outline-none transition-all duration-300"
                                            placeholder="votre@email.com"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-gray-200"></div>

                        {/* Checkboxes - Design moderne */}
                        <div className="space-y-4">
                            <label className="flex items-start cursor-pointer group">
                                <div className={`flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 mr-3 mt-0.5 ${
                                    formData.accept_terms
                                        ? 'bg-[#A2140F] border-[#A2140F]'
                                        : 'border-gray-300 group-hover:border-[#A2140F]'
                                }`}>
                                    {formData.accept_terms && (
                                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </div>
                                <input
                                    type="checkbox"
                                    name="accept_terms"
                                    checked={formData.accept_terms}
                                    onChange={handleChange}
                                    required
                                    className="sr-only"
                                />
                                <span className="text-gray-700 text-sm">
                                    J'accepte les <span className="text-[#A2140F] font-semibold">conditions générales de don</span>
                                </span>
                            </label>
                            <label className="flex items-start cursor-pointer group">
                                <div className={`flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 mr-3 mt-0.5 ${
                                    formData.newsletter
                                        ? 'bg-[#204F01] border-[#204F01]'
                                        : 'border-gray-300 group-hover:border-[#204F01]'
                                }`}>
                                    {formData.newsletter && (
                                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </div>
                                <input
                                    type="checkbox"
                                    name="newsletter"
                                    checked={formData.newsletter}
                                    onChange={handleChange}
                                    className="sr-only"
                                />
                                <span className="text-gray-700 text-sm">
                                    Je souhaite m'abonner à la <span className="text-[#204F01] font-semibold">Newsletter</span>
                                </span>
                            </label>
                        </div>

                        {/* Bouton Valider - Design moderne */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-[#A2140F] to-[#c91a14] text-white px-8 py-5 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Traitement en cours...</span>
                                </>
                            ) : (
                                <>
                                    <span>VALIDER</span>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Information virement bancaire - Design moderne */}
                <div className="mt-10 bg-gradient-to-r from-[#204F01] to-[#2d6a00] rounded-2xl p-8 text-center text-white shadow-xl">
                    <div className="flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        <h3 className="text-xl font-bold">Virement bancaire direct</h3>
                    </div>
                    <p className="text-lg font-semibold mb-2">Association Initiative Al Amal</p>
                    <p className="text-2xl font-mono font-bold bg-white/10 px-6 py-3 rounded-lg inline-block">
                        011 780 0000772000006736 41
                    </p>
                </div>
            </div>
        </div>
    );
}

export default DonForm;
