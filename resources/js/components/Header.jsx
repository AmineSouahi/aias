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
    const [logoError, setLogoError] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    
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

    // Vérifier si le logo existe au chargement
    useEffect(() => {
        const img = new Image();
        img.onerror = () => setLogoError(true);
        img.src = '/images/aiais.png    ';
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

    const menuItems = [
        { label: 'Qui nous sommes', href: '#l' },
        { label: 'Ce que nous faisons', href: '#what-we-do' },
        { label: 'Nous soutenir', href: '#support' },
        { label: 'Actualités', href: '#news' },
    ];

    return (
        <>
            {/* Top Bar - Barre supérieure avec contacts et langue */}
            <div className={`fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#A2140F] via-[#c91a14] to-[#A2140F] text-white navbar-slow-motion shadow-lg ${
                !isNavbarVisible ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'
            }`}>
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between py-2.5 text-sm">
                        {/* Informations de contact à gauche */}
                        <div className="hidden md:flex items-center space-x-6">
                            <a 
                                href={`tel:${t('footer.phone')}`} 
                                className="flex items-center space-x-2 hover:opacity-90 transition-all duration-300 group"
                            >
                                <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors backdrop-blur-sm">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </div>
                                <span className="font-medium">{t('footer.phone')}</span>
                            </a>
                            <a 
                                href={`mailto:${t('footer.email')}`} 
                                className="flex items-center space-x-2 hover:opacity-90 transition-all duration-300 group"
                            >
                                <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors backdrop-blur-sm">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <span className="font-medium">{t('footer.email')}</span>
                            </a>
                            <div className="flex items-center space-x-2">
                                <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <span className="font-medium text-xs">{t('footer.address')}, {t('footer.addressLine2')}</span>
                            </div>
                        </div>

                        {/* Version mobile - contacts réduits */}
                        <div className="md:hidden flex items-center space-x-3 text-xs">
                            <a href={`tel:${t('footer.phone')}`} className="flex items-center space-x-1 hover:opacity-90 transition-opacity p-1.5 rounded-lg hover:bg-white/10">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </a>
                            <a href={`mailto:${t('footer.email')}`} className="flex items-center space-x-1 hover:opacity-90 transition-opacity p-1.5 rounded-lg hover:bg-white/10">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </a>
                        </div>

                        {/* Langue et utilisateur à droite */}
                        <div className="flex items-center space-x-3">
                            {/* Sélecteur de langue */}
                            <div className="flex items-center space-x-0.5 bg-white/10 backdrop-blur-sm rounded-lg p-0.5 border border-white/20">
                                <button
                                    onClick={() => changeLanguage('fr')}
                                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-300 ${
                                        currentLanguage === 'fr' 
                                            ? 'bg-white text-[#A2140F] shadow-md' 
                                            : 'text-white/80 hover:text-white hover:bg-white/10'
                                    }`}
                                >
                                    FR
                                </button>
                                <button
                                    onClick={() => changeLanguage('ar')}
                                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-300 ${
                                        currentLanguage === 'ar' 
                                            ? 'bg-white text-[#A2140F] shadow-md' 
                                            : 'text-white/80 hover:text-white hover:bg-white/10'
                                    }`}
                                >
                                    AR
                                </button>
                                <button
                                    onClick={() => changeLanguage('en')}
                                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-300 ${
                                        currentLanguage === 'en' 
                                            ? 'bg-white text-[#A2140F] shadow-md' 
                                            : 'text-white/80 hover:text-white hover:bg-white/10'
                                    }`}
                                >
                                    EN
                                </button>
                            </div>

                            {/* Liens utilisateur */}
                            <div className="hidden md:flex items-center">
                                <Link 
                                    to="/login" 
                                    className="flex items-center space-x-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300 backdrop-blur-sm border border-white/20 group"
                                >
                                    <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Ligne de séparation avec gradient */}
                <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
            </div>

            {/* Header principal - Navigation */}
            <header
                className={`fixed left-0 right-0 z-40 navbar-slow-motion transition-all duration-300 ${
                    !isNavbarVisible
                        ? '-translate-y-full opacity-0'
                        : 'translate-y-0 opacity-100'
                } ${
                    isScrolled
                        ? 'top-[48px] bg-white/98 backdrop-blur-lg shadow-lg border-b border-gray-100'
                        : 'top-[48px] bg-white/95 backdrop-blur-md shadow-sm'
                }`}
            >
            <nav className="container mx-auto px-4 py-3 md:py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-3 group">
                        {logoError ? (
                            // Fallback : affiche un carré avec initiale si le logo n'existe pas
                            <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-[#A2140F] to-[#c91a14] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                                <span className="text-white font-bold text-xl md:text-2xl">A</span>
                            </div>
                        ) : (
                            <div className="relative">
                                <img
                                    src="/images/aiais.png"
                                    alt="Association Initiative Al Amal Pour l'Intégration Sociale"
                                    className="h-14 md:h-16 lg:h-18 w-auto object-contain max-w-[200px] md:max-w-[250px] transition-transform duration-300 group-hover:scale-105"
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

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
                        <NavLink
                            to="/qui-nous-sommes"
                            className={({ isActive }) =>
                                `relative text-gray-700 font-semibold px-4 py-2 rounded-lg transition-all duration-300 group ${
                                    isActive 
                                        ? 'text-[#A2140F] bg-[#A2140F]/10' 
                                        : 'hover:text-[#A2140F] hover:bg-gray-50'
                                }`
                            }
                        >
                            <span className="relative z-10">{t('nav.about')}</span>
                            <span className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#A2140F] to-[#c91a14] rounded-full transition-opacity duration-300 ${
                                location.pathname === '/qui-nous-sommes' ? 'opacity-100' : 'opacity-0 group-hover:opacity-30'
                            }`}></span>
                        </NavLink>
                        <NavLink
                            to="/ce-que-nous-faisons"
                            className={({ isActive }) =>
                                `relative text-gray-700 font-semibold px-4 py-2 rounded-lg transition-all duration-300 group ${
                                    isActive 
                                        ? 'text-[#A2140F] bg-[#A2140F]/10' 
                                        : 'hover:text-[#A2140F] hover:bg-gray-50'
                                }`
                            }
                        >
                            <span className="relative z-10">{t('nav.whatWeDo')}</span>
                            <span className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#A2140F] to-[#c91a14] rounded-full transition-opacity duration-300 ${
                                location.pathname === '/ce-que-nous-faisons' ? 'opacity-100' : 'opacity-0 group-hover:opacity-30'
                            }`}></span>
                        </NavLink>
                        <NavLink
                            to="/nous-soutenir"
                            className={({ isActive }) =>
                                `relative text-gray-700 font-semibold px-4 py-2 rounded-lg transition-all duration-300 group ${
                                    isActive 
                                        ? 'text-[#A2140F] bg-[#A2140F]/10' 
                                        : 'hover:text-[#A2140F] hover:bg-gray-50'
                                }`
                            }
                        >
                            <span className="relative z-10">{t('nav.support')}</span>
                            <span className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#A2140F] to-[#c91a14] rounded-full transition-opacity duration-300 ${
                                location.pathname === '/nous-soutenir' ? 'opacity-100' : 'opacity-0 group-hover:opacity-30'
                            }`}></span>
                        </NavLink>
                        <NavLink
                            to="/news"
                            className={({ isActive }) =>
                                `relative text-gray-700 font-semibold px-4 py-2 rounded-lg transition-all duration-300 group ${
                                    isActive 
                                        ? 'text-[#A2140F] bg-[#A2140F]/10' 
                                        : 'hover:text-[#A2140F] hover:bg-gray-50'
                                }`
                            }
                        >
                            <span className="relative z-10">{t('nav.news')}</span>
                            <span className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#A2140F] to-[#c91a14] rounded-full transition-opacity duration-300 ${
                                location.pathname === '/news' ? 'opacity-100' : 'opacity-0 group-hover:opacity-30'
                            }`}></span>
                        </NavLink>
                        <NavLink
                            to="/partenaires"
                            className={({ isActive }) =>
                                `relative text-gray-700 font-semibold px-4 py-2 rounded-lg transition-all duration-300 group ${
                                    isActive 
                                        ? 'text-[#A2140F] bg-[#A2140F]/10' 
                                        : 'hover:text-[#A2140F] hover:bg-gray-50'
                                }`
                            }
                        >
                            <span className="relative z-10">{t('nav.partners')}</span>
                            <span className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#A2140F] to-[#c91a14] rounded-full transition-opacity duration-300 ${
                                location.pathname === '/partenaires' ? 'opacity-100' : 'opacity-0 group-hover:opacity-30'
                            }`}></span>
                        </NavLink>
                        <NavLink
                            to="/don"
                            className="ml-2 bg-gradient-to-r from-[#A2140F] to-[#c91a14] text-white px-6 py-2.5 rounded-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-bold text-sm relative overflow-hidden group"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                {t('buttons.makeDonation').toUpperCase()}
                                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-[#c91a14] to-[#A2140F] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </NavLink>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="lg:hidden relative w-10 h-10 flex items-center justify-center text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-300 group"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
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

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden mt-4 pb-4 space-y-1 animate-fade-in border-t border-gray-200 pt-4">
                        <NavLink
                            to="/qui-nous-sommes"
                            className={({ isActive }) =>
                                `block text-gray-700 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                                    isActive 
                                        ? 'text-[#A2140F] bg-[#A2140F]/10 border-l-4 border-[#A2140F]' 
                                        : 'hover:text-[#A2140F] hover:bg-gray-50'
                                }`
                            }
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {t('nav.about')}
                        </NavLink>
                        <NavLink
                            to="/ce-que-nous-faisons"
                            className={({ isActive }) =>
                                `block text-gray-700 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                                    isActive 
                                        ? 'text-[#A2140F] bg-[#A2140F]/10 border-l-4 border-[#A2140F]' 
                                        : 'hover:text-[#A2140F] hover:bg-gray-50'
                                }`
                            }
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {t('nav.whatWeDo')}
                        </NavLink>
                        <NavLink
                            to="/nous-soutenir"
                            className={({ isActive }) =>
                                `block text-gray-700 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                                    isActive 
                                        ? 'text-[#A2140F] bg-[#A2140F]/10 border-l-4 border-[#A2140F]' 
                                        : 'hover:text-[#A2140F] hover:bg-gray-50'
                                }`
                            }
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {t('nav.support')}
                        </NavLink>
                        <NavLink
                            to="/news"
                            className={({ isActive }) =>
                                `block text-gray-700 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                                    isActive 
                                        ? 'text-[#A2140F] bg-[#A2140F]/10 border-l-4 border-[#A2140F]' 
                                        : 'hover:text-[#A2140F] hover:bg-gray-50'
                                }`
                            }
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {t('nav.news')}
                        </NavLink>
                        <NavLink
                            to="/partenaires"
                            className={({ isActive }) =>
                                `block text-gray-700 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                                    isActive 
                                        ? 'text-[#A2140F] bg-[#A2140F]/10 border-l-4 border-[#A2140F]' 
                                        : 'hover:text-[#A2140F] hover:bg-gray-50'
                                }`
                            }
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {t('nav.partners')}
                        </NavLink>
                        <NavLink
                            to="/don"
                            className="block bg-gradient-to-r from-[#A2140F] to-[#c91a14] text-white px-6 py-3 rounded-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 font-bold text-center mt-4"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <span className="flex items-center justify-center gap-2">
                                {t('buttons.makeDonation').toUpperCase()}
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </span>
                        </NavLink>
                    </div>
                )}
            </nav>
        </header>
        </>
    );
}

export default Header;

