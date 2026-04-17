import React from 'react';
import Header from './Header';
import Hero from './Hero';
import News from './News';
import About from './About';
import Contact from './Contact';
import Footer from './Footer';

function App() {
    return (
        <div className="min-h-screen bg-white">
            <Header />
            <main style={{ marginTop: 0, paddingTop: 0 }}>
                <Hero />
                <About />
                <News />
                <Contact />
            </main>
            <Footer />
        </div>
    );
}

export default App;

