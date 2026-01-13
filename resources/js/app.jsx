import './bootstrap';
import './i18n'; // Initialiser i18next
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import '../css/app.css';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './components/Home';
import About from './components/About';
import WhatWeDo from './components/WhatWeDo';
import NewsPage from './components/NewsPage';
import NewsDetail from './components/NewsDetail';
import Contact from './components/Contact';
import Partenaires from './components/Partenaires';
import PartnerDetail from './components/PartnerDetail';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import DonForm from './components/DonForm';
import DonSuccess from './components/DonSuccess';

const container = document.getElementById('app');

if (container) {
    const root = createRoot(container);

    root.render(
        <React.StrictMode>
            <BrowserRouter>
                <ScrollToTop />
                <Routes>
                    {/* Admin routes without Header/Footer */}
                    <Route path="/login" element={<Login />} />
                    <Route 
                        path="/dashboard/*" 
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        } 
                    />
                    
                    {/* Public routes with Header/Footer */}
                    <Route path="/*" element={
                        <div className="min-h-screen bg-white flex flex-col">
                            <Header />
                            <main className="flex-1">
                                <Routes>
                                    <Route path="/" element={<Home />} />
                                    <Route path="/qui-nous-sommes" element={<About />} />
                                    <Route path="/ce-que-nous-faisons" element={<WhatWeDo />} />
                                    <Route path="/nous-soutenir" element={<Contact />} />
                                    <Route path="/news" element={<NewsPage />} />
                                    <Route path="/news/:id" element={<NewsDetail />} />
                                    <Route path="/partenaires" element={<Partenaires />} />
                                    <Route path="/partenaires/:id" element={<PartnerDetail />} />
                                    <Route path="/don" element={<DonForm />} />
                                    <Route path="/don/success" element={<DonSuccess />} />
                                    <Route path="*" element={<Navigate to="/" replace />} />
                                </Routes>
                            </main>
                            <Footer />
                        </div>
                    } />
                </Routes>
            </BrowserRouter>
        </React.StrictMode>
    );
} else {
    console.error('Container with id "app" not found');
}
