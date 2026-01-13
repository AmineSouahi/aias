import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import SupportProjects from './SupportProjects';

function Contact() {
    const { t } = useTranslation(['common', 'contact']);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            const response = await axios.post('/contact', formData);
            if (response.data.success) {
                setSubmitStatus('success');
                setFormData({ name: '', email: '', phone: '', message: '' });
                // Masquer le message de succès après 5 secondes
                setTimeout(() => setSubmitStatus(null), 5000);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setSubmitStatus('error');
            // Masquer le message d'erreur après 5 secondes
            setTimeout(() => setSubmitStatus(null), 5000);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <>
            {/* Hero Section avec image de don */}
            <section className="relative mt-16 md:mt-20 h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden">
                <div className="relative h-full">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: `url(/images/don.jpeg)`,
                        }}
                    >
                        {/* Overlay gradient rouge-vert */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#A2140F]/95 via-[#A2140F]/85 to-[#204F01]/85" />
                    </div>
                    <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
                        <div className="max-w-2xl text-white animate-fade-in">
                            <p className="mb-2 md:mb-3 text-sm sm:text-base md:text-lg lg:text-xl font-medium text-white/90">
                                {t('contact:hero.associationName')}
                            </p>
                            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-3 md:mb-4 drop-shadow-lg leading-tight">
                                {t('contact:hero.title')}
                            </h2>
                            <p className="text-base sm:text-lg md:text-xl mb-2 md:mb-3 text-white/95 leading-relaxed">
                                {t('contact:hero.description1')}
                            </p>
                            <p className="text-xs sm:text-sm md:text-base mb-6 md:mb-8 text-white/80 max-w-xl">
                                {t('contact:hero.description2')}
                            </p>
                            <div className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4">
                                <Link
                                    to="/don"
                                    className="inline-block bg-white text-[#A2140F] px-6 md:px-8 py-2.5 md:py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm md:text-base text-center"
                                >
                                    {t('contact:hero.makeDonation')}
                                </Link>
                                <Link
                                    to="/partenaires"
                                    className="inline-block bg-transparent border-2 border-white/80 text-white px-6 md:px-8 py-2.5 md:py-3 rounded-lg font-semibold hover:bg-white hover:text-[#A2140F] transition-colors text-sm md:text-base text-center"
                                >
                                    {t('contact:hero.becomePartner')}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section "Ce que vous pouvez faire pour nous soutenir?" */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-[#204F01] mb-4">
                            {t('contact:support.title')}
                    </h2>
                        <div className="w-24 h-1.5 bg-gradient-to-r from-[#A2140F] to-[#204F01] mx-auto rounded-full" />
                        <p className="mt-4 text-gray-600 max-w-3xl mx-auto">
                            {t('contact:support.subtitle')}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 lg:gap-10 max-w-4xl mx-auto">
                        {/* Faire un don */}
                        <div className="group relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 text-center border border-gray-100 hover:-translate-y-2 hover:shadow-2xl hover:border-[#A2140F]/40 transition-all duration-300">
                            <div className="absolute inset-x-0 -top-1 h-1 rounded-t-2xl bg-gradient-to-r from-[#A2140F] to-[#c91a14] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-[#A2140F]/10 flex items-center justify-center text-3xl group-hover:scale-110 group-hover:-translate-y-1 transition-transform duration-300 shadow-sm">
                                💝
                            </div>
                            <h3 className="text-2xl font-extrabold text-[#204F01] mb-3">
                                {t('contact:support.donation.title')}
                            </h3>
                            <p className="text-gray-700 mb-6 leading-relaxed">
                                {t('contact:support.donation.description')}
                            </p>
                            <Link
                                to="/don"
                                className="inline-flex items-center justify-center bg-gradient-to-r from-[#A2140F] to-[#c91a14] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                            >
                                {t('contact:support.donation.button')}
                                <svg
                                    className="w-4 h-4 ml-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                                    />
                                </svg>
                            </Link>
                        </div>

                        {/* Devenir partenaire */}
                        <div className="group relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 text-center border border-gray-100 hover:-translate-y-2 hover:shadow-2xl hover:border-[#204F01]/40 transition-all duration-300">
                            <div className="absolute inset-x-0 -top-1 h-1 rounded-t-2xl bg-gradient-to-r from-[#204F01] to-[#4b8a1f] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-[#204F01]/10 flex items-center justify-center text-3xl group-hover:scale-110 group-hover:-translate-y-1 transition-transform duration-300 shadow-sm">
                                🤝
                            </div>
                            <h3 className="text-2xl font-extrabold text-[#204F01] mb-3">
                                {t('contact:support.partner.title')}
                            </h3>
                            <p className="text-gray-700 mb-6 leading-relaxed">
                                {t('contact:support.partner.description')}
                            </p>
                            <Link
                                to="/partenaires"
                                className="inline-flex items-center justify-center bg-gradient-to-r from-[#204F01] to-[#2d6f02] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                            >
                                {t('contact:support.partner.button')}
                                <svg
                                    className="w-4 h-4 ml-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                                    />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Projets à financer dynamiques */}
            <SupportProjects />

            {/* Message de gratitude */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4 max-w-4xl text-center">
                    <p className="text-lg text-gray-700 leading-relaxed">
                        {t('contact:gratitude.message')}
                    </p>
                </div>
            </section>

            {/* Section Donation avec RIB */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
                        <h2 className="text-3xl font-bold text-[#A2140F] mb-6 text-center">
                            {t('contact:donation.title')}
                        </h2>
                        <h3 className="text-2xl font-semibold text-[#204F01] mb-6 text-center">
                            {t('contact:donation.subtitle')}
                        </h3>
                        <div className="bg-gray-50 border-2 border-[#A2140F] rounded-xl p-6 mb-6">
                            <p className="font-semibold text-gray-800 mb-3 text-center">
                                {t('contact:donation.rib.label')}
                            </p>
                            <p className="text-2xl font-mono font-bold text-[#A2140F] text-center">
                                {t('contact:donation.rib.value')}
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-gray-700 mb-6 text-lg">
                                {t('contact:donation.online.question')}
                            </p>
                            <Link
                                to="/don"
                                className="inline-block bg-[#A2140F] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#c91a14] transition-colors text-lg"
                            >
                                {t('contact:donation.online.button')}
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section Contact */}
            <section
                id="contact"
                className="py-20 bg-white"
            >
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-[#204F01] mb-4">
                            {t('contact:contact.title')}
                        </h2>
                        <div className="w-24 h-1.5 bg-gradient-to-r from-[#A2140F] to-[#204F01] mx-auto rounded-full" />
                        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
                            {t('contact:contact.subtitle')}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">
                        {/* Contact Information */}
                        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-100">
                            <h3 className="text-2xl font-bold text-[#A2140F] mb-6 flex items-center gap-3">
                                <div className="w-8 h-8 bg-[#A2140F]/10 rounded-lg flex items-center justify-center">
                                    <svg
                                        className="w-5 h-5 text-[#A2140F]"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                        />
                                    </svg>
                                </div>
                                {t('contact:contact.info.title')}
                            </h3>

                            <div className="space-y-6">
                                {/* Adresse */}
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-[#204F01] rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                                        <svg
                                            className="w-6 h-6 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 mb-1">{t('contact:contact.info.address')}</p>
                                        <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                                            {t('contact:contact.info.addressValue')}
                                        </p>
                                    </div>
                                </div>

                                {/* Téléphone */}
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-[#204F01] rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                                        <svg
                                            className="w-6 h-6 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 mb-1">{t('contact:contact.info.phone')}</p>
                                        <a href={`tel:${t('footer.phone')}`} className="text-gray-600 hover:text-[#A2140F] transition-colors">
                                            {t('footer.phone')}
                                        </a>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-[#204F01] rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                                        <svg
                                            className="w-6 h-6 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 mb-1">{t('contact:contact.info.email')}</p>
                                        <a href={`mailto:${t('footer.email')}`} className="text-gray-600 hover:text-[#A2140F] transition-colors">
                                            {t('footer.email')}
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Réseaux Sociaux */}
                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <h4 className="font-bold text-gray-900 mb-5 text-lg">
                                    {t('contact:contact.info.socialMedia')}
                                </h4>
                                <div className="flex gap-4">
                                    {/* Facebook */}
                                    <a
                                        href="https://web.facebook.com/Hani.elharraq"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-14 h-14 bg-blue-50 hover:bg-blue-500 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 group shadow-sm"
                                        aria-label="Facebook"
                                    >
                                        <svg className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                        </svg>
                                    </a>
                                    
                                    {/* LinkedIn */}
                                    <a
                                        href="https://www.linkedin.com/in/association-initiative-al-amal-pour-l-int%C3%A9gration-sociale-6569662b5/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-14 h-14 bg-amber-50 hover:bg-amber-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 group shadow-sm"
                                        aria-label="LinkedIn"
                                    >
                                        <svg className="w-7 h-7 text-amber-600 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                        </svg>
                                    </a>
                                    
                                    {/* Instagram */}
                                    <a
                                        href="https://www.instagram.com/initiative_alamal_association_/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-14 h-14 bg-gray-100 hover:bg-gradient-to-br hover:from-purple-500 hover:via-pink-500 hover:to-orange-500 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 group shadow-sm"
                                        aria-label="Instagram"
                                    >
                                        <svg className="w-7 h-7 text-gray-600 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-100">
                            <h3 className="text-2xl font-bold text-[#A2140F] mb-6">
                                {t('contact:contact.form.title')}
                            </h3>
                            
                            {/* Messages de statut */}
                            {submitStatus === 'success' && (
                                <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl">
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p className="text-green-800 font-semibold">
                                            {t('contact:contact.form.success')}
                                        </p>
                                    </div>
                                </div>
                            )}
                            
                            {submitStatus === 'error' && (
                                <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p className="text-red-800 font-semibold">
                                            {t('contact:contact.form.error')}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="block text-gray-700 font-semibold mb-2"
                                    >
                                        {t('contact:contact.form.name.label')}
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#A2140F] focus:border-[#A2140F] outline-none transition-all duration-200"
                                        placeholder={t('contact:contact.form.name.placeholder')}
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-gray-700 font-semibold mb-2"
                                    >
                                        {t('contact:contact.form.email.label')}
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#A2140F] focus:border-[#A2140F] outline-none transition-all duration-200"
                                        placeholder={t('contact:contact.form.email.placeholder')}
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="phone"
                                        className="block text-gray-700 font-semibold mb-2"
                                    >
                                        {t('contact:contact.form.phone.label')}
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#A2140F] focus:border-[#A2140F] outline-none transition-all duration-200"
                                        placeholder={t('contact:contact.form.phone.placeholder')}
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="message"
                                        className="block text-gray-700 font-semibold mb-2"
                                    >
                                        {t('contact:contact.form.message.label')}
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows="5"
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#A2140F] focus:border-[#A2140F] outline-none transition-all duration-200 resize-none"
                                        placeholder={t('contact:contact.form.message.placeholder')}
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-gradient-to-r from-[#A2140F] to-[#c91a14] text-white px-6 py-3.5 rounded-xl font-semibold hover:shadow-lg transform hover:scale-[1.01] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            {t('contact:contact.form.sending')}
                                        </span>
                                    ) : (
                                        t('contact:contact.form.submit')
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Contact;

