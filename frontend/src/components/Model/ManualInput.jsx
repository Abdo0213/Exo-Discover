import React, { useState } from 'react';
import styles from './styles/ManualInput.module.css';

const ManualInput = () => {
  const [datasetType, setDatasetType] = useState('kepler');
  const [formData, setFormData] = useState({
    orbitalPeriod: '',
    transitDepth: '',
    transitDuration: '',
    planetaryRadius: '',
    stellarRadius: '',
    effectiveTemperature: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePredict = () => {
    // Validate inputs
    const emptyFields = Object.entries(formData).filter(([key, value]) => !value);
    if (emptyFields.length > 0) {
      alert('Please fill in all fields');
      return;
    }
    
    // Mock prediction
    alert('Prediction: Planetary Candidate (85.3% confidence)');
  };

  const handleReset = () => {
    setFormData({
      orbitalPeriod: '',
      transitDepth: '',
      transitDuration: '',
      planetaryRadius: '',
      stellarRadius: '',
      effectiveTemperature: ''
    });
  };

  return (
    <div className={styles.manualInput}>
      <div className={styles.datasetSelector}>
        <label>Select Dataset Type for Input:</label>
        <select 
          value={datasetType} 
          onChange={(e) => setDatasetType(e.target.value)}
        >
          <option value="kepler">Kepler Data Format</option>
          <option value="tess">TESS Data Format</option>
          <option value="k2">K2 Data Format</option>
        </select>
      </div>

      <div className={styles.inputForm}>
        <h3>Enter Exoplanet Parameters</h3>
        
        <div className={styles.inputGrid}>
          <div className={styles.inputGroup}>
            <label>Orbital Period (days)</label>
            <input
              type="number"
              value={formData.orbitalPeriod}
              onChange={(e) => handleInputChange('orbitalPeriod', e.target.value)}
              placeholder="e.g., 365.25"
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Transit Depth (ppm)</label>
            <input
              type="number"
              value={formData.transitDepth}
              onChange={(e) => handleInputChange('transitDepth', e.target.value)}
              placeholder="e.g., 1000"
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Transit Duration (hours)</label>
            <input
              type="number"
              value={formData.transitDuration}
              onChange={(e) => handleInputChange('transitDuration', e.target.value)}
              placeholder="e.g., 13.5"
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Planetary Radius (Earth radii)</label>
            <input
              type="number"
              value={formData.planetaryRadius}
              onChange={(e) => handleInputChange('planetaryRadius', e.target.value)}
              placeholder="e.g., 1.0"
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Stellar Radius (Solar radii)</label>
            <input
              type="number"
              value={formData.stellarRadius}
              onChange={(e) => handleInputChange('stellarRadius', e.target.value)}
              placeholder="e.g., 1.0"
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Effective Temperature (K)</label>
            <input
              type="number"
              value={formData.effectiveTemperature}
              onChange={(e) => handleInputChange('effectiveTemperature', e.target.value)}
              placeholder="e.g., 5778"
            />
          </div>
        </div>

        <div className={styles.buttonGroup}>
          <button className={styles.predictBtn} onClick={handlePredict}>
            Predict Exoplanet Type
          </button>
          <button className={styles.resetBtn} onClick={handleReset}>
            Reset Form
          </button>
        </div>
      </div>

      <div className={styles.helpText}>
        <h4>About the Parameters:</h4>
        <ul>
          <li><strong>Orbital Period:</strong> Time for one complete orbit around the star</li>
          <li><strong>Transit Depth:</strong> Fraction of light blocked during transit</li>
          <li><strong>Transit Duration:</strong> Time from first to last contact during transit</li>
          <li><strong>Planetary Radius:</strong> Size of the planet relative to Earth</li>
          <li><strong>Stellar Radius:</strong> Size of the host star relative to Sun</li>
          <li><strong>Effective Temperature:</strong> Surface temperature of the host star</li>
        </ul>
      </div>
    </div>
  );
};

export default ManualInput;