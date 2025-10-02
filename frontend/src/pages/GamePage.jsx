import React, { useRef, useEffect } from 'react';
import SolarSystem3D from '../components/Game/SolarSystem3D';
import styles from './styles/GamePage.module.css';

const GamePage = () => {
  return (
    <div className={styles.gamePage}>
      <div className={styles.header}>
        <h1>3D Solar System Explorer</h1>
        <p>Interactive educational experience - Learn about our solar system</p>
      </div>
      <SolarSystem3D />
    </div>
  );
};

export default GamePage;