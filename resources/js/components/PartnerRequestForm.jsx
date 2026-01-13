import React from 'react';
import { useTranslation } from 'react-i18next';

function PartnerRequestForm() {
    const { t } = useTranslation(['common', 'partners']);
    
    return (
        <section id="partner-form" className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50 scroll-mt-24">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-[#204F01] mb-6">
                        {t('partners:requestForm.title')}
                    </h2>
                    <div className="w-32 h-1.5 bg-gradient-to-r from-[#A2140F] to-[#204F01] mx-auto rounded-full mb-6" />
                    <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
                        {t('partners:requestForm.description')}
                    </p>
                </div>

                <div className="flex justify-center">
                    <a
                        href="https://mail.google.com/mail/?view=cm&to=contact.aiais@gmail.com&su=Demande%20de%20partenariat%20-%20Site%20AIAIS"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center justify-center px-12 py-6 md:px-16 md:py-8 rounded-2xl bg-gradient-to-r from-[#A2140F] to-[#c91a14] text-white text-xl md:text-2xl font-bold shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
                    >
                        <svg
                            className="w-8 h-8 md:w-10 md:h-10 mr-4 group-hover:scale-110 transition-transform duration-300"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>
                        </svg>
                        {t('partners:requestForm.contactButton')}
                    </a>
                </div>
            </div>
        </section>
    );
}

export default PartnerRequestForm;
