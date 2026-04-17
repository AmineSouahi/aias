import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import Impacts from './Impacts';

function PresidentMessageSection() {
    const { t } = useTranslation('about');
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                    }
                });
            },
            { threshold: 0.2 }
        );

        const element = document.querySelector('[data-president-section]');
        if (element) {
            observer.observe(element);
        }

        return () => {
            if (element) {
                observer.unobserve(element);
            }
        };
    }, []);

    return (
        <section
            data-president-section
            className="py-20 bg-gradient-to-br from-white via-gray-50 to-white relative overflow-hidden"
        >
            {/* Background decorative elements */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-20 right-10 w-72 h-72 bg-[#A2140F] rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#204F01] rounded-full blur-3xl"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-6xl mx-auto">
                    {/* Title */}
                    <div
                        className="text-center mb-12"
                        style={{
                            transition: 'all 0.8s ease-out',
                            transform: isVisible ? 'translateY(0)' : 'translateY(-30px)',
                            opacity: isVisible ? 1 : 0,
                        }}
                    >
                            <h2 className="text-4xl md:text-5xl font-bold text-[#204F01] mb-4">
                                {t('presidentMessage.title')}
                            </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-[#A2140F] to-[#204F01] mx-auto rounded-full"></div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
                        {/* Image */}
                        <div
                            className="order-1 md:order-2"
                            style={{
                                transition: 'all 0.8s ease-out',
                                transitionDelay: '0.2s',
                                transform: isVisible ? 'translateX(0) scale(1)' : 'translateX(50px) scale(0.95)',
                                opacity: isVisible ? 1 : 0,
                            }}
                        >
                            <div className="relative group">
                                <div className="absolute -inset-4 bg-gradient-to-r from-[#A2140F] to-[#204F01] rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                                <div className="relative bg-white rounded-2xl p-4 shadow-2xl transform group-hover:scale-105 transition-transform duration-300">
                                    <div className="relative overflow-hidden rounded-xl">
                                            <img
                                                src="/images/president1.webp"
                                                alt={t('presidentMessage.portrait')}
                                                className="w-full h-auto rounded-xl object-cover transform group-hover:scale-110 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        </div>
                                        <p className="text-center text-gray-600 mt-4 font-medium text-sm">
                                            {t('presidentMessage.portrait')}
                                        </p>
                                </div>
                            </div>
                        </div>

                        {/* Message */}
                        <div
                            className="order-2 md:order-1"
                            style={{
                                transition: 'all 0.8s ease-out',
                                transitionDelay: '0.1s',
                                transform: isVisible ? 'translateX(0)' : 'translateX(-50px)',
                                opacity: isVisible ? 1 : 0,
                            }}
                        >
                            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border-l-4 border-[#A2140F] relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
                                {/* Decorative quote icon */}
                                <div className="absolute top-6 right-6 opacity-10">
                                    <svg
                                        className="w-24 h-24 text-[#A2140F]"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.996 2.151c-2.481.967-4.996 2.848-4.996 7.153 0 3.813 2.819 5.885 5.017 7.197v4.699h-9.999zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.482.967-5.996 2.848-5.996 7.153 0 3.813 2.819 5.885 5.017 7.197v4.699h-10z" />
                                    </svg>
                                </div>

                                    <div className="relative z-10">
                                        <p className="text-gray-800 leading-relaxed mb-6 text-lg font-medium">
                                            {t('presidentMessage.greeting')}
                                        </p>
                                        <p className="text-gray-700 leading-relaxed mb-5">
                                            {t('presidentMessage.paragraph1')}
                                        </p>
                                        <p className="text-gray-700 leading-relaxed mb-5">
                                            {t('presidentMessage.paragraph2')}
                                        </p>
                                        <p className="text-gray-700 leading-relaxed mb-5">
                                            {t('presidentMessage.paragraph3')}
                                        </p>
                                        <div className="mt-8 pt-6 border-t-2 border-gray-100">
                                            <p className="text-gray-600 mb-2 italic">
                                                {t('presidentMessage.closing')}
                                            </p>
                                            <p className="text-[#A2140F] font-bold text-xl">
                                                {t('presidentMessage.signature')}
                                            </p>
                                            <p className="text-gray-500 text-sm mt-1">
                                                {t('presidentMessage.position')}
                                            </p>
                                        </div>
                                    </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function HistorySection() {
    const { t } = useTranslation('about');
    const [visibleItems, setVisibleItems] = useState(new Set());

    const historyItems = [
        {
            year: '2018',
            title: t('about:history.items.2018.title'),
            description: t('about:history.items.2018.description'),
            color: '#A2140F',
            icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
            ),
        },
        {
            year: '2019',
            title: t('about:history.items.2019.title'),
            description: t('about:history.items.2019.description'),
            color: '#204F01',
            icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
            ),
        },
        {
            year: '2020',
            title: t('about:history.items.2020.title'),
            description: t('about:history.items.2020.description'),
            color: '#A2140F',
            icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
            ),
        },
        {
            year: '2021',
            title: t('about:history.items.2021.title'),
            description: t('about:history.items.2021.description'),
            color: '#204F01',
            icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
                </svg>
            ),
        },
        {
            year: '2022',
            title: t('about:history.items.2022.title'),
            description: t('about:history.items.2022.description'),
            color: '#A2140F',
            icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
            ),
        },
        {
            year: '2023',
            title: t('about:history.items.2023.title'),
            description: t('about:history.items.2023.description'),
            color: '#204F01',
            icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
            ),
        },
        {
            year: '2024',
            title: t('about:history.items.2024.title'),
            description: t('about:history.items.2024.description'),
            color: '#A2140F',
            icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
            ),
        },
        {
            year: '2025',
            title: t('about:history.items.2025.title'),
            description: t('about:history.items.2025.description'),
            color: '#204F01',
            icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
            ),
        },
    ];

    useEffect(() => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px',
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setVisibleItems((prev) => new Set([...prev, entry.target.dataset.index]));
                }
            });
        }, observerOptions);

        const elements = document.querySelectorAll('[data-history-item]');
        elements.forEach((el) => observer.observe(el));

        return () => {
            elements.forEach((el) => observer.unobserve(el));
        };
    }, []);

    return (
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#A2140F] rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#204F01] rounded-full blur-3xl"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-[#204F01] mb-4 animate-fadeIn">
                        {t('about:history.title')}
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-[#A2140F] to-[#204F01] mx-auto rounded-full"></div>
                </div>

                <div className="max-w-5xl mx-auto relative">
                    {/* Timeline line */}
                    <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-[#A2140F] via-[#204F01] to-[#A2140F] transform md:-translate-x-1/2 opacity-20"></div>

                    <div className="space-y-12">
                        {historyItems.map((item, index) => {
                            const isVisible = visibleItems.has(String(index));
                            const isEven = index % 2 === 0;

                            return (
                                <div
                                    key={index}
                                    data-history-item
                                    data-index={index}
                                    className={`relative flex items-center ${
                                        isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                                    }`}
                                >
                                    {/* Timeline dot */}
                                    <div
                                        className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 z-10"
                                        style={{ transition: 'all 0.6s ease-out', transitionDelay: `${index * 0.1}s` }}
                                    >
                                        <div
                                            className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transform transition-all duration-700 ${
                                                isVisible
                                                    ? 'scale-100 opacity-100'
                                                    : 'scale-0 opacity-0'
                                            }`}
                                            style={{
                                                backgroundColor: item.color,
                                                color: 'white',
                                            }}
                                        >
                                            {item.icon}
                                        </div>
                                    </div>

                                    {/* Content card */}
                                    <div
                                        className={`w-full md:w-5/12 ml-20 md:ml-0 ${
                                            isEven ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'
                                        }`}
                                        style={{
                                            transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                                            transitionDelay: `${index * 0.15}s`,
                                            transform: isVisible
                                                ? 'translateX(0) translateY(0)'
                                                : isEven
                                                ? 'translateX(-50px) translateY(20px)'
                                                : 'translateX(50px) translateY(20px)',
                                            opacity: isVisible ? 1 : 0,
                                        }}
                                    >
                                        <div
                                            className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border-t-4 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                                            style={{ borderTopColor: item.color }}
                                        >
                                            <div className="flex items-center gap-3 mb-4">
                                                <span
                                                    className="text-3xl font-bold"
                                                    style={{ color: item.color }}
                                                >
                                                    {item.year}
                                                </span>
                                                <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                                                    {item.title}
                                                </span>
                                            </div>
                                            <p className="text-gray-700 leading-relaxed text-base">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}

function ExecutiveMembersSection() {
    const { t } = useTranslation('about');
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await axios.get('/executive-members');
                const data = response.data?.data || [];
                setMembers(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error fetching executive members:', error);
                setMembers([]);
            } finally {
                setLoading(false);
            }
        };

        fetchMembers();
    }, []);

    if (loading) {
        return (
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#204F01] mb-12 text-center">
                        {t('about:executiveMembers.title')}
                    </h2>
                    <div className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#A2140F]"></div>
                        <p className="mt-4 text-gray-600">{t('about:executiveMembers.loading')}</p>
                    </div>
                </div>
            </section>
        );
    }

    if (members.length === 0) {
        return null;
    }

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-[#204F01] mb-12 text-center">
                    {t('about:executiveMembers.title')}
                </h2>
                <div className={`${
                    members.length === 1 
                        ? 'flex justify-center' 
                        : 'grid md:grid-cols-2 lg:grid-cols-3'
                } gap-8 max-w-6xl mx-auto`}>
                    {members.map((member) => (
                        <div
                            key={member.id}
                            className={`bg-white rounded-lg shadow-md p-6 text-center border border-gray-200 ${
                                members.length === 1 ? 'w-full max-w-sm' : ''
                            }`}
                        >
                            <div className="w-32 h-32 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                                {member.photo ? (
                                    <img
                                        src={member.photo}
                                        alt={member.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-4xl font-bold text-gray-400">
                                        {member.name
                                            .split(' ')
                                            .map((n) => n[0])
                                            .join('')
                                            .toUpperCase()
                                            .slice(0, 2)}
                                    </span>
                                )}
                            </div>
                            <h3 className="text-xl font-bold text-[#A2140F] mb-2">
                                {member.name}
                            </h3>
                            <p className="text-gray-600 font-medium">{member.position}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function About() {
    const { t } = useTranslation(['common', 'about']);
    return (
        <>
            {/* Hero Section avec image d'équipe */}
            <section id="about" className="relative h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden">
                <div className="relative h-full">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: `url(/images/equipe.jpeg)`,
                        }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-[#A2140F]/95 via-[#A2140F]/85 to-[#204F01]/85" />
                    </div>
                    <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
                        <div className="max-w-2xl text-white animate-fade-in">
                            <p className="mb-2 md:mb-3 text-sm sm:text-base md:text-lg lg:text-xl font-medium text-white/90">
                                {t('about:hero.associationName')}
                            </p>
                            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-3 md:mb-4 drop-shadow-lg leading-tight">
                                {t('about:hero.title')}
                            </h2>
                            <p className="text-base sm:text-lg md:text-xl mb-2 md:mb-3 text-white/95 leading-relaxed">
                                {t('about:hero.description1')}
                            </p>
                            <p className="text-xs sm:text-sm md:text-base mb-6 md:mb-8 text-white/80 max-w-xl">
                                {t('about:hero.description2')}
                            </p>
                            <div className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4">
                                <Link
                                    to="/ce-que-nous-faisons"
                                    className="inline-block bg-white text-[#A2140F] px-6 md:px-8 py-2.5 md:py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm md:text-base text-center"
                                >
                                    {t('about:hero.discoverActions')}
                                </Link>
                                <Link
                                    to="/don"
                                    className="inline-block bg-transparent border-2 border-white/80 text-white px-6 md:px-8 py-2.5 md:py-3 rounded-lg font-semibold hover:bg-white hover:text-[#A2140F] transition-colors text-sm md:text-base text-center"
                                >
                                    {t('about:hero.makeDonation')}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section Description complète */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold text-[#204F01] mb-6 text-center">
                            {t('about:fullDescription.title')}
                        </h2>
                        <p className="text-lg text-gray-700 leading-relaxed mb-8 text-center">
                            {t('about:fullDescription.description')}
                        </p>
                    </div>
                </div>
            </section>

            {/* Section Certains de nos impacts */}
            <Impacts />

            {/* Section Mot de Président */}
            <PresidentMessageSection />

            {/* Section Notre Histoire */}
            <HistorySection />

            {/* Section Bureau Exécutif */}
            <ExecutiveMembersSection />

            {/* Section Call to Action */}
            <section className="py-16 bg-gradient-to-r from-[#A2140F] to-[#204F01] text-white">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">
                            {t('about:cta.title')}
                        </h2>
                        <p className="text-xl mb-8 max-w-2xl mx-auto">
                            {t('about:cta.description')}
                        </p>
                        <Link
                            to="/nous-soutenir"
                            className="inline-block bg-white text-[#A2140F] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                        >
                            {t('about:cta.supportUs')}
                        </Link>
                    </div>
            </section>
        </>
    );
}

export default About;
