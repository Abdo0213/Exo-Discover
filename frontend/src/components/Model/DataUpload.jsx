import React, { useState } from 'react';
import styles from './styles/DataUpload.module.css';

const DataUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [datasetType, setDatasetType] = useState('kepler');
  const [isTraining, setIsTraining] = useState(false);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/csv') {
      setSelectedFile(file);
    } else {
      alert('Please select a CSV file');
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      alert('Please select a file first');
      return;
    }
    
    setIsTraining(true);
    // Simulate training process
    setTimeout(() => {
      setIsTraining(false);
      alert('Model retrained successfully with new data!');
    }, 3000);
  };

  return (
    <div className={styles.dataUpload}>
      <div className={styles.uploadArea}>
        <h3>Upload CSV Data</h3>
        
        <div className={styles.datasetSelector}>
          <label>Select Dataset Type:</label>
          <select 
            value={datasetType} 
            onChange={(e) => setDatasetType(e.target.value)}
          >
            <option value="kepler">Kepler Data</option>
            <option value="tess">TESS Data</option>
            <option value="k2">K2 Data</option>
          </select>
        </div>

        <div className={styles.fileUpload}>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            className={styles.fileInput}
          />
          <div className={styles.uploadBox}>
            {selectedFile ? (
              <div className={styles.fileInfo}>
                <span>📄 {selectedFile.name}</span>
                <span>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
              </div>
            ) : (
              <div className={styles.uploadPrompt}>
                <span>📁 Click to upload CSV file</span>
                <small>Supports .csv files with exoplanet data</small>
              </div>
            )}
          </div>
        </div>

        <button 
          className={styles.uploadBtn}
          onClick={handleUpload}
          disabled={!selectedFile || isTraining}
        >
          {isTraining ? 'Training Model...' : 'Upload & Retrain Model'}
        </button>

        {isTraining && (
          <div className={styles.trainingProgress}>
            <div className={styles.progressBar}>
              <div className={styles.progressFill}></div>
            </div>
            <p>Training model with new data...</p>
          </div>
        )}
      </div>

      <div className={styles.requirements}>
        <h4>CSV Requirements:</h4>
        <ul>
          <li>Columns: orbital_period, transit_depth, transit_duration, etc.</li>
          <li>Header row with column names</li>
          <li>Numeric values for features</li>
          <li>UTF-8 encoding</li>
        </ul>
      </div>
    </div>
  );
};

export default DataUpload;