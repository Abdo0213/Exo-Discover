import React, { useState } from 'react'; 
import styles from './styles/DataUpload.module.css'; 

const DataUpload = () => { 
  const [selectedFile, setSelectedFile] = useState(null); 
  const [datasetType, setDatasetType] = useState('kepler'); 
  const [isProcessing, setIsProcessing] = useState(false); 
  const [predictions, setPredictions] = useState(null); 
  const [error, setError] = useState(null); 
  const [enhancedResults, setEnhancedResults] = useState(null); 

  const handleFileSelect = (event) => { 
    const file = event.target.files[0]; 
    if (file && file.type === 'text/csv') { 
      setSelectedFile(file); 
      setError(null); 
      setPredictions(null); 
    } else { 
      alert('Please select a CSV file'); 
    } 
  }; 

  const handleDatasetChange = (value) => {
    setDatasetType(value);
    setPredictions(null);
    setError(null);
  };

  const handleUpload = async () => { 
    if (!selectedFile) { 
      alert('Please select a file first'); 
      return; 
    } 
     
    setIsProcessing(true); 
    setError(null); 
    setPredictions(null); 
    setEnhancedResults(null); 
     
    try { 
      const formData = new FormData(); 
      formData.append('file', selectedFile); 
      formData.append('dataset_type', datasetType); 

      const response = await fetch('http://localhost:8000/api/v1/predict/csv', { 
        method: 'POST', 
        body: formData, 
      }); 

      if (!response.ok) { 
        const errorData = await response.json(); 
        throw new Error(errorData.detail || 'Prediction failed'); 
      } 

      const result = await response.json(); 
      setPredictions(result); 
    } catch (error) { 
      console.error('Error processing CSV:', error); 
      setError(error.message); 
    } finally { 
      setIsProcessing(false); 
    } 
  }; 

  return ( 
    <div className={styles.manualInput}> 
      <div className={styles.uploadArea}> 
        <h3>Upload CSV Data for Prediction</h3> 
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

        <div className={styles.fileUpload}> 
          <input 
            type="file" 
            accept=".csv" 
            onChange={handleFileSelect} 
            className={styles.fileInput} 
            id="file-upload" 
          /> 
          <div  
            className={styles.uploadBox} 
            onClick={() => document.getElementById('file-upload').click()} 
          > 
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

        <div className={styles.uploadButtons}> 
          <button  
            className={styles.uploadBtn} 
            onClick={handleUpload} 
            disabled={!selectedFile || isProcessing} 
          > 
            {isProcessing ? 'Processing...' : 'Basic Predict'} 
          </button> 
        </div> 

        {isProcessing && ( 
          <div className={styles.trainingProgress}> 
            <div className={styles.progressBar}> 
              <div className={styles.progressFill}></div> 
            </div> 
            <p>Processing CSV file and making predictions...</p> 
          </div> 
        )} 

        {error && ( 
          <div className={styles.errorMessage}> 
            <h4>Error:</h4> 
            <p>{error}</p> 
          </div> 
        )} 

        {predictions && ( 
          <div className={styles.predictionResults}> 
            <h3>Prediction Results</h3> 
            <div className={styles.predictionSummary}> 
              <p><strong>Model Used:</strong> {predictions.model_used.toUpperCase()}</p> 
              <p><strong>Total Predictions:</strong> {predictions.predictions.length}</p> 
              <p><strong>Status:</strong> {predictions.status}</p> 
            </div> 
            <div className={styles.predictionsList}> 
              <h4>Predictions:</h4> 
              <div className={styles.predictionsGrid}> 
                {predictions.predictions.map((prediction, index) => { 
                  let label = prediction; 
                  const model = predictions.model_used.toLowerCase(); 

                  if (model === "kepler") { 
                    label = prediction === 1 ? "Confirmed" : "Candidate"; 
                  } else if (model === "tess") { 
                    label = prediction === 1 ? "Confirmed Planet" : "Planet Candidate"; 
                  } else if (model === "k2") { 
                    label = prediction === 1 ? "Candidate" : "Confirmed"; 
                  } 

                  return ( 
                    <div key={index} className={styles.predictionItem}> 
                      <span className={styles.predictionIndex}>#{index + 1}</span> 
                      <span className={styles.predictionValue}>{label}</span> 
                    </div> 
                  ); 
                })} 
              </div> 
            </div> 
          </div> 
        )} 
      </div> 

      <div className={styles.requirements}> 
        <h4>CSV Requirements for {datasetType.toUpperCase()}:</h4> 
        <ul> 
          {datasetType === 'kepler' && ( 
            <> 
              <li>Columns: koi_disposition, koi_fpflag_nt, koi_fpflag_ss, koi_fpflag_co, koi_fpflag_ec, koi_period, koi_period_err2, koi_time0bk, koi_impact, koi_duration, koi_depth, koi_prad, koi_teq, koi_insol, koi_model_snr, koi_tce_plnt_num, koi_steff, koi_slogg, koi_srad, ra, dec, koi_kepmag</li> 
              <li>Header row with column names</li> 
            </> 
          )} 
          {datasetType === 'tess' && ( 
            <> 
              <li>Columns: tfopwg_disp, ra, dec, st_pmra, st_pmdec, pl_tranmid, pl_orbper, pl_trandurh, pl_trandep, pl_trandeplim, pl_rade, pl_insol, pl_eqt, st_tmag, st_dist, st_teff, st_logg, st_rad</li> 
              <li>Header row with column names</li> 
            </> 
          )} 
          {datasetType === 'k2' && ( 
            <> 
              <li>Columns: disposition, pl_orbperlim, pl_rade, pl_radelim, pl_radj, pl_radjlim, ttv_flag, st_rad, st_radlim, dec, sy_dist, sy_vmag, sy_kmag, sy_gaiamag</li> 
              <li>Header row with column names</li> 
            </> 
          )} 
          <li>Numeric values for features</li> 
          <li>UTF-8 encoding</li> 
        </ul> 
      </div> 
    </div> 
  ); 
}; 

export default DataUpload;
