import React, { useState, useEffect } from 'react';
import styles from './styles/ModelPrediction.module.css';

const ModelPrediction = () => {
  const [modelStats, setModelStats] = useState({
    kepler: { accuracy: 92, precision: 94, recall: 90, f1: 92 },
    tess: { accuracy: 94, precision: 93, recall: 96, f1: 93 },
    k2: { accuracy: 94, precision: 95, recall: 94, f1: 94 }
  });
  const [selectedModel, setSelectedModel] = useState('kepler');

  return (
    <div className={styles.modelPrediction}>
      <div className={styles.modelSelector}>
        <h3>Select Model to View Performance</h3>
        <div className={styles.modelTabs}>
          <button 
            className={`${styles.modelTab} ${selectedModel === 'kepler' ? styles.active : ''}`}
            onClick={() => setSelectedModel('kepler')}
          >
            Kepler (KOI)
          </button>
          <button 
            className={`${styles.modelTab} ${selectedModel === 'tess' ? styles.active : ''}`}
            onClick={() => setSelectedModel('tess')}
          >
            TESS (TOI)
          </button>
          <button 
            className={`${styles.modelTab} ${selectedModel === 'k2' ? styles.active : ''}`}
            onClick={() => setSelectedModel('k2')}
          >
            K2
          </button>
        </div>
      </div>

      <div className={styles.modelInfo}>
        <h3>{selectedModel.toUpperCase()} Model Performance</h3>
        <div className={styles.modelStats}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Accuracy:</span>
            <span className={styles.statValue}>{modelStats[selectedModel].accuracy}%</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Precision:</span>
            <span className={styles.statValue}>{modelStats[selectedModel].precision}%</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Recall:</span>
            <span className={styles.statValue}>{modelStats[selectedModel].recall}%</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>F1-Score:</span>
            <span className={styles.statValue}>{modelStats[selectedModel].f1}%</span>
          </div>
        </div>
        
        <div className={styles.modelDescription}>
          <h4>Model Information</h4>
          <p>
            {selectedModel === 'kepler' && 
              "The Kepler model is trained on data from NASA's Kepler Space Telescope, focusing on transit photometry data to identify exoplanet candidates."
            }
            {selectedModel === 'tess' && 
              "The TESS model analyzes data from the Transiting Exoplanet Survey Satellite, using similar transit detection methods with improved sensitivity."
            }
            {selectedModel === 'k2' && 
              "The K2 model processes data from the Kepler Space Telescope's extended mission, covering different regions of the sky with refined detection algorithms."
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default ModelPrediction;