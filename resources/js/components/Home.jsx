import React from 'react';
import Hero from './Hero';
import About from './About';
import News from './News';
import Contact from './Contact';
import WhoWeAre from './WhoWeAre';

function Home() {
    return (
        <div className="min-h-screen bg-white">
            <main>
                <Hero />
                <News limit={6} showMoreButton={true} />
                <WhoWeAre />
            </main>
        </div>
    );
}

export default Home;


