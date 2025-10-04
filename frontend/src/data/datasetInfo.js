export const datasetInfo = { 
  cumulative: { 
    title: 'NASA Exoplanet Archive (Cumulative Table)', 
    description: `
      The cumulative table is the primary catalog of confirmed exoplanets maintained by the NASA Exoplanet Archive. 
      It combines discoveries from multiple detection methods (transits, radial velocity, direct imaging, microlensing, etc.) 
      and across many missions and ground-based surveys. Each entry contains standardized parameters such as orbital period, 
      planet radius, equilibrium temperature, and host star properties. Because it spans all major exoplanet surveys, 
      it is the most comprehensive single dataset available to the community. 
      
      Researchers and educators use the cumulative table as the go-to reference for population-level studies, statistical trends, 
      and up-to-date counts of exoplanets. With thousands of entries and regular updates, it highlights both the diversity 
      of planetary systems and the evolving techniques that drive new discoveries.
    `, 
    missionYears: '1992–Present', 
    planetsDiscovered: '5,000+ confirmed', 
    keyFeatures: [
      'Cross-mission aggregation of all confirmed planets',
      'Standardized stellar and planetary parameters',
      'Supports statistical population studies'
    ], 
    graphs: [
      '/kelper1.png',
      '/kelper2.png',
      '/kelper3.png'
    ] 
  }, 

  k2: { 
    title: 'K2 Planets and Candidates', 
    description: `
      The K2 mission was the extended phase of Kepler, conducted after the spacecraft lost two reaction wheels. 
      Instead of staring at a single patch of sky, K2 observed a sequence of 19 different fields along the ecliptic plane. 
      This strategy allowed the mission to discover planets around a much wider range of stellar environments, 
      including bright nearby stars, evolved red giants, and even members of open clusters. 
      
      Though its observation windows were shorter than Kepler’s, K2 made important contributions: 
      it expanded the census of small planets, probed stellar activity in varied populations, 
      and provided high-quality light curves for astrophysical studies well beyond exoplanets. 
      K2 demonstrated that exoplanet science could continue even with limited spacecraft functionality, 
      leaving behind a dataset that is rich, diverse, and complementary to Kepler’s original survey.
    `, 
    missionYears: '2014–2018',  
    planetsDiscovered: '500+ confirmed and candidates', 
    keyFeatures: [
      'Observed 19 different sky regions',
      'Targets included bright stars and stellar clusters',
      'Extended Kepler’s mission despite hardware loss'
    ], 
    graphs: [
      '/k21.png',
      '/k22.png',
      '/k23.png'
    ] 
  }, 

  toi: { 
    title: 'TESS Objects of Interest (TOI)',  
    description: `
      The TESS Objects of Interest (TOI) catalog lists candidate planets identified by the Transiting Exoplanet Survey Satellite. 
      Unlike confirmed planets, TOIs are signals that look planetary but require additional validation through follow-up observations. 
      TESS’s wide-field survey strategy has produced thousands of these candidates around some of the brightest stars in the sky, 
      making them prime targets for atmospheric characterization with telescopes such as Hubble, JWST, and ground-based facilities. 
      
      The TOI catalog is dynamic: candidates are regularly added, updated, or retired as more data comes in. 
      It is an essential tool for the community because it shows where the next generation of exoplanet discoveries will emerge. 
      Many of today’s confirmed TESS planets started as TOIs, and the catalog continues to guide high-priority follow-up efforts worldwide.
    `, 
    missionYears: '2018–Present', 
    planetsDiscovered: '7,000+ candidates (hundreds confirmed)', 
    keyFeatures: [
      'Rapid candidate identification',
      'Hosts are bright, nearby stars',
      'Feeds confirmation pipeline and JWST targets'
    ], 
    graphs: [
      '/tess1.png',
      '/tess2.png',
      '/tess3.png'
    ]
  } 
};
