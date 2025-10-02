import React, { useState } from 'react';
import styles from './styles/ModelPrediction.module.css';

const ModelPrediction = () => {
  const [prediction, setPrediction] = useState(null);
  const [confidence, setConfidence] = useState(null);

  const handlePredict = () => {
    // Mock prediction for now
    setPrediction('Planetary Candidate');
    setConfidence(87.5);
  };

  return (
    <div className={styles.modelPrediction}>
      <div className={styles.modelInfo}>
        <h3>Current Model Status</h3>
        <div className={styles.modelStats}>
          <div className={styles.stat}>
            <span>Accuracy:</span>
            <span>94.2%</span>
          </div>
          <div className={styles.stat}>
            <span>Precision:</span>
            <span>92.8%</span>
          </div>
          <div className={styles.stat}>
            <span>Recall:</span>
            <span>95.1%</span>
          </div>
        </div>
      </div>

      <div className={styles.predictionResult}>
        {prediction && (
          <>
            <h3>Prediction Result</h3>
            <div className={`${styles.result} ${styles[prediction.toLowerCase().replace(' ', '')]}`}>
              <span className={styles.predictionLabel}>{prediction}</span>
              <span className={styles.confidence}>{confidence}% confidence</span>
            </div>
          </>
        )}
      </div>

      <button className={styles.predictBtn} onClick={handlePredict}>
        Run Sample Prediction
      </button>
    </div>
  );
};

export default ModelPrediction;