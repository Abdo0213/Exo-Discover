import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './styles/Navbar.module.css';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link to="/">🌌 Exo-Discover</Link>
      </div>
      <ul className={styles.navLinks}>
        <li>
          <Link 
            to="/" 
            className={location.pathname === '/' ? styles.active : ''}
          >
            Home
          </Link>
        </li>
        <li>
          <Link 
            to="/model"
            className={location.pathname === '/model' ? styles.active : ''}
          >
            Model
          </Link>
        </li>
        <li>
          <Link 
            to="/game"
            className={location.pathname === '/game' ? styles.active : ''}
          >
            Solar System
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;