import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';

function DonSuccess() {
    const [searchParams] = useSearchParams();
    const [don, setDon] = useState(null);
    const [loading, setLoading] = useState(true);
    const orderId = searchParams.get('order_id');

    useEffect(() => {
        // Ici, tu pourrais récupérer les détails du don depuis l'API si nécessaire
        // Pour l'instant, on affiche juste un message de succès
        setLoading(false);
    }, [orderId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A2140F] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Chargement...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Éléments décoratifs en arrière-plan */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-96 h-96 bg-[#204F01]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#A2140F]/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
            </div>

            <div className="max-w-2xl mx-auto relative z-10">
                <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center border border-gray-100 animate-fadeIn">
                    {/* Animation de succès */}
                    <div className="mb-8">
                        <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-gradient-to-br from-green-100 to-green-50 mb-6 animate-fadeIn">
                            <div className="relative">
                                {/* Cercle animé */}
                                <div className="absolute inset-0 rounded-full border-4 border-green-200 animate-ping"></div>
                                <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                                    <svg
                                        className="h-10 w-10 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={3}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Message de succès */}
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
                        Merci pour votre don !
                    </h1>
                    <div className="w-32 h-1.5 bg-gradient-to-r from-[#A2140F] to-[#204F01] mx-auto rounded-full mb-6"></div>
                    <p className="text-xl text-gray-700 mb-2 leading-relaxed">
                        Votre paiement a été effectué avec succès.
                    </p>
                    <p className="text-lg text-gray-600 mb-8">
                        Nous vous remercions chaleureusement pour votre générosité et votre engagement envers notre cause.
                    </p>

                    {/* Icône cœur */}
                    <div className="mb-8">
                        <div className="inline-block text-6xl animate-pulse">💚</div>
                    </div>

                    {/* Informations de transaction */}
                    {orderId && (
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 mb-8 border border-gray-200">
                            <p className="text-sm text-gray-600 mb-2 font-semibold">Numéro de transaction :</p>
                            <p className="font-mono font-bold text-2xl text-[#A2140F]">{orderId}</p>
                            <p className="text-xs text-gray-500 mt-3">
                                Un email de confirmation vous a été envoyé
                            </p>
                        </div>
                    )}

                    {/* Message d'impact */}
                    <div className="bg-gradient-to-r from-[#204F01]/10 to-[#A2140F]/10 rounded-xl p-6 mb-8 border border-[#204F01]/20">
                        <p className="text-gray-700 text-lg leading-relaxed">
                            <span className="font-semibold text-[#204F01]">Votre contribution</span> nous permet de continuer à offrir un avenir meilleur aux jeunes que nous accompagnons. 
                            <span className="font-semibold text-[#A2140F]"> Merci de faire partie de cette mission !</span>
                        </p>
                    </div>

                    {/* Boutons d'action */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/"
                            className="inline-flex items-center justify-center bg-gradient-to-r from-[#A2140F] to-[#c91a14] text-white px-8 py-4 rounded-xl font-bold hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            Retour à l'accueil
                        </Link>
                        <Link
                            to="/don"
                            className="inline-flex items-center justify-center bg-transparent border-2 border-[#204F01] text-[#204F01] px-8 py-4 rounded-xl font-bold hover:bg-[#204F01] hover:text-white transition-all duration-300 transform hover:scale-105"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Faire un autre don
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DonSuccess;
