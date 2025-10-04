import React, { useState } from 'react';
import styles from './styles/ManualInput.module.css';

const ManualInput = () => {
  const [datasetType, setDatasetType] = useState('kepler');
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Define features for each dataset type
  const datasetFeatures = {
    kepler: {
      name: 'Kepler (KOI)',
      features: [
        { key: 'koi_fpflag_nt', label: 'False Positive Flag - Not Transit', placeholder: 'e.g., 0' },
        { key: 'koi_fpflag_ss', label: 'False Positive Flag - Stellar Eclipse', placeholder: 'e.g., 0' },
        { key: 'koi_fpflag_co', label: 'False Positive Flag - Centroid Offset', placeholder: 'e.g., 0' },
        { key: 'koi_fpflag_ec', label: 'False Positive Flag - Ephemeris Match', placeholder: 'e.g., 0' },
        { key: 'koi_period', label: 'Orbital Period (days)', placeholder: 'e.g., 365.25' },
        { key: 'koi_period_err2', label: 'Orbital Period Error 2', placeholder: 'e.g., 0.1' },
        { key: 'koi_time0bk', label: 'Transit Epoch (BJD-2454833)', placeholder: 'e.g., 100.5' },
        { key: 'koi_impact', label: 'Impact Parameter', placeholder: 'e.g., 0.5' },
        { key: 'koi_duration', label: 'Transit Duration (hours)', placeholder: 'e.g., 13.5' },
        { key: 'koi_depth', label: 'Transit Depth (ppm)', placeholder: 'e.g., 1000' },
        { key: 'koi_prad', label: 'Planetary Radius (Earth radii)', placeholder: 'e.g., 1.0' },
        { key: 'koi_teq', label: 'Equilibrium Temperature (K)', placeholder: 'e.g., 300' },
        { key: 'koi_insol', label: 'Insolation Flux (Earth flux)', placeholder: 'e.g., 1.0' },
        { key: 'koi_model_snr', label: 'Model Signal-to-Noise Ratio', placeholder: 'e.g., 10.5' },
        { key: 'koi_tce_plnt_num', label: 'TCE Planet Number', placeholder: 'e.g., 1' },
        { key: 'koi_steff', label: 'Stellar Effective Temperature (K)', placeholder: 'e.g., 5778' },
        { key: 'koi_slogg', label: 'Stellar Surface Gravity (log10 cm/s²)', placeholder: 'e.g., 4.4' },
        { key: 'koi_srad', label: 'Stellar Radius (Solar radii)', placeholder: 'e.g., 1.0' },
        { key: 'ra', label: 'Right Ascension (degrees)', placeholder: 'e.g., 290.0' },
        { key: 'dec', label: 'Declination (degrees)', placeholder: 'e.g., 45.0' },
        { key: 'koi_kepmag', label: 'Kepler Magnitude', placeholder: 'e.g., 12.5' }
      ]
    },
    tess: {
      name: 'TESS (TOI)',
      features: [
        { key: 'ra', label: 'Right Ascension (degrees)', placeholder: 'e.g., 290.0' },
        { key: 'dec', label: 'Declination (degrees)', placeholder: 'e.g., 45.0' },
        { key: 'st_pmra', label: 'Stellar Proper Motion RA (mas/yr)', placeholder: 'e.g., 10.5' },
        { key: 'st_pmdec', label: 'Stellar Proper Motion Dec (mas/yr)', placeholder: 'e.g., -5.2' },
        { key: 'pl_tranmid', label: 'Transit Midpoint (BJD)', placeholder: 'e.g., 2459000.5' },
        { key: 'pl_orbper', label: 'Orbital Period (days)', placeholder: 'e.g., 365.25' },
        { key: 'pl_trandurh', label: 'Transit Duration (hours)', placeholder: 'e.g., 13.5' },
        { key: 'pl_trandep', label: 'Transit Depth (ppm)', placeholder: 'e.g., 1000' },
        { key: 'pl_trandeplim', label: 'Transit Depth Limit', placeholder: 'e.g., 0' },
        { key: 'pl_rade', label: 'Planetary Radius (Earth radii)', placeholder: 'e.g., 1.0' },
        { key: 'pl_insol', label: 'Insolation Flux (Earth flux)', placeholder: 'e.g., 1.0' },
        { key: 'pl_eqt', label: 'Equilibrium Temperature (K)', placeholder: 'e.g., 300' },
        { key: 'st_tmag', label: 'TESS Magnitude', placeholder: 'e.g., 12.5' },
        { key: 'st_dist', label: 'Stellar Distance (pc)', placeholder: 'e.g., 100.0' },
        { key: 'st_teff', label: 'Stellar Effective Temperature (K)', placeholder: 'e.g., 5778' },
        { key: 'st_logg', label: 'Stellar Surface Gravity (log10 cm/s²)', placeholder: 'e.g., 4.4' },
        { key: 'st_rad', label: 'Stellar Radius (Solar radii)', placeholder: 'e.g., 1.0' }
      ]
    },
    k2: {
      name: 'K2',
      features: [
        { key: 'pl_orbperlim', label: 'Orbital Period Limit', placeholder: 'e.g., 0' },
        { key: 'pl_rade', label: 'Planetary Radius (Earth radii)', placeholder: 'e.g., 1.0' },
        { key: 'pl_radelim', label: 'Planetary Radius Limit', placeholder: 'e.g., 0' },
        { key: 'pl_radj', label: 'Planetary Radius (Jupiter radii)', placeholder: 'e.g., 0.1' },
        { key: 'pl_radjlim', label: 'Planetary Radius Jupiter Limit', placeholder: 'e.g., 0' },
        { key: 'ttv_flag', label: 'TTV Flag', placeholder: 'e.g., 0' },
        { key: 'st_rad', label: 'Stellar Radius (Solar radii)', placeholder: 'e.g., 1.0' },
        { key: 'st_radlim', label: 'Stellar Radius Limit', placeholder: 'e.g., 0' },
        { key: 'dec', label: 'Declination (degrees)', placeholder: 'e.g., 45.0' },
        { key: 'sy_dist', label: 'System Distance (pc)', placeholder: 'e.g., 100.0' },
        { key: 'sy_vmag', label: 'System V Magnitude', placeholder: 'e.g., 12.5' },
        { key: 'sy_kmag', label: 'System K Magnitude', placeholder: 'e.g., 10.5' },
        { key: 'sy_gaiamag', label: 'System Gaia Magnitude', placeholder: 'e.g., 12.0' }
      ]
    }
  };

  // Initialize form data based on current dataset type
  const initializeFormData = (type) => {
    const features = datasetFeatures[type].features;
    const initialData = {};
    features.forEach(feature => {
      initialData[feature.key] = '';
    });
    return initialData;
  };

  const [formData, setFormData] = useState(initializeFormData(datasetType));

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDatasetChange = (newType) => {
    setDatasetType(newType);
    setFormData(initializeFormData(newType));
    setPrediction(null);
  };

  const handlePredict = async () => {
    // Validate inputs
    const emptyFields = Object.entries(formData).filter(([key, value]) => !value);
    if (emptyFields.length > 0) {
      alert('Please fill in all fields');
      return;
    }
    
    setIsLoading(true);
    setPrediction(null);
    
    try {
      // Prepare features array in the correct order based on current dataset type
      const currentFeatures = datasetFeatures[datasetType].features;
      const features = currentFeatures.map(feature => parseFloat(formData[feature.key]));

      const response = await fetch('http://localhost:8000/api/v1/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          features: features,
          dataset_type: datasetType
        }),
      });

      if (!response.ok) {
        throw new Error('Prediction failed');
      }

      const result = await response.json();
      setPrediction(result);
    } catch (error) {
      console.error('Error making prediction:', error);
      alert('Error making prediction. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData(initializeFormData(datasetType));
    setPrediction(null);
  };

  const currentDataset = datasetFeatures[datasetType];

  return (
    <div className={styles.manualInput}>
      <div className={styles.datasetSelector}>
        <label>Select Dataset Type for Input:</label>
        <select 
          value={datasetType} 
          onChange={(e) => handleDatasetChange(e.target.value)}
        >
          <option value="kepler">Kepler (KOI) Data Format</option>
          <option value="tess">TESS (TOI) Data Format</option>
          <option value="k2">K2 Data Format</option>
        </select>
      </div>

      <div className={styles.inputForm}>
        <h3>Enter {currentDataset.name} Parameters</h3>
        
        <div className={styles.inputGrid}>
          {currentDataset.features.map((feature) => (
            <div key={feature.key} className={styles.inputGroup}>
              <label>{feature.label}</label>
              <input
                type="number"
                value={formData[feature.key]}
                onChange={(e) => handleInputChange(feature.key, e.target.value)}
                placeholder={feature.placeholder}
                step="any"
              />
            </div>
          ))}
        </div>

        <div className={styles.buttonGroup}>
          <button 
            className={styles.predictBtn} 
            onClick={handlePredict}
            disabled={isLoading}
          >
            {isLoading ? 'Predicting...' : 'Predict Exoplanet Type'}
          </button>
          <button className={styles.resetBtn} onClick={handleReset}>
            Reset Form
          </button>
        </div>
      </div>

      {prediction && (
        <div className={styles.predictionResult}>
          <h3>Prediction Result</h3>
          <div className={styles.predictionCard}>
            <div className={styles.predictionInfo}>
              <p>
                <strong>Prediction:</strong>{" "}
                {(() => {
                  const model = prediction.model_used.toLowerCase();
                  const pred = prediction.prediction;

                  if (model === "kepler") {
                    return pred === 1 ? "Confirmed" : "Candidate";
                  } else if (model === "tess") {
                    return pred === 1 ? "Confirmed Planet" : "Planet Candidate";
                  } else if (model === "k2") {
                    return pred === 1 ? "Candidate" : "Confirmed";
                  }
                  return pred;
                })()}
              </p>
              <p>
                <strong>Model Used:</strong> {prediction.model_used.toUpperCase()}
              </p>
              <p>
                <strong>Status:</strong> {prediction.status}
              </p>
            </div>
          </div>
        </div>
      )}


      <div className={styles.helpText}>
        <h4>About the {currentDataset.name} Parameters:</h4>
        <ul>
          {currentDataset.features.map((feature) => (
            <li key={feature.key}>
              <strong>{feature.label.split(' (')[0]}:</strong> {
                feature.key.includes('period') ? 'Time for one complete orbit around the star' :
                feature.key.includes('depth') ? 'Fraction of light blocked during transit' :
                feature.key.includes('duration') ? 'Time from first to last contact during transit' :
                feature.key.includes('prad') || feature.key.includes('rade') ? 'Size of the planet relative to Earth' :
                feature.key.includes('srad') || feature.key.includes('rad') ? 'Size of the host star relative to Sun' :
                feature.key.includes('teff') || feature.key.includes('steff') ? 'Surface temperature of the host star' :
                'Physical parameter for exoplanet detection'
              }
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ManualInput;