import React from 'react';
import styles from './styles/PlanetInfo.module.css';

const PlanetInfo = ({ planet, onClose }) => {
  if (!planet) return null;

  return (
    <div className={styles.planetInfo}>
      <button className={styles.closeBtn} onClick={onClose}>×</button>
      
      <div className={styles.header}>
        <div className={styles.planetIcon}>{planet.icon}</div>
        <div>
          <h2 className={styles.planetName}>{planet.name}</h2>
          <span className={styles.planetType}>{planet.type}</span>
        </div>
      </div>

      <div className={styles.imageSection}>
        {planet.image && (
          <img src={planet.image} alt={planet.name} className={styles.planetImage} />
        )}
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Radius</span>
          <span className={styles.statValue}>{planet.radius}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Mass</span>
          <span className={styles.statValue}>{planet.mass}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Gravity</span>
          <span className={styles.statValue}>{planet.gravity}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Water</span>
          <span className={styles.statValue}>{planet.water}</span>
        </div>
      </div>

      <div className={styles.infoSection}>
        <h3>About {planet.name}</h3>
        <div 
          className={styles.planetDescription}
          dangerouslySetInnerHTML={{ __html: planet.info }}
        />
      </div>

      {planet.moons && planet.moons.length > 0 && (
        <div className={styles.moonsSection}>
          <h3>Moons</h3>
          <div className={styles.moonsList}>
            {planet.moons.map((moon, index) => (
              <span key={index} className={styles.moonTag}>{moon.name}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanetInfo;