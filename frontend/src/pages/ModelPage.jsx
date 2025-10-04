import React, { useState } from 'react';
import ModelPrediction from '../components/Model/ModelPrediction';
import DataUpload from '../components/Model/DataUpload';
import ManualInput from '../components/Model/ManualInput';
import styles from './styles/ModelPage.module.css';

const ModelPage = () => {
  const [activeTab, setActiveTab] = useState('models');

  return (
    <div className={styles.modelPage}>
      <div className={styles.header}>
        <h1>Exoplanet Detection Models</h1>
        <p>View model performance, upload CSV data, or enter parameters manually to identify potential exoplanets</p>
      </div>
      
      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'models' ? styles.active : ''}`}
          onClick={() => setActiveTab('models')}
        >
          Model Performance
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
        {activeTab === 'models' && <ModelPrediction />}
        {activeTab === 'upload' && <DataUpload />}
        {activeTab === 'manual' && <ManualInput />}
      </div>
    </div>
  );
};

export default ModelPage;