import React from 'react';
import HeroSection from './HeroSection';
import VideoSection from './VideoSection';
import ExoplanetTypes from './ExoplanetTypes';
import DatasetCards from './DatasetCards';
import styles from './styles/Landing.module.css';

const Landing = () => {
  return (
    <div className={styles.landing}>
      <HeroSection />
      <VideoSection />
      <ExoplanetTypes />
      <DatasetCards />
      
      {/* Call to Action Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContainer}>
          <h2>Ready to Explore the Cosmos?</h2>
          <p>Start your journey into exoplanet discovery with our AI-powered tools</p>
          <div className={styles.ctaButtons}>
            <button className={styles.ctaPrimary}>Try Our Model</button>
            <button className={styles.ctaSecondary}>Explore Solar System</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;