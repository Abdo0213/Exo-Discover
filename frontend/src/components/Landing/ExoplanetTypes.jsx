import React from 'react';
import styles from './styles/ExoplanetTypes.module.css';

const exoplanetTypes = [
  {
    title: "Confirmed Exoplanets",
    description: "Planets that have been verified through multiple observation methods",
    icon: "🪐",
    color: "#4CAF50"
  },
  {
    title: "Planetary Candidates",
    description: "Potential planets awaiting confirmation through further observations",
    icon: "🔍",
    color: "#FF9800"
  },
  {
    title: "False Positives",
    description: "Objects initially thought to be planets but later identified as other astronomical phenomena",
    icon: "❌",
    color: "#F44336"
  },
  {
    title: "Ambiguous Candidates",
    description: "Objects with uncertain planetary status requiring additional data",
    icon: "❓",
    color: "#9C27B0"
  }
];

const ExoplanetTypes = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Exoplanet Classification Types</h2>
        <p className={styles.sectionSubtitle}>
          Understanding the different categories of exoplanet discoveries
        </p>
        <div className={styles.cardsGrid}>
          {exoplanetTypes.map((type, index) => (
            <div 
              key={index} 
              className={styles.card}
              style={{ '--accent-color': type.color }}
            >
              <div className={styles.cardIcon}>{type.icon}</div>
              <h3 className={styles.cardTitle}>{type.title}</h3>
              <p className={styles.cardDescription}>{type.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExoplanetTypes;