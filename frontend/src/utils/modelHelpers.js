// Utility functions for model predictions and data processing

export const validateCSV = (file) => {
  // Basic CSV validation
  const requiredColumns = ['orbital_period', 'transit_depth', 'transit_duration'];
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      
      const missingColumns = requiredColumns.filter(col => !headers.includes(col));
      if (missingColumns.length > 0) {
        resolve({ valid: false, error: `Missing columns: ${missingColumns.join(', ')}` });
      } else {
        resolve({ valid: true });
      }
    };
    reader.readAsText(file);
  });
};

export const predictExoplanet = (data) => {
  // Mock prediction function - replace with actual model
  const confidence = Math.random() * 100;
  let prediction;
  
  if (confidence > 90) {
    prediction = 'Confirmed Exoplanet';
  } else if (confidence > 70) {
    prediction = 'Planetary Candidate'; 
  } else if (confidence > 50) {
    prediction = 'Ambiguous Candidate';
  } else {
    prediction = 'False Positive';
  }
  
  return {
    prediction,
    confidence: Math.round(confidence * 10) / 10
  };
};