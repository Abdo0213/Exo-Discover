import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Common/Navbar';
import Footer from './components/Common/Footer';
import Chatbot from './components/Common/Chatbot';
import Home from './pages/Home';
import DatasetDetail from './pages/DatasetDetail';
import ModelPage from './pages/ModelPage';
import GamePage from './pages/GamePage';
import styles from './App.module.css';
import './index.css'; // Import global styles

function App() {
  return (
    <Router>
      <div className={styles.app}>
        <Navbar />
        <main className={styles.main}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dataset/:id" element={<DatasetDetail />} />
            <Route path="/model" element={<ModelPage />} />
            <Route path="/game" element={<GamePage />} />
          </Routes>
        </main>
        <Footer />
        <Chatbot />
      </div>
    </Router>
  );
}

export default App;