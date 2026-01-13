import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ContactsAdmin() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedContact, setSelectedContact] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        loadContacts();
    }, []);

    const loadContacts = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get('/contacts');
            const data = response.data?.data || [];
            setContacts(Array.isArray(data) ? data : []);
        } catch (e) {
            console.error('Erreur lors du chargement des messages:', e);
            setError("Impossible de charger les messages.");
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await axios.put(`/contacts/${id}/read`);
            await loadContacts();
            if (selectedContact && selectedContact.id === id) {
                setSelectedContact({ ...selectedContact, is_read: true });
            }
        } catch (e) {
            console.error('Erreur lors du marquage comme lu:', e);
            alert('Erreur lors du marquage du message comme lu.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Supprimer ce message ?')) return;
        try {
            await axios.delete(`/contacts/${id}`);
            await loadContacts();
            if (selectedContact && selectedContact.id === id) {
                setSelectedContact(null);
            }
        } catch (e) {
            console.error('Erreur lors de la suppression:', e);
            alert('Erreur lors de la suppression.');
        }
    };

    const handleViewContact = (contact) => {
        setSelectedContact(contact);
        if (!contact.is_read) {
            handleMarkAsRead(contact.id);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (loading) {
        return (
            <div className="p-6">
                <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#A2140F]" />
                </div>
            </div>
        );
    }

    const unreadCount = contacts.filter((c) => !c.is_read).length;

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#204F01]">
                    Messages de contact
                    {unreadCount > 0 && (
                        <span className="ml-3 px-3 py-1 bg-[#A2140F] text-white text-sm font-semibold rounded-full">
                            {unreadCount} non lu{unreadCount > 1 ? 's' : ''}
                        </span>
                    )}
                </h2>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            <div className="grid md:grid-cols-3 gap-6">
                {/* Liste des messages */}
                <div className="md:col-span-1">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                            <h3 className="font-semibold text-gray-700">
                                Messages ({contacts.length})
                            </h3>
                        </div>
                        <div className="max-h-[600px] overflow-y-auto">
                            {contacts.length === 0 ? (
                                <div className="p-6 text-center text-gray-500">
                                    <p>Aucun message pour le moment.</p>
                                </div>
                            ) : (
                                contacts.map((contact) => (
                                    <div
                                        key={contact.id}
                                        onClick={() => handleViewContact(contact)}
                                        className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                                            selectedContact?.id === contact.id
                                                ? 'bg-[#A2140F]/5 border-l-4 border-l-[#A2140F]'
                                                : ''
                                        } ${!contact.is_read ? 'bg-blue-50/50' : ''}`}
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <h4 className="font-semibold text-gray-900">
                                                {contact.name}
                                            </h4>
                                            {!contact.is_read && (
                                                <span className="w-2 h-2 bg-[#A2140F] rounded-full flex-shrink-0 mt-1.5"></span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600 mb-1 line-clamp-2">
                                            {contact.message}
                                        </p>
                                        <div className="flex items-center justify-between text-xs text-gray-500">
                                            <span>{contact.email}</span>
                                            <span>{formatDate(contact.created_at)}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Détails du message sélectionné */}
                <div className="md:col-span-2">
                    {selectedContact ? (
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h3 className="text-2xl font-bold text-[#204F01] mb-2">
                                        {selectedContact.name}
                                    </h3>
                                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                                        <div className="flex items-center">
                                            <svg
                                                className="w-4 h-4 mr-1"
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
                                            {selectedContact.email}
                                        </div>
                                        {selectedContact.phone && (
                                            <div className="flex items-center">
                                                <svg
                                                    className="w-4 h-4 mr-1"
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
                                                {selectedContact.phone}
                                            </div>
                                        )}
                                        <div className="flex items-center">
                                            <svg
                                                className="w-4 h-4 mr-1"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                            {formatDate(selectedContact.created_at)}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    {!selectedContact.is_read && (
                                        <button
                                            onClick={() => handleMarkAsRead(selectedContact.id)}
                                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
                                        >
                                            Marquer comme lu
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(selectedContact.id)}
                                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm"
                                    >
                                        Supprimer
                                    </button>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 pt-6">
                                <h4 className="font-semibold text-gray-700 mb-3">Message :</h4>
                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                                        {selectedContact.message}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 flex space-x-3">
                                <a
                                    href={`mailto:${selectedContact.email}`}
                                    className="inline-flex items-center px-4 py-2 bg-[#204F01] text-white rounded-md hover:bg-[#2d6f02] transition-colors"
                                >
                                    <svg
                                        className="w-4 h-4 mr-2"
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
                                    Répondre par email
                                </a>
                                {selectedContact.phone && (
                                    <a
                                        href={`tel:${selectedContact.phone}`}
                                        className="inline-flex items-center px-4 py-2 bg-[#A2140F] text-white rounded-md hover:bg-[#c91a14] transition-colors"
                                    >
                                        <svg
                                            className="w-4 h-4 mr-2"
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
                                        Appeler
                                    </a>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-md p-12 text-center">
                            <svg
                                className="w-16 h-16 text-gray-400 mx-auto mb-4"
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
                            <p className="text-gray-500">Sélectionnez un message pour voir les détails</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ContactsAdmin;

