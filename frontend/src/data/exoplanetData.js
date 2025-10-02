export const exoplanetTypes = [
  {
    title: "Confirmed Exoplanets",
    description: "Planets that have been verified through multiple observation methods",
    icon: "🪐",
    color: "#4CAF50"
  },
  {
    title: "Planetary Candidates", 
    description: "Potential planets awaiting confirmation through further observations",
    icon: "🔍",
    color: "#FF9800"
  },
  {
    title: "False Positives",
    description: "Objects initially thought to be planets but later identified as other astronomical phenomena",
    icon: "❌", 
    color: "#F44336"
  },
  {
    title: "Ambiguous Candidates",
    description: "Objects with uncertain planetary status requiring additional data",
    icon: "❓",
    color: "#9C27B0"
  }
];

export const datasets = [
  {
    id: 'kepler',
    title: 'Kepler Objects of Interest',
    description: 'Comprehensive data from the Kepler mission with confirmed exoplanets, candidates, and false positives.',
    missions: 'Kepler',
    planets: '2,800+',
    icon: '🛰️'
  },
  {
    id: 'tess', 
    title: 'TESS Objects of Interest',
    description: 'Latest exoplanet discoveries from the Transiting Exoplanet Survey Satellite mission.',
    missions: 'TESS',
    planets: '200+', 
    icon: '🔭'
  },
  {
    id: 'k2',
    title: 'K2 Planets and Candidates',
    description: 'Extended mission data capturing exoplanets across different regions of the sky.',
    missions: 'K2',
    planets: '500+',
    icon: '🌟'
  }
];