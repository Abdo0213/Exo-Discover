import React from 'react';
import styles from './styles/VideoSection.module.css';

const VideoSection = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>How Exoplanet Detection Works</h2>
        <div className={styles.videoContainer}>
          <div className={styles.placeholderVideo}>
            <div className={styles.playButton}>▶</div>
            <p>Project Flow Video</p>
          </div>
        </div>
        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <h3>Data Collection</h3>
            <p>NASA satellites collect light curve data from distant stars</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <h3>Transit Detection</h3>
            <p>Identify dips in brightness indicating potential planetary transits</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <h3>AI Analysis</h3>
            <p>Machine learning models classify transits as planets or false positives</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>4</div>
            <h3>Verification</h3>
            <p>Confirmed exoplanets are added to NASA's official catalog</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;