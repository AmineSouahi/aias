import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

// Fonction pour mettre à jour la direction du document
const updateDocumentDirection = (language) => {
  if (typeof document !== 'undefined') {
    const html = document.documentElement;
    if (language === 'ar') {
      html.setAttribute('dir', 'rtl');
      html.setAttribute('lang', 'ar');
    } else {
      html.setAttribute('dir', 'ltr');
      html.setAttribute('lang', language || 'fr');
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(Backend)
  .use(initReactI18next)
  .init({
    fallbackLng: {
      'ar': ['fr', 'en'],
      'fr': ['en'],
      'en': ['en'],
      default: ['fr'],
    },
    
    lng: typeof window !== 'undefined' ? (localStorage.getItem('i18nextLng') || 'fr') : 'fr',
    
    debug: false,
    
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
      requestOptions: {
        cache: 'default',
      },
    },
    
    ns: ['common', 'home', 'about', 'whatWeDo', 'contact', 'news', 'partners', 'donation'],
    defaultNS: 'common',
    
    preload: ['common', 'whatWeDo'],
    
    interpolation: {
      escapeValue: false,
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage'],
    },
    
    react: {
      useSuspense: false,
    },
    
    partialBundledLanguages: true,
  });

// Mettre à jour la direction au chargement initial
if (typeof window !== 'undefined') {
  updateDocumentDirection(i18n.language);
  
  // Écouter les changements de langue
  i18n.on('languageChanged', (lng) => {
    updateDocumentDirection(lng);
  });
}

export default i18n;

