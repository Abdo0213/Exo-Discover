import React, { useState } from 'react';
import ModelPrediction from '../components/Model/ModelPrediction';
import DataUpload from '../components/Model/DataUpload';
import ManualInput from '../components/Model/ManualInput';
import styles from './styles/ModelPage.module.css';

const ModelPage = () => {
  const [activeTab, setActiveTab] = useState('prediction');

  return (
    <div className={styles.modelPage}>
      <div className={styles.header}>
        <h1>Exoplanet Detection Model</h1>
        <p>Upload data or enter parameters manually to identify potential exoplanets</p>
      </div>
      
      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'prediction' ? styles.active : ''}`}
          onClick={() => setActiveTab('prediction')}
        >
          Model Prediction
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'upload' ? styles.active : ''}`}
          onClick={() => setActiveTab('upload')}
        >
          Upload CSV
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'manual' ? styles.active : ''}`}
          onClick={() => setActiveTab('manual')}
        >
          Manual Input
        </button>
      </div>

      <div className={styles.tabContent}>
        {activeTab === 'prediction' && <ModelPrediction />}
        {activeTab === 'upload' && <DataUpload />}
        {activeTab === 'manual' && <ManualInput />}
      </div>
    </div>
  );
};

export default ModelPage;