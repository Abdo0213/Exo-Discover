import React from 'react';
import styles from './styles/Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.logo}>
            <h3>🌌 Exo-Discover</h3>
            <p>Discovering new worlds with artificial intelligence</p>
          </div>
          
          <div className={styles.links}>
            <div className={styles.linkGroup}>
              <h4>Explore</h4>
              <a href="/">Home</a>
              <a href="/model">AI Model</a>
              <a href="/game">Solar System</a>
            </div>
            
            <div className={styles.linkGroup}>
              <h4>Datasets</h4>
              <a href="/dataset/kepler">Kepler Data</a>
              <a href="/dataset/tess">TESS Data</a>
              <a href="/dataset/k2">K2 Data</a>
            </div>
            
            <div className={styles.linkGroup}>
              <h4>Resources</h4>
              <a href="https://exoplanetarchive.ipac.caltech.edu/">NASA Archive</a>
              <a href="https://kepler.nasa.gov/">Kepler Mission</a>
              <a href="https://tess.mit.edu/">TESS Mission</a>
            </div>
          </div>
        </div>
        
        <div className={styles.bottom}>
          <p>&copy; 2025 Exo-Discover. Educational project for NASA Space Apps Challenge.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;