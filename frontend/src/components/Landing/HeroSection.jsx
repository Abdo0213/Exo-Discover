import React from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import styles from './styles/HeroSection.module.css'; 

const HeroSection = () => { 
  const navigate = useNavigate();

  const handleModelClick = () => {
    navigate('/model'); // redirects to http://localhost:3000/model
  };

  const handleDatasetClick = () => {
    const section = document.getElementById('datasets'); 
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' }); 
    }
  };

  return ( 
    <section className={styles.hero}> 
      <div className={styles.heroContent}> 
        <h1 className={styles.title}>Discover New Worlds with AI</h1> 
        <p className={styles.subtitle}> 
          Using NASA's exoplanet data and machine learning to uncover hidden planets beyond our solar system 
        </p> 
        <div className={styles.ctaButtons}> 
          <button className={styles.primaryBtn} onClick={handleDatasetClick}>Explore Datasets</button> 
          <button className={styles.secondaryBtn} onClick={handleModelClick}>Try Our Model</button> 
        </div> 
      </div> 
      <div className={styles.heroVisual}> 
        <div className={styles.planetAnimation}></div> 
      </div> 
    </section> 
  ); 
}; 

export default HeroSection;
