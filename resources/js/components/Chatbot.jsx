import React, { useState, useRef, useEffect } from 'react';
import { LuBotMessageSquare } from "react-icons/lu";

function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Bonjour ! 👋 Je suis l'assistant virtuel de l'Association Initiative Al Amal. Je peux répondre à vos questions sur notre association, nos programmes, nos activités et nos services. Comment puis-je vous aider ?",
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const getBotResponse = (userMessage) => {
        const message = userMessage.toLowerCase().trim();
        
        // Salutations
        if (message.includes('bonjour') || message.includes('salut') || message.includes('hello') || message.includes('bonsoir')) {
            return "Bonjour ! Je suis là pour répondre à vos questions sur l'Association Initiative Al Amal. Que souhaitez-vous savoir ?";
        }
        
        // Informations sur l'association
        if (message.includes('association') || message.includes('qui êtes-vous') || message.includes('qui êtes vous') || message.includes('présentation') || message.includes('présentez')) {
            return "L'Association Initiative Al Amal pour l'Intégration Sociale a été créée en 2018 sous la présidence de M. Hani EL HARRAQ. Nous aidons les jeunes en situation précaire, notamment les anciens pensionnaires des établissements de protection sociale (EPS), à s'intégrer socio-économiquement. Nous proposons des formations professionnelles, du développement personnel, un accompagnement scolaire, et nous militons pour des politiques inclusives en faveur de ces jeunes afin de construire une société plus équitable.";
        }
        
        // Mission et objectifs
        if (message.includes('mission') || message.includes('objectif') || message.includes('but') || message.includes('vocation')) {
            return "Notre mission est d'accompagner et d'encadrer les jeunes en situation précaire pour leur permettre de s'intégrer socialement et économiquement. Nous œuvrons pour offrir une deuxième chance à ces jeunes et construire une société plus équitable. Notre engagement en faveur de la dignité, du droit à la deuxième chance et de la protection sociale demeure au cœur de notre action. Nous sommes reconnus nationalement comme un acteur majeur dans le domaine de la protection sociale et de l'insertion professionnelle.";
        }
        
        // Programme Forsa w Taahil - Détails complets
        if (message.includes('programme') || message.includes('forsa') || message.includes('taahil') || message.includes('forsa w taahil') || message.includes('forsa wa taahil')) {
            return "Le programme 'Forsa w Taahil' est notre programme phare lancé en 2021. Il constitue un tournant stratégique pour l'association. Ce programme est dédié à la formation, à la qualification et à l'insertion socio-professionnelle des jeunes. Il offre des parcours d'accompagnement personnalisés, renforce l'employabilité des bénéficiaires et facilite l'accès aux bourses d'études et à l'enseignement supérieur. Depuis son lancement, le programme a permis de structurer des parcours d'accompagnement personnalisés et d'ouvrir la voie à des partenariats éducatifs durables.";
        }
        
        // Bourses et formations - Détails
        if (message.includes('bourse') || message.includes('bourses') || message.includes('formation') || message.includes('formations') || message.includes('étudier') || message.includes('études')) {
            return "Nous proposons des bourses d'études et des formations professionnelles qualifiantes. Depuis 2022, nous avons développé des partenariats avec des écoles et des instituts d'enseignement supérieur qui permettent l'octroi de bourses d'études. Ces bourses facilitent l'accès à la formation qualifiante et à l'enseignement supérieur. Nous assurons également un suivi académique, social et personnel des bénéficiaires. Pour plus d'informations sur les critères d'éligibilité et les modalités d'inscription, contactez-nous via le formulaire sur la page 'Nous Soutenir'.";
        }
        
        // Partenaires - Détails
        if (message.includes('partenaires') || message.includes('partenariat') || message.includes('collaboration')) {
            return "Nous travaillons avec de nombreux partenaires locaux et internationaux, notamment des écoles, des instituts d'enseignement supérieur, des entreprises et des organisations. Depuis 2019, nous avons renforcé notre réseau de partenaires locaux. En 2022, nous avons consolidé nos partenariats éducatifs qui permettent l'octroi de bourses. Ces collaborations sont essentielles pour élargir nos programmes et renforcer notre impact. Consultez notre page 'Partenaires' pour découvrir nos collaborations.";
        }
        
        // Activités et actions - Détails
        if (message.includes('activité') || message.includes('action') || message.includes('projet') || message.includes('faire') || message.includes('que faites-vous') || message.includes('services')) {
            return "Nos principales activités incluent : l'accompagnement social, moral et éducatif des jeunes, les formations professionnelles qualifiantes, l'octroi de bourses d'études, le suivi académique et personnel des bénéficiaires, l'organisation d'activités de soutien, d'orientation et de sensibilisation, et la valorisation des parcours de réussite. Nous intervenons principalement au profit des jeunes issus des établissements de protection sociale (EPS), avec une approche de proximité visant à maintenir le lien et prévenir le décrochage.";
        }
        
        // Historique détaillé par année
        if (message.includes('2018') || (message.includes('histoire') && message.includes('2018'))) {
            return "2018 marque la création officielle de l'association. Cette première année a été consacrée à la mise en place du cadre juridique, administratif et organisationnel, ainsi qu'à l'identification des besoins prioritaires des jeunes en situation de vulnérabilité. Les premières actions sociales et éducatives ont permis de poser les bases du projet associatif.";
        }
        if (message.includes('2019') || (message.includes('histoire') && message.includes('2019'))) {
            return "En 2019, l'association a élargi ses interventions à travers des actions d'accompagnement social et éducatif. Des activités de soutien, d'orientation et de sensibilisation ont été mises en œuvre, parallèlement au renforcement du réseau de partenaires locaux, consolidant ainsi la présence de l'association sur le terrain.";
        }
        if (message.includes('2020') || (message.includes('histoire') && message.includes('2020'))) {
            return "Malgré un contexte social contraignant, 2020 a été marquée par la continuité des actions essentielles. L'accent a été mis sur l'accompagnement social, moral et éducatif des jeunes, avec une approche de proximité visant à maintenir le lien, prévenir le décrochage et répondre aux situations urgentes.";
        }
        if (message.includes('2021') || (message.includes('histoire') && message.includes('2021'))) {
            return "2021 constitue un tournant stratégique avec le lancement du programme Forsa w Taahil, dédié à la formation, qualification et insertion socio-professionnelle. Ce programme a permis de structurer des parcours d'accompagnement personnalisés et de renforcer l'employabilité des bénéficiaires.";
        }
        if (message.includes('2022') || (message.includes('histoire') && message.includes('2022'))) {
            return "En 2022, l'association a consolidé le programme Forsa w Taahil à travers le développement de partenariats avec des écoles et instituts d'enseignement supérieur. Ces collaborations ont permis l'octroi de bourses d'études, facilitant l'accès à la formation qualifiante et à l'enseignement supérieur.";
        }
        if (message.includes('2023') || (message.includes('histoire') && message.includes('2023'))) {
            return "2023 a été consacrée au suivi académique, social et personnel des jeunes bénéficiaires des bourses et formations. L'association a également mis en valeur les parcours de réussite, renforçant la motivation des jeunes et la crédibilité de ses programmes auprès des partenaires institutionnels et éducatifs.";
        }
        if (message.includes('2024') || (message.includes('histoire') && message.includes('2024'))) {
            return "En 2024, l'association a poursuivi le renforcement de ses actions d'intégration sociale à travers l'élargissement de ses programmes et la consolidation de ses partenariats. La participation à des événements institutionnels et sociaux a contribué à accroître la visibilité et le rayonnement de l'association à l'échelle locale et nationale.";
        }
        if (message.includes('2025') || (message.includes('histoire') && message.includes('2025'))) {
            return "2025 marque une phase de maturité pour l'association. Les efforts ont été orientés vers l'évaluation de l'impact global des actions menées depuis 2018, notamment du programme Forsa w Taahil et des dispositifs de bourses. Cette année a également permis de définir de nouvelles orientations stratégiques pour assurer la durabilité et l'extension des projets.";
        }
        if (message.includes('histoire') || message.includes('historique') || message.includes('création') || message.includes('fondée') || message.includes('depuis')) {
            return "L'association a été créée en 2018 sous la présidence de M. Hani EL HARRAQ. Depuis sa création, nous avons : développé nos programmes (lancement de Forsa w Taahil en 2021), consolidé nos partenariats éducatifs, octroyé des bourses d'études, et renforcé notre impact à l'échelle locale et nationale. Consultez la page 'Qui nous sommes' pour découvrir notre histoire complète année par année.";
        }
        
        // Président
        if (message.includes('président') || message.includes('hani') || message.includes('el harraq') || message.includes('harraq')) {
            return "M. Hani EL HARRAQ est le Président de l'Association Initiative Al Amal pour l'Intégration Sociale depuis sa création en 2018. Sous sa présidence, l'association est devenue un acteur majeur dans le domaine de la protection sociale et de l'insertion professionnelle des jeunes à travers tout le royaume.";
        }
        
        // Dons et soutien
        if (message.includes('don') || message.includes('donation') || message.includes('soutenir') || message.includes('contribuer') || message.includes('aide financière') || message.includes('rib')) {
            return "Merci pour votre générosité ! Vous pouvez soutenir notre association de plusieurs façons : faire un don en ligne via la page 'Faire un don', ou effectuer un virement bancaire sur notre RIB (011 780 0000772000006736 41). Chaque contribution nous permet de continuer à aider les jeunes en situation précaire, financer des bourses d'études et développer nos programmes. Votre soutien fait la différence !";
        }
        
        // Contact - Détails
        if (message.includes('contact') || message.includes('email') || message.includes('téléphone') || message.includes('adresse') || message.includes('joindre') || message.includes('whatsapp')) {
            return "Pour nous contacter, vous pouvez : utiliser le formulaire de contact sur la page 'Nous Soutenir', nous appeler, nous envoyer un email, ou nous contacter via WhatsApp (0614128481). Notre équipe vous répondra dans les plus brefs délais. Vous pouvez également nous suivre sur nos réseaux sociaux (Facebook, Instagram, LinkedIn) pour rester informé de nos activités.";
        }
        
        // Bénéficiaires - Détails
        if (message.includes('bénéficiaire') || message.includes('jeune') || message.includes('qui aide') || message.includes('cible') || message.includes('orphelin') || message.includes('eps')) {
            return "Nous aidons principalement les jeunes en situation précaire, notamment les anciens pensionnaires des établissements de protection sociale (EPS). Nos programmes s'adressent aux jeunes orphelins, aux bacheliers, aux diplômés et à ceux en recherche d'insertion professionnelle. Nous ciblons différents profils de jeunes pour leur offrir un accompagnement personnalisé vers l'emploi et l'autonomie.";
        }
        
        // Impacts et résultats - Détails
        if (message.includes('impact') || message.includes('résultat') || message.includes('réussite') || message.includes('statistique') || message.includes('chiffre') || message.includes('nombre')) {
            return "Depuis notre création en 2018, nous avons accompagné de nombreux jeunes bénéficiaires, octroyé des bourses d'études, organisé des formations professionnelles et facilité des insertions professionnelles. Nous avons également valorisé les parcours de réussite et renforcé notre crédibilité auprès des partenaires institutionnels. Consultez la page 'Ce que nous faisons' pour découvrir nos impacts détaillés et réalisations chiffrées.";
        }
        
        // Éligibilité et inscription
        if (message.includes('éligibilité') || message.includes('éligible') || message.includes('inscription') || message.includes('s\'inscrire') || message.includes('candidature') || message.includes('critère')) {
            return "Pour bénéficier de nos programmes (bourses d'études, formations professionnelles), il faut être un jeune en situation précaire, notamment un ancien pensionnaire d'un établissement de protection sociale (EPS), ou être un jeune orphelin, bachelier, diplômé ou en recherche d'insertion professionnelle. Pour plus de détails sur les critères d'éligibilité et les modalités d'inscription, contactez-nous via le formulaire de contact sur la page 'Nous Soutenir'.";
        }
        
        // Suivi et accompagnement
        if (message.includes('suivi') || message.includes('accompagnement') || message.includes('accompagner') || message.includes('soutien')) {
            return "Nous offrons un accompagnement complet : social, moral, éducatif et académique. Nous assurons un suivi personnalisé des bénéficiaires des bourses et formations, avec une approche de proximité visant à maintenir le lien, prévenir le décrochage et répondre aux situations urgentes. Nous valorisons également les parcours de réussite pour renforcer la motivation des jeunes.";
        }
        
        // Remerciements
        if (message.includes('merci') || message.includes('remercier') || message.includes('gracie')) {
            return "De rien ! C'est un plaisir de vous informer sur notre association. N'hésitez pas si vous avez d'autres questions ! 😊";
        }
        
        // Au revoir
        if (message.includes('au revoir') || message.includes('bye') || message.includes('à bientôt') || message.includes('bonne journée')) {
            return "Au revoir ! Merci de votre intérêt pour notre association. À bientôt ! 👋";
        }
        
        // Réponse par défaut - redirection vers le contact
        return "Je suis spécialisé pour répondre aux questions sur l'Association Initiative Al Amal. Pour toute autre question ou demande spécifique, je vous invite à nous contacter directement via le formulaire de contact sur la page 'Nous Soutenir' ou par WhatsApp (0614128481). Notre équipe sera ravie de vous aider personnellement !";
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        
        if (!inputValue.trim()) return;

        const userMessage = {
            id: messages.length + 1,
            text: inputValue,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');

        // Simuler une réponse du bot après un court délai
        setTimeout(() => {
            const botResponse = {
                id: messages.length + 2,
                text: getBotResponse(inputValue),
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botResponse]);
        }, 500);
    };

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString('fr-FR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };

    return (
        <>
            {/* Bouton flottant */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-[#A2140F] to-[#204F01] text-white rounded-full p-4 shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center group"
                    aria-label="Ouvrir le chat"
                >
                    <LuBotMessageSquare className="w-7 h-7 group-hover:rotate-12 transition-transform" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
                </button>
            )}

            {/* Fenêtre de chat */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-6rem)] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden transform transition-all duration-300">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-[#A2140F] to-[#204F01] text-white p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
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
                                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                    />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Assistant Virtuel</h3>
                                <p className="text-xs text-white/80">En ligne</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white hover:text-gray-200 transition-colors p-1"
                            aria-label="Fermer le chat"
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
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                                        message.sender === 'user'
                                            ? 'bg-gradient-to-r from-[#A2140F] to-[#204F01] text-white'
                                            : 'bg-white text-gray-800 shadow-md'
                                    }`}
                                >
                                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                                    <p className={`text-xs mt-1 ${
                                        message.sender === 'user' ? 'text-white/70' : 'text-gray-500'
                                    }`}>
                                        {formatTime(message.timestamp)}
                                    </p>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white">
                        <div className="flex space-x-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Tapez votre message..."
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#A2140F] focus:border-transparent"
                            />
                            <button
                                type="submit"
                                disabled={!inputValue.trim()}
                                className="bg-gradient-to-r from-[#A2140F] to-[#204F01] text-white rounded-full p-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label="Envoyer le message"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                    />
                                </svg>
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
}

export default Chatbot;
