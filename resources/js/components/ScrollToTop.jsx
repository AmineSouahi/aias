import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false);
    const location = useLocation();

    // Scroll automatique vers le haut à chaque changement de route
    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant', // Comportement instantané pour un scroll immédiat
        });
    }, [location.pathname]);

    // Afficher le bouton de retour en haut après scroll
    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <>
            {isVisible && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 z-40 bg-[#A2140F] text-white p-3 rounded-full shadow-lg hover:bg-[#c91a14] transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#A2140F] focus:ring-offset-2"
                    aria-label="Retour en haut"
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 10l7-7m0 0l7 7m-7-7v18"
                        />
                    </svg>
                </button>
            )}
        </>
    );
}

export default ScrollToTop;

