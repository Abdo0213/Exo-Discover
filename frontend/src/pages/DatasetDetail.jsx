import React from 'react';
import { useParams } from 'react-router-dom';
import styles from './styles/DatasetDetail.module.css';
import { datasetInfo } from '../data/datasetInfo';

const DatasetDetail = () => {
  const { id } = useParams();

  const dataset = datasetInfo[id] || datasetInfo.kepler;

  return (
    <div className={styles.datasetDetail}>
      <div className={styles.header}>
        <h1>{dataset.title}</h1>
        <p>{dataset.description}</p>
      </div>
      
      <div className={styles.stats}>
        <div className={styles.stat}>
          <h3>Mission Duration</h3>
          <p>{dataset.missionYears}</p>
        </div>
        <div className={styles.stat}>
          <h3>Planets Discovered</h3>
          <p>{dataset.planetsDiscovered}</p>
        </div>
        <div className={styles.stat}>
          <h3>Key Features</h3>
          <ul>
            {dataset.keyFeatures.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className={styles.graphs}>
        <h2>Data Analysis & Visualizations</h2>
        <p className={styles.graphInfo}>
          Interactive graphs and data visualizations will be displayed here
        </p>

        <div className={styles.graphPlaceholder}>
          {dataset.graphs?.map((src, index) => (
            <div className={styles.graph} key={index}>
              <img src={src} alt={`Graph ${index + 1}`} loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DatasetDetail;