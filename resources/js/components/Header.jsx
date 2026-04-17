import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

function Header() {
    const { t, i18n } = useTranslation('common');
    const location = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isNavbarVisible, setIsNavbarVisible] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobileMenuClosing, setIsMobileMenuClosing] = useState(false);
    const [logoError, setLogoError] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
    
    // Fonction pour fermer le menu avec animation
    const closeMobileMenu = () => {
        setIsMobileMenuClosing(true);
        setTimeout(() => {
            setIsMobileMenuOpen(false);
            setIsMobileMenuClosing(false);
        }, 400); // Durée de l'animation
    };
    
    // Fonction pour changer la langue
    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        localStorage.setItem('i18nextLng', lng);
    };
    
    // Obtenir la langue actuelle
    const currentLanguage = i18n.language || 'fr';

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            const isScrolledDown = currentScrollY > 50;
            setIsScrolled(isScrolledDown);

            // Si on est tout en haut, toujours afficher la navbar complètement
            if (currentScrollY < 10) {
                setIsNavbarVisible(true);
            } else {
                // Détecter la direction du scroll
                const scrollDifference = Math.abs(currentScrollY - lastScrollY);
                
                // Réagir seulement si le scroll est significatif (évite les micro-mouvements)
                if (scrollDifference > 5) {
                    if (currentScrollY < lastScrollY) {
                        // Scroll vers le haut - TOUJOURS afficher la navbar complètement (top bar + navigation)
                        setIsNavbarVisible(true);
                    } else if (currentScrollY > lastScrollY && currentScrollY > 150) {
                        // Scroll vers le bas - cacher la navbar seulement si on est assez bas (plus de 150px)
                        setIsNavbarVisible(false);
                    }
                }
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    // Bloquer le scroll du body quand le menu mobile est ouvert
    useEffect(() => {
        if (isMobileMenuOpen && !isMobileMenuClosing) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMobileMenuOpen, isMobileMenuClosing]);

    // Vérifier si le logo existe au chargement
    useEffect(() => {
        const img = new Image();
        img.onerror = () => setLogoError(true);
        img.src = 'https://aiais.org/public/images/aiais.png';
    }, []);

    // Vérifier l'authentification
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const response = await axios.get('/user');
            setIsAuthenticated(response.data.success);
        } catch (error) {
            setIsAuthenticated(false);
        }
    };

    // Navbar sur la page d'accueil (fond transparent mais "capsule" blanche pour le menu)
    const isHomeTransparent = location.pathname === '/' && !isScrolled;

    return (
        <>
            {/* Header principal - Navigation (navbar flottante) */}
            <header
                className={`fixed left-0 right-0 top-0 z-50 navbar-slow-motion transition-all duration-300 ${
                    !isNavbarVisible
                        ? '-translate-y-full opacity-0'
                        : 'translate-y-0 opacity-100'
                } bg-transparent shadow-none border-b border-transparent`}
            >
                <nav className="container mx-auto px-4 py-4 md:py-5">
                    <div className="flex items-center justify-between gap-4">
                        {/* Logo mobile (en dehors de la capsule) */}
                        <Link to="/" className="flex items-center space-x-3 group lg:hidden">
                            {logoError ? (
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 bg-white/90 border border-white/80">
                                    <span className="text-[#A2140F] font-bold text-lg">A</span>
                                </div>
                            ) : (
                                <div className="relative">
                                    <img
                                        src={currentLanguage === 'en' ? 'https://aiais.org/public/images/aiais.png' : 'https://aiais.org/public/images/aiais.png'}
                                        alt="Association Initiative Al Amal Pour l'Intégration Sociale"
                                        className="h-12 w-auto object-contain max-w-[180px] transition-all duration-300 group-hover:scale-105"
                                        loading="eager"
                                        onError={() => setLogoError(true)}
                                        style={{ 
                                            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))',
                                            imageRendering: 'auto'
                                        }}
                                    />
                                </div>
                            )}
                        </Link>

                        {/* Desktop : capsule blanche contenant logo + liens + CTA + langue + login */}
                        <div className="hidden lg:flex flex-1 justify-center">
                            <div className="flex items-center justify-between gap-4 px-5 py-1.5 bg-white/95 rounded-full shadow-[0_18px_45px_rgba(15,23,42,0.12)] border border-gray-100 w-full max-w-6xl h-[60px]">
                                {/* Logo dans la capsule */}
                                <Link to="/" className="flex items-center gap-2 pr-4 mr-2 border-r border-gray-200 group">
                                    {logoError ? (
                                        <div className="w-20 h-20 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md bg-white">
                                            <span className="text-[#A2140F] font-bold text-2xl">A</span>
                                        </div>
                                    ) : (
                                        <div className="relative flex items-center" style={{ height: '80px', width: 'auto', maxWidth: '200px' }}>
                                            <img
                                                src={currentLanguage === 'en' ? 'https://aiais.org/public/images/aiais.png' : 'https://aiais.org/public/images/aiais.png'}
                                                alt="Association Initiative Al Amal Pour l'Intégration Sociale"
                                                className="h-20 max-h-20 w-auto object-contain transition-all duration-300 group-hover:scale-105"
                                                loading="eager"
                                                onError={() => setLogoError(true)}
                                                style={{ 
                                                    imageRendering: 'auto',
                                                    maxHeight: '80px',
                                                    height: '80px',
                                                    width: 'auto',
                                                    maxWidth: '200px',
                                                    objectFit: 'contain'
                                                }}
                                            />
                                        </div>
                                    )}
                                </Link>

                                {/* Liens de navigation */}
                                <div className="flex items-center gap-1 xl:gap-2">
                                <NavLink
                                to="/qui-nous-sommes"
                                className={({ isActive }) =>
                                `relative font-semibold px-2.5 py-2 rounded-full text-[11.5px] leading-tight whitespace-nowrap transition-all duration-300 ${
                                            isActive
                                                ? 'text-[#A2140F] bg-[#A2140F]/10'
                                                : 'text-gray-700 hover:text-[#A2140F] hover:bg-gray-50'
                                        }`
                                    }
                                >
                                    {t('nav.about')}
                                </NavLink>
                                <NavLink
                                    to="/ce-que-nous-faisons"
                                    className={({ isActive }) =>
                                    `relative font-semibold px-2.5 py-2 rounded-full text-[11.5px] leading-tight whitespace-nowrap transition-all duration-300 ${
                                            isActive
                                                ? 'text-[#A2140F] bg-[#A2140F]/10'
                                                : 'text-gray-700 hover:text-[#A2140F] hover:bg-gray-50'
                                        }`
                                    }
                                >
                                    {t('nav.whatWeDo')}
                                </NavLink>
                                <NavLink
                                    to="/nous-soutenir"
                                    className={({ isActive }) =>
                                    `relative font-semibold px-2.5 py-2 rounded-full text-[11.5px] leading-tight whitespace-nowrap transition-all duration-300 ${
                                            isActive
                                                ? 'text-[#A2140F] bg-[#A2140F]/10'
                                                : 'text-gray-700 hover:text-[#A2140F] hover:bg-gray-50'
                                        }`
                                    }
                                >
                                    {t('nav.support')}
                                </NavLink>
                                <NavLink
                                    to="/news"
                                    className={({ isActive }) =>
                                    `relative font-semibold px-2.5 py-2 rounded-full text-[11.5px] leading-tight whitespace-nowrap transition-all duration-300 ${
                                            isActive
                                                ? 'text-[#A2140F] bg-[#A2140F]/10'
                                                : 'text-gray-700 hover:text-[#A2140F] hover:bg-gray-50'
                                        }`
                                    }
                                >
                                    {t('nav.news')}
                                </NavLink>
                                <NavLink
                                    to="/partenaires"
                                    className={({ isActive }) =>
                                    `relative font-semibold px-2.5 py-2 rounded-full text-[11.5px] leading-tight whitespace-nowrap transition-all duration-300 ${
                                            isActive
                                                ? 'text-[#A2140F] bg-[#A2140F]/10'
                                                : 'text-gray-700 hover:text-[#A2140F] hover:bg-gray-50'
                                        }`
                                    }
                                >
                                    {t('nav.partners')}
                                </NavLink>
                                </div>

                                {/* CTA Don + Langues + Login dans la capsule */}
                                <div className="flex items-center gap-2 pl-4 ml-2 border-l border-gray-200">
                                    <NavLink
                                        to="/don"
                                        className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-full text-[12px] leading-none font-semibold whitespace-nowrap min-w-[120px] bg-gradient-to-r from-[#A2140F] to-[#c91a14] text-white shadow-md hover:shadow-lg hover:scale-105 transition-all"
                                    >
                                        <span>{t('buttons.makeDonation').toUpperCase()}</span>
                                    </NavLink>

                                    {/* Sélecteur de langue : globe + code langue, taille fixe */}
                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                                            className="inline-flex items-center justify-center gap-0.5 w-14 h-9 rounded-full border border-gray-300 text-[9px] font-semibold text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all px-2"
                                        >
                                            {/* Icône globe */}
                                            <svg
                                                className="w-3 h-3 text-gray-600"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                            >
                                                <circle cx="12" cy="12" r="9" strokeWidth="1.7" />
                                                <path
                                                    d="M3 12h18M12 3c-2.5 2.4-4 5.6-4 9s1.5 6.6 4 9c2.5-2.4 4-5.6 4-9s-1.5-6.6-4-9z"
                                                    strokeWidth="1.7"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                            <span className="uppercase">
                                                {currentLanguage === 'ar' ? 'AR' : currentLanguage === 'en' ? 'EN' : 'FR'}
                                            </span>
                                            <svg
                                                className={`w-2.5 h-2.5 text-gray-500 transition-transform duration-200 ${isLanguageMenuOpen ? 'rotate-180' : ''}`}
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>

                                        {/* Menu déroulant langues */}
                                        {isLanguageMenuOpen && (
                                            <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                                                <button
                                                    onClick={() => { changeLanguage('fr'); setIsLanguageMenuOpen(false); }}
                                                    className={`block w-full text-left px-3 py-1.5 text-xs rounded-lg ${
                                                        currentLanguage === 'fr'
                                                            ? 'bg-[#A2140F]/10 text-[#A2140F] font-semibold'
                                                            : 'text-gray-700 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    FR - Français
                                                </button>
                                                <button
                                                    onClick={() => { changeLanguage('ar'); setIsLanguageMenuOpen(false); }}
                                                    className={`block w-full text-left px-3 py-1.5 text-xs rounded-lg ${
                                                        currentLanguage === 'ar'
                                                            ? 'bg-[#A2140F]/10 text-[#A2140F] font-semibold'
                                                            : 'text-gray-700 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    AR - العربية
                                                </button>
                                                <button
                                                    onClick={() => { changeLanguage('en'); setIsLanguageMenuOpen(false); }}
                                                    className={`block w-full text-left px-3 py-1.5 text-xs rounded-lg ${
                                                        currentLanguage === 'en'
                                                            ? 'bg-[#A2140F]/10 text-[#A2140F] font-semibold'
                                                            : 'text-gray-700 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    EN - English
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Icône login seule */}
                                    <Link
                                        to="/login"
                                        className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300 transition-all"
                                        title={t('nav.login') || 'Connexion'}
                                    >
                                        <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M6 21a6 6 0 0112 0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className={`lg:hidden relative w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-300 group ${
                                isHomeTransparent ? 'text-white hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100'
                            }`}
                            onClick={() => {
                                if (isMobileMenuOpen) {
                                    closeMobileMenu();
                                } else {
                                    setIsMobileMenuOpen(true);
                                }
                            }}
                            aria-label="Menu"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-[#A2140F]/10 to-[#204F01]/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <svg
                                className="w-6 h-6 relative z-10 transition-transform duration-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                {isMobileMenuOpen ? (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2.5}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                ) : (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2.5}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                )}
                            </svg>
                        </button>
                    </div>
                </nav>
            </header>

            {/* Mobile Menu - Full Screen Overlay */}
            {isMobileMenuOpen && (
                <>
                    {/* Backdrop overlay */}
                    <div 
                        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] lg:hidden ${
                            isMobileMenuClosing ? 'animate-fade-out' : 'animate-fade-in'
                        }`}
                        onClick={closeMobileMenu}
                    />
                    
                    {/* Mobile Menu Panel - Sidebar */}
                    <div className={`fixed inset-y-0 right-0 w-full max-w-sm bg-white z-[70] lg:hidden shadow-2xl overflow-y-auto ${
                        isMobileMenuClosing ? 'animate-slide-out-right' : 'animate-slide-in-right'
                    }`}>
                            {/* Header with Logo and Close Button */}
                            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-200">
                                {/* Logo */}
                                <Link 
                                    to="/" 
                                    className="flex items-center group"
                                    onClick={closeMobileMenu}
                                >
                                    {logoError ? (
                                        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-gray-100 border border-gray-200">
                                            <span className="text-[#A2140F] font-bold text-xl">A</span>
                                        </div>
                                    ) : (
                                        <img
                                            src={currentLanguage === 'en' ? 'https://aiais.org/public/images/aiais.png' : 'https://aiais.org/public/images/aiais.png'}
                                            alt="Association Initiative Al Amal"
                                            className="h-14 w-auto object-contain"
                                            loading="eager"
                                            onError={() => setLogoError(true)}
                                        />
                                    )}
                                </Link>
                                
                                {/* Close Button */}
                                <button
                                    onClick={closeMobileMenu}
                                    className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 border border-gray-200 flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                                    aria-label="Close menu"
                                >
                                    <svg 
                                        className="w-6 h-6 text-gray-700 group-hover:rotate-90 transition-transform duration-300" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Navigation Links */}
                            <div className="px-6 py-6 space-y-2">
                                <NavLink
                                    to="/qui-nous-sommes"
                                    className={({ isActive }) =>
                                        `block py-4 px-4 rounded-xl font-bold text-lg text-gray-900 transition-all duration-300 ${
                                            isActive 
                                                ? 'bg-gradient-to-r from-[#A2140F]/10 to-[#A2140F]/5 border-l-4 border-[#A2140F] shadow-md' 
                                                : 'hover:bg-gray-50 hover:translate-x-2'
                                        }`
                                    }
                                    onClick={closeMobileMenu}
                                >
                                    {t('nav.about')}
                                </NavLink>
                                
                                <NavLink
                                    to="/ce-que-nous-faisons"
                                    className={({ isActive }) =>
                                        `block py-4 px-4 rounded-xl font-bold text-lg text-gray-900 transition-all duration-300 ${
                                            isActive 
                                                ? 'bg-gradient-to-r from-[#A2140F]/10 to-[#A2140F]/5 border-l-4 border-[#A2140F] shadow-md' 
                                                : 'hover:bg-gray-50 hover:translate-x-2'
                                        }`
                                    }
                                    onClick={closeMobileMenu}
                                >
                                    {t('nav.whatWeDo')}
                                </NavLink>
                                
                                <NavLink
                                    to="/nous-soutenir"
                                    className={({ isActive }) =>
                                        `block py-4 px-4 rounded-xl font-bold text-lg text-gray-900 transition-all duration-300 ${
                                            isActive 
                                                ? 'bg-gradient-to-r from-[#A2140F]/10 to-[#A2140F]/5 border-l-4 border-[#A2140F] shadow-md' 
                                                : 'hover:bg-gray-50 hover:translate-x-2'
                                        }`
                                    }
                                    onClick={closeMobileMenu}
                                >
                                    {t('nav.support')}
                                </NavLink>
                                
                                <NavLink
                                    to="/news"
                                    className={({ isActive }) =>
                                        `block py-4 px-4 rounded-xl font-bold text-lg text-gray-900 transition-all duration-300 ${
                                            isActive 
                                                ? 'bg-gradient-to-r from-[#A2140F]/10 to-[#A2140F]/5 border-l-4 border-[#A2140F] shadow-md' 
                                                : 'hover:bg-gray-50 hover:translate-x-2'
                                        }`
                                    }
                                    onClick={closeMobileMenu}
                                >
                                    {t('nav.news')}
                                </NavLink>
                                
                                <NavLink
                                    to="/partenaires"
                                    className={({ isActive }) =>
                                        `block py-4 px-4 rounded-xl font-bold text-lg text-gray-900 transition-all duration-300 ${
                                            isActive 
                                                ? 'bg-gradient-to-r from-[#A2140F]/10 to-[#A2140F]/5 border-l-4 border-[#A2140F] shadow-md' 
                                                : 'hover:bg-gray-50 hover:translate-x-2'
                                        }`
                                    }
                                    onClick={closeMobileMenu}
                                >
                                    {t('nav.partners')}
                                </NavLink>
                            </div>

                            {/* Contact Information Section */}
                            <div className="px-6 py-6 border-t border-gray-200">
                                <h3 className="text-gray-900 font-bold text-lg mb-4">{t('footer.contact')}</h3>
                                <div className="space-y-4">
                                    {/* Address */}
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                                            <svg className="w-5 h-5 text-[#A2140F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-gray-700 text-sm leading-relaxed">
                                                {t('footer.address')}<br />
                                                {t('footer.addressLine2')}<br />
                                                {t('footer.addressLine3')}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Phone */}
                                    <a 
                                        href={`tel:${t('footer.phone')}`}
                                        className="flex items-center gap-3 group"
                                    >
                                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 group-hover:bg-[#A2140F]/10 transition-colors">
                                            <svg className="w-5 h-5 text-[#A2140F] group-hover:text-[#A2140F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                        </div>
                                        <span className="text-gray-700 text-sm group-hover:text-[#A2140F] transition-colors">{t('footer.phone')}</span>
                                    </a>

                                    {/* Email */}
                                    <a 
                                        href={`mailto:${t('footer.email')}`}
                                        className="flex items-center gap-3 group"
                                    >
                                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 group-hover:bg-[#A2140F]/10 transition-colors">
                                            <svg className="w-5 h-5 text-[#A2140F] group-hover:text-[#A2140F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <span className="text-gray-700 text-sm group-hover:text-[#A2140F] transition-colors break-all">{t('footer.email')}</span>
                                    </a>
                                </div>
                            </div>

                            {/* CTA Button */}
                            <div className="px-6 py-6 border-t border-gray-200">
                                <NavLink
                                    to="/don"
                                    className="block w-full bg-gradient-to-r from-[#A2140F] to-[#c91a14] text-white px-6 py-4 rounded-xl font-bold text-base text-center shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group"
                                    onClick={closeMobileMenu}
                                >
                                    <span className="flex items-center justify-center gap-2">
                                        {t('buttons.makeDonation').toUpperCase()}
                                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </span>
                                </NavLink>
                            </div>

                            {/* Language Selector */}
                            <div className="px-6 py-6 border-t border-gray-200">
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                                        className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-all duration-300"
                                    >
                                        <div className="flex items-center gap-3">
                                            <svg className="w-5 h-5 text-[#A2140F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <circle cx="12" cy="12" r="9" strokeWidth="1.7" />
                                                <path d="M3 12h18M12 3c-2.5 2.4-4 5.6-4 9s1.5 6.6 4 9c2.5-2.4 4-5.6 4-9s-1.5-6.6-4-9z" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            <span className="text-gray-900 font-semibold">
                                                {currentLanguage === 'ar' ? 'العربية' : currentLanguage === 'en' ? 'English' : 'Français'}
                                            </span>
                                        </div>
                                        <svg
                                            className={`w-5 h-5 text-gray-700 transition-transform duration-200 ${isLanguageMenuOpen ? 'rotate-180' : ''}`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {/* Language Dropdown */}
                                    {isLanguageMenuOpen && (
                                        <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50">
                                            <button
                                                onClick={() => { changeLanguage('fr'); setIsLanguageMenuOpen(false); }}
                                                className={`block w-full text-left px-4 py-3 text-gray-900 hover:bg-gray-50 transition-colors ${
                                                    currentLanguage === 'fr' ? 'bg-[#A2140F]/10 font-semibold text-[#A2140F]' : ''
                                                }`}
                                            >
                                                Français
                                            </button>
                                            <button
                                                onClick={() => { changeLanguage('ar'); setIsLanguageMenuOpen(false); }}
                                                className={`block w-full text-left px-4 py-3 text-gray-900 hover:bg-gray-50 transition-colors ${
                                                    currentLanguage === 'ar' ? 'bg-[#A2140F]/10 font-semibold text-[#A2140F]' : ''
                                                }`}
                                            >
                                                العربية
                                            </button>
                                            <button
                                                onClick={() => { changeLanguage('en'); setIsLanguageMenuOpen(false); }}
                                                className={`block w-full text-left px-4 py-3 text-gray-900 hover:bg-gray-50 transition-colors ${
                                                    currentLanguage === 'en' ? 'bg-[#A2140F]/10 font-semibold text-[#A2140F]' : ''
                                                }`}
                                            >
                                                English
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )}
        </>
    );
}

export default Header;

