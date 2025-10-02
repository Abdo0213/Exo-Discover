import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './styles/DatasetCards.module.css';

const datasets = [ 
  { 
    id: 'cumulative', 
    title: 'NASA Exoplanet Archive (Cumulative)', 
    description: 'Master catalog combining confirmed exoplanets and their parameters from multiple missions.', 
    missions: 'Multi-mission', 
    planets: '5,000+', 
    icon: '🌌' 
  }, 
  { 
    id: 'k2', 
    title: 'K2 Planets and Candidates', 
    description: 'Extended mission data capturing exoplanets across different regions of the sky.', 
    missions: 'K2', 
    planets: '500+', 
    icon: '🌟' 
  }, 
  { 
    id: 'toi', 
    title: 'TESS Objects of Interest (TOI)', 
    description: 'Candidate planets identified by TESS for follow-up observations and confirmation.', 
    missions: 'TESS', 
    planets: '7,000+', 
    icon: '🔭' 
  } 
];


const DatasetCards = () => {
  const navigate = useNavigate();

  const handleCardClick = (datasetId) => {
    navigate(`/dataset/${datasetId}`);
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>NASA Exoplanet Datasets</h2>
        <p className={styles.sectionSubtitle}>
          Explore the rich datasets used for training our machine learning models
        </p>
        <div className={styles.cardsGrid}>
          {datasets.map((dataset) => (
            <div 
              key={dataset.id}
              className={styles.card}
              onClick={() => handleCardClick(dataset.id)}
            >
              <div className={styles.cardHeader}>
                <div className={styles.icon}>{dataset.icon}</div>
                <h3 className={styles.cardTitle}>{dataset.title}</h3>
              </div>
              <p className={styles.cardDescription}>{dataset.description}</p>
              <div className={styles.cardStats}>
                <div className={styles.stat}>
                  <span className={styles.statLabel}>Mission:</span>
                  <span className={styles.statValue}>{dataset.missions}</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statLabel}>Objects:</span>
                  <span className={styles.statValue}>{dataset.planets}</span>
                </div>
              </div>
              <button className={styles.exploreBtn}>Explore Dataset →</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DatasetCards;