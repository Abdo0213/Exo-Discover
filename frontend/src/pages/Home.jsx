import React from 'react'; 
import HeroSection from '../components/Landing/HeroSection'; 
import VideoSection from '../components/Landing/VideoSection'; 
import ExoplanetTypes from '../components/Landing/ExoplanetTypes'; 
import DatasetCards from '../components/Landing/DatasetCards'; 
import styles from './styles/Home.module.css'; 

const Home = () => { 
  return ( 
    <div className={styles.home}> 
      <HeroSection /> 
      <VideoSection /> 
      <ExoplanetTypes /> 
      {/* Add ID here for smooth scrolling */}
      <div id="datasets">
        <DatasetCards /> 
      </div>
    </div> 
  ); 
}; 

export default Home;
