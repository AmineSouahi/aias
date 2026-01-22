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
            // Afficher si on a scrollé plus de 300px ET qu'on n'est pas en haut
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
        // Masquer le bouton immédiatement après le clic
        setIsVisible(false);
    };

    return (
        <>
            {/* Bouton masqué - non affiché */}
        </>
    );
}

export default ScrollToTop;

