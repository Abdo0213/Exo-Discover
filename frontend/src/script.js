
// Three.js setup
let scene, camera, renderer, controls;
let raycaster, mouse;
let planets = [];
let deletedPlanets = [];
let sun;
let globalSpeed = 1;
let particles = [];
let cameraShake = { intensity: 0, duration: 0 };
let isIntroSequence = false;
let introIndex = 0;
const introOrder = ['Sun', 'Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'];
let currentAudio = null;

// UI elements
const infoPanel = document.getElementById('infoPanel');
const speedSlider = document.getElementById('speedSlider');
const planetUL = document.getElementById('planetUL');
const restorePlanetSelect = document.getElementById('restorePlanetSelect');
const restorePlanetBtn = document.getElementById('restorePlanetBtn');

// Initialize Three.js
function init() {
  // Scene
  scene = new THREE.Scene();
  
  // Add starfield background
  createStarfield();
  
  // Camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
  camera.position.set(0, 200, 400);
  camera.lookAt(0, 0, 0);
  
  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.getElementById('container').appendChild(renderer.domElement);
  
  // Raycaster for mouse interaction
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();
  
  // Controls (manual camera controls)
  setupCameraControls();
  
  // Create sun
  createSun();
  
  // Create planets
  // createDefaultPlanets();
  startIntroSequence();

  // Event listeners
  window.addEventListener('resize', onWindowResize);
  renderer.domElement.addEventListener('click', onMouseClick);
  renderer.domElement.addEventListener('mousemove', onMouseMove);
  
  // UI event listeners
  setupUIControls();
  
  // Start animation
  animate();
}

function createStarfield() {
  const starsGeometry = new THREE.BufferGeometry();
  const starsMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 1,
    transparent: true
  });
  
  const starsVertices = [];
  for (let i = 0; i < 10000; i++) {
    const x = (Math.random() - 0.5) * 4000;
    const y = (Math.random() - 0.5) * 4000;
    const z = (Math.random() - 0.5) * 4000;
    starsVertices.push(x, y, z);
  }
  
  starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
  const stars = new THREE.Points(starsGeometry, starsMaterial);
  scene.add(stars);
}

function setupCameraControls() {
  let isMouseDown = false;
  let mouseX = 0, mouseY = 0;
  let cameraRadius = camera.position.length();
  let cameraTheta = Math.atan2(camera.position.z, camera.position.x); // horizontal angle
  let cameraPhi = Math.acos(camera.position.y / cameraRadius); // vertical angle
  
  renderer.domElement.addEventListener('mousedown', (event) => {
    isMouseDown = true;
    mouseX = event.clientX;
    mouseY = event.clientY;
    event.preventDefault();
  });
  
  renderer.domElement.addEventListener('mouseup', (event) => {
    isMouseDown = false;
    event.preventDefault();
  });
  
  renderer.domElement.addEventListener('mouseleave', (event) => {
    isMouseDown = false;
  });
  
  renderer.domElement.addEventListener('mousemove', (event) => {
    if (isMouseDown) {
      const deltaX = event.clientX - mouseX;
      const deltaY = event.clientY - mouseY;
      
      // Adjust sensitivity
      const sensitivity = 0.005;
      
      // Update angles
      cameraTheta -= deltaX * sensitivity;
      cameraPhi += deltaY * sensitivity;
      
      // Constrain vertical angle to prevent flipping
      cameraPhi = Math.max(0.1, Math.min(Math.PI - 0.1, cameraPhi));
      
      // Update camera position using spherical coordinates
      camera.position.x = cameraRadius * Math.sin(cameraPhi) * Math.cos(cameraTheta);
      camera.position.y = cameraRadius * Math.cos(cameraPhi);
      camera.position.z = cameraRadius * Math.sin(cameraPhi) * Math.sin(cameraTheta);
      
      camera.lookAt(0, 0, 0);
      
      mouseX = event.clientX;
      mouseY = event.clientY;
    }
  });
  
  // Disable context menu on right click
  renderer.domElement.addEventListener('contextmenu', (event) => {
    event.preventDefault();
  });
  
  // Mouse wheel zoom
  renderer.domElement.addEventListener('wheel', (event) => {
    event.preventDefault();
    const zoomSpeed = 20;
    const direction = event.deltaY > 0 ? 1 : -1;
    
    cameraRadius *= (1 + direction * zoomSpeed * 0.001);
    
    // Limit zoom
    cameraRadius = Math.max(50, Math.min(1500, cameraRadius));
    
    // Update camera position
    camera.position.x = cameraRadius * Math.sin(cameraPhi) * Math.cos(cameraTheta);
    camera.position.y = cameraRadius * Math.cos(cameraPhi);
    camera.position.z = cameraRadius * Math.sin(cameraPhi) * Math.sin(cameraTheta);
    
    camera.lookAt(0, 0, 0);
  });
}

function createSun() {
  const sunGeometry = new THREE.SphereGeometry(20, 32, 32);
  const sunMaterial = new THREE.MeshBasicMaterial({
    color: 0xffaa00,
    emissive: 0xff4400,
    emissiveIntensity: 0.3
  });
  
  sun = new THREE.Mesh(sunGeometry, sunMaterial);
  sun.userData = {
    name: 'Sun',
    type: 'Star',
    info: `
      1. The Sun is a huge, glowing ball of hot gas at the center of our Solar System.<br>
      2. It is so heavy that it holds all planets in their orbits with its gravity.<br>
      3. Its radius is 696,340 km – imagine 109 Earths lined up across it!<br>
      4. The core is extremely hot: around 15 million °C, hotter than any oven.<br>
      5. The surface is cooler but still very hot: about 5,500 °C.<br>
      6. The Sun makes light and heat through a process called nuclear fusion.<br>
      7. Sunlight takes about 8 minutes to reach Earth, even though it travels super fast.<br>
      8. Sunspots are cooler, darker spots on the Sun's surface.<br>
      9. Solar flares are like space fireworks that can affect satellites on Earth.<br>
      10. The Sun has a strong magnetic field that twists and dances.<br>
      11. It contains 99.86% of all the mass in our Solar System.<br>
      12. The Sun is about 4.6 billion years old and will shine for another 5 billion years!
    `,
    gravity: 274,
    water: 'No',
    radius: 20,
    mass: 1000,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/The_Sun_by_the_Atmospheric_Imaging_Assembly_of_NASA%27s_Solar_Dynamics_Observatory_-_20100819.jpg/240px-The_Sun_by_the_Atmospheric_Imaging_Assembly_of_NASA%27s_Solar_Dynamics_Observatory_-_20100819.jpg'
  };
  
  scene.add(sun);
  
  // Add sun light
  const sunLight = new THREE.PointLight(0xffffaa, 1, 1000);
  sunLight.position.set(0, 0, 0);
  sunLight.castShadow = true;
  scene.add(sunLight);
  
  // Add ambient light
  const ambientLight = new THREE.AmbientLight(0x404040, 0.1);
  scene.add(ambientLight);
}

// Planet data
const planetData = {
  Mercury: { color: 0xa9a9a9, size: 4, distance: 40, mass: 5, moons: 0, speed: 0.02 },
  Venus: { color: 0xffcc66, size: 6, distance: 60, mass: 8, moons: 0, speed: 0.015 },
  Earth: { color: 0x3399ff, size: 7, distance: 80, mass: 10, moons: 1, speed: 0.01 },
  Mars: { color: 0xff3300, size: 5, distance: 100, mass: 8, moons: 2, speed: 0.008 },
  Jupiter: { color: 0xff9966, size: 14, distance: 140, mass: 40, moons: 4, speed: 0.005 },
  Saturn: { color: 0xffcc99, size: 13, distance: 180, mass: 35, moons: 3, speed: 0.004 },
  Uranus: { color: 0x66ccff, size: 9, distance: 220, mass: 20, moons: 2, speed: 0.003 },
  Neptune: { color: 0x3366ff, size: 9, distance: 260, mass: 20, moons: 1, speed: 0.002 }
};

const planetFacts = {
  Mercury: {
    info: `
      1. Mercury is the closest planet to the Sun.<br>
      2. It is small, rocky, and has no moons.<br>
      3. The surface is covered with craters, like our Moon.<br>
      4. Its radius is 2,439.7 km – very tiny compared to Earth.<br>
      5. It has very weak gravity: 3.7 m/s².<br>
      6. Mercury is super hot during the day and freezing at night.<br>
      7. Temperature ranges from -173°C at night to 427°C during the day.<br>
      8. It spins slowly – one day lasts 59 Earth days.<br>
      9. It races around the Sun in just 88 Earth days.<br>
      10. Named after the Roman messenger god because it moves fast.<br>
      11. No water on Mercury – it's dry and rocky.<br>
      12. Children can imagine it as a little speedy ball close to the Sun.
    `,
    gravity: 3.7,
    water: 'No',
    farthest: 57.9,
    type: 'Rocky',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Mercury_in_color_-_Prockter07_centered.jpg/240px-Mercury_in_color_-_Prockter07_centered.jpg'
  },
  Venus: {
    info: `
      1. Venus is the second planet from the Sun.<br>
      2. It spins backwards compared to most planets.<br>
      3. It is very hot, hotter than an oven – around 465°C.<br>
      4. The surface is hidden under thick clouds of acid.<br>
      5. Venus has no moons.<br>
      6. Radius: 6,051.8 km – slightly smaller than Earth.<br>
      7. Gravity: 8.87 m/s².<br>
      8. A day on Venus is longer than its year!<br>
      9. Named after the Roman goddess of love.<br>
      10. Children can imagine a cloudy, hot world spinning slowly.<br>
      11. No water – too hot for oceans.<br>
      12. It is very bright in the sky, called the "Morning Star" or "Evening Star".
    `,
    gravity: 8.87,
    water: 'No',
    farthest: 108.2,
    type: 'Rocky',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Venus-real_color.jpg/240px-Venus-real_color.jpg'
  },
  Earth: {
    info: `
      1. Earth is our home planet.<br>
      2. It has water, air, plants, animals, and people.<br>
      3. Radius: 6,371 km – our size reference.<br>
      4. Gravity: 9.8 m/s² – perfect for walking and jumping.<br>
      5. One moon: the Moon, lights up our night sky.<br>
      6. Orbital period: 365 days – that's one year.<br>
      7. Rotation period: 24 hours – one day.<br>
      8. Surface has mountains, oceans, forests, and deserts.<br>
      9. Atmosphere protects life from the Sun's harmful rays.<br>
      10. Children can imagine Earth as a blue and green ball full of life.<br>
      11. Water is everywhere – oceans, rivers, and lakes.<br>
      12. Named after ancient Earth goddesses.
    `,
    gravity: 9.8,
    water: 'Yes',
    farthest: 149.6,
    type: 'Rocky',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/The_Earth_seen_from_Apollo_17.jpg/240px-The_Earth_seen_from_Apollo_17.jpg'
  },
  Mars: {
    info: `
      1. Mars is the Red Planet.<br>
      2. Distance from Sun: 227.9 million km.<br>
      3. Radius: 3,396.2 km – half the size of Earth.<br>
      4. Gravity: 3.71 m/s² – jump higher than on Earth.<br>
      5. Has two moons: Phobos and Deimos.<br>
      6. Evidence of ice water in the past.<br>
      7. Tallest volcano: Olympus Mons – like a giant mountain.<br>
      8. Surface is dusty and red, full of rocks.<br>
      9. Orbital period: 687 Earth days.<br>
      10. Rotation period: 24.6 hours – almost like Earth's day.<br>
      11. Children can imagine astronauts exploring its volcanoes.<br>
      12. Named after Roman god of war.
    `,
    gravity: 3.71,
    water: 'Ice',
    farthest: 227.9,
    type: 'Rocky',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/OSIRIS_Mars_true_color.jpg/240px-OSIRIS_Mars_true_color.jpg'
  },
  Jupiter: {
    info: `
      1. Jupiter is the biggest planet in our Solar System.<br>
      2. Distance from Sun: 778.5 million km.<br>
      3. Radius: 69,911 km – so big 1,300 Earths could fit inside!<br>
      4. Gravity: 24.79 m/s² – much stronger than Earth.<br>
      5. Has 97 moons – including Ganymede, the largest in the Solar System.<br>
      6. Made mostly of gas; no solid surface.<br>
      7. Great Red Spot: a giant storm bigger than Earth.<br>
      8. Orbital period: 12 Earth years.<br>
      9. Rotation period: ~10 hours – spins very fast.<br>
      10. Children can imagine it as a huge stormy ball.<br>
      11. No water on Jupiter.<br>
      12. Named after Roman king of gods.
    `,
    gravity: 24.79,
    water: 'No',
    farthest: 778.5,
    type: 'Gas Giant',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Jupiter_and_its_shrunken_Great_Red_Spot.jpg/240px-Jupiter_and_its_shrunken_Great_Red_Spot.jpg'
  },
  Saturn: {
    info: `
      1. Saturn is famous for its beautiful rings.<br>
      2. Distance from Sun: 1.429 billion km.<br>
      3. Radius: 58,232 km – huge, but less dense than water.<br>
      4. Gravity: 10.44 m/s².<br>
      5. Has 82 moons – Titan is the biggest.<br>
      6. Made mostly of hydrogen and helium.<br>
      7. Rings are made of ice and rock pieces.<br>
      8. Orbital period: 29.5 Earth years.<br>
      9. Rotation period: ~10.7 hours – spins fast.<br>
      10. Children can imagine a giant planet with sparkling rings.<br>
      11. No water on the planet itself.<br>
      12. Named after Roman god of agriculture.
    `,
    gravity: 10.44,
    water: 'No',
    farthest: 1429,
    type: 'Gas Giant',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Saturn_during_Equinox.jpg/480px-Saturn_during_Equinox.jpg'
  },
  Uranus: {
    info: `
      1. Uranus is an ice giant.<br>
      2. Distance from Sun: 2.871 billion km.<br>
      3. Radius: 25,362 km.<br>
      4. Gravity: 8.69 m/s².<br>
      5. Has 27 moons.<br>
      6. Ice and methane give it a blue-green color.<br>
      7. Rotates on its side like a rolling ball.<br>
      8. Very cold: ~-224°C.<br>
      9. Orbital period: 84 Earth years.<br>
      10. Rotation period: ~17 hours.<br>
      11. Children can imagine it spinning sideways in space.<br>
      12. Named after Greek god of sky.
    `,
    gravity: 8.69,
    water: 'No',
    farthest: 2871,
    type: 'Ice Giant',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Uranus2.jpg/240px-Uranus2.jpg'
  },
  Neptune: {
    info: `
      1. Neptune is the farthest planet in our Solar System.<br>
      2. Distance from Sun: 4.495 billion km.<br>
      3. Radius: 24,622 km.<br>
      4. Gravity: 11.15 m/s².<br>
      5. Has 14 moons – largest is Triton.<br>
      6. Ice and methane give it a deep blue color.<br>
      7. Strongest winds in the Solar System: up to 2,100 km/h.<br>
      8. Orbital period: 165 Earth years.<br>
      9. Rotation period: ~16 hours.<br>
      10. Children can imagine a windy, blue ice ball.<br>
      11. No water on the planet itself.<br>
      12. Named after Roman god of the sea.
    `,
    gravity: 11.15,
    water: 'No',
    farthest: 4495,
    type: 'Ice Giant',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Neptune_Full.jpg/240px-Neptune_Full.jpg'
  }
};
const planetAudio = {
  Sun: 'audio/sun.mp3',
  Mercury: 'audio/mercury.mp3',
  Venus: 'audio/venus.mp3',
  Earth: 'audio/earth.mp3',
  Mars: 'audio/mars.mp3',
  Jupiter: 'audio/jupiter.mp3',
  Saturn: 'audio/saturn.mp3',
  Uranus: 'audio/uranus.mp3',
  Neptune: 'audio/neptune.mp3'
};

class Planet3D {
  constructor(name, data) {
    this.name = name;
    this.data = data;
    this.angle = Math.random() * Math.PI * 2;
    this.rotationSpeed = 0.01;
    
    // Create planet geometry and material
    const geometry = new THREE.SphereGeometry(data.size, 32, 32);
    const material = new THREE.MeshLambertMaterial({ 
      color: data.color,
      transparent: true,
      opacity: 0.9
    });
    
    this.mesh = new THREE.Mesh(geometry, material);
    // this.mesh.position.set(
    //   Math.cos(this.angle) * data.distance,
    //   0,
    //   Math.sin(this.angle) * data.distance
    // );

    // Store the orbital position for later
    this.orbitalX = Math.cos(this.angle) * data.distance;
    this.orbitalZ = Math.sin(this.angle) * data.distance;

    // Start at center for intro animation
    this.mesh.position.set(
      this.orbitalX,
      0,
      this.orbitalZ
    );


    
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    
    // Store planet info in userData
    const facts = planetFacts[name] || {};
    this.mesh.userData = {
      name: name,
      type: facts.type || 'Unknown',
      info: facts.info || `${name} is a mysterious world!`,
      gravity: facts.gravity || (data.mass * 0.5),
      water: facts.water || 'Unknown',
      farthest: facts.farthest || data.distance,
      radius: data.size,
      mass: data.mass,
      distance: data.distance,
      moons: [],
      image: facts.image || null
    };
    
    scene.add(this.mesh);
    
    // Create orbit line
    this.createOrbitLine();
    
    // Create moons
    this.createMoons();
    
    // Create rings for Saturn
    if (name === 'Saturn') {
      this.createRings();
    }
  }
  
  createOrbitLine() {
    const curve = new THREE.EllipseCurve(
      0, 0,
      this.data.distance, this.data.distance,
      0, 2 * Math.PI,
      false,
      0
    );
    
    const points = curve.getPoints(128);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ 
      color: 0x444444,
      transparent: true,
      opacity: 0.3
    });
    
    this.orbitLine = new THREE.Line(geometry, material);
    this.orbitLine.rotation.x = -Math.PI / 2;
    scene.add(this.orbitLine);
  }
  
  createMoons() {
    this.moons = [];
    const moonCount = this.data.moons;
    
    for (let i = 0; i < moonCount; i++) {
      const moonSize = Math.max(0.5, this.data.size * 0.15);
      const moonDistance = this.data.size + 8 + i * 5;
      
      const moonGeometry = new THREE.SphereGeometry(moonSize, 16, 16);
      const moonMaterial = new THREE.MeshLambertMaterial({ color: 0xcccccc });
      const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
      
      const moon = {
        mesh: moonMesh,
        distance: moonDistance,
        angle: Math.random() * Math.PI * 2,
        speed: 0.05 + Math.random() * 0.03,
        name: this.name === 'Earth' ? 'Moon' : 
              this.name === 'Mars' ? (i === 0 ? 'Phobos' : 'Deimos') : 
              `Moon ${i + 1}`
      };
      
      moonMesh.userData = {
        name: moon.name,
        type: 'Moon',
        info: `${moon.name} is a moon of ${this.name}`,
        parentPlanet: this.name
      };
      
      moonMesh.castShadow = true;
      moonMesh.receiveShadow = true;
      
      this.moons.push(moon);
      this.mesh.userData.moons.push(moon);
      scene.add(moonMesh);
    }
  }
  
  createRings() {
    const ringGeometry = new THREE.RingGeometry(this.data.size + 2, this.data.size + 8, 32);
    const ringMaterial = new THREE.MeshLambertMaterial({ 
      color: 0xffffaa,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide
    });
    
    this.rings = new THREE.Mesh(ringGeometry, ringMaterial);
    this.rings.rotation.x = -Math.PI / 2 + 0.3;
    this.mesh.add(this.rings);
  }
  
  update() {
    // Update planet position
    this.angle += this.data.speed * globalSpeed;
    this.mesh.position.set(
      Math.cos(this.angle) * this.data.distance,
      0,
      Math.sin(this.angle) * this.data.distance
    );
    
    // Rotate planet
    this.mesh.rotation.y += this.rotationSpeed;
    
    // Update moons
    for (let moon of this.moons) {
      moon.angle += moon.speed * globalSpeed;
      const moonX = this.mesh.position.x + Math.cos(moon.angle) * moon.distance;
      const moonY = this.mesh.position.y;
      const moonZ = this.mesh.position.z + Math.sin(moon.angle) * moon.distance;
      moon.mesh.position.set(moonX, moonY, moonZ);
      moon.mesh.rotation.y += 0.02;
    }
  }
  
  destroy() {
    scene.remove(this.mesh);
    scene.remove(this.orbitLine);
    
    for (let moon of this.moons) {
      scene.remove(moon.mesh);
    }
    
    if (this.rings) {
      this.mesh.remove(this.rings);
    }
  }
}

function createDefaultPlanets() {
  planets = [];
  const planetNames = ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'];
  
  for (let name of planetNames) {
    const planet = new Planet3D(name, planetData[name]);
    planets.push(planet);
  }
  
  refreshPlanetList();
}

function startIntroSequence() {
  isIntroSequence = true;
  introIndex = 0;
  planets = [];
  
  // Hide the sun initially
  sun.scale.set(0, 0, 0);
  
  // Start with the sun after a brief delay
  setTimeout(() => {
    introduceCelestialBody();
  }, 1000);
}

function introduceCelestialBody() {
  const currentName = introOrder[introIndex];
  
  if (currentName === 'Sun') {
    // Animate sun appearance
    animateSunAppearance();
  } else {
    // Create and animate planet
    const planet = new Planet3D(currentName, planetData[currentName]);
    // planet.mesh.scale.set(0, 0, 0); // Start invisible
    planets.push(planet);
    animatePlanetAppearance(planet);
  }
}

function animateSunAppearance() {
  // Show info panel
  showIntroInfo(sun.userData);
  
  // Start sun below the scene
  sun.position.y = -200;
  sun.scale.set(1, 1, 1);
  
  // Animate sun rising up
  let currentY = -200;
  const animateUp = setInterval(() => {
    currentY += 5;
    sun.position.y = currentY;
    
    if (currentY >= 0) {
      clearInterval(animateUp);
      sun.position.y = 0;
      
      // Wait 4 seconds then move to next
      setTimeout(() => {
        infoPanel.style.display = 'none';
        introIndex++;
        if (introIndex < introOrder.length) {
          introduceCelestialBody();
        } else {
          finishIntroSequence();
        }
      }, 4000);
    }
  }, 30);
}

function animatePlanetAppearance(planet) {
  // Show info panel
  showIntroInfo(planet.mesh.userData);
  
  // Store the target position
  const targetX = planet.mesh.position.x;
  const targetZ = planet.mesh.position.z;
  
  // Start planet below the scene
  planet.mesh.position.y = -200;
  planet.mesh.scale.set(1, 1, 1);
  
  // Animate planet rising up
  let currentY = -200;
  const animateUp = setInterval(() => {
    currentY += 5;
    planet.mesh.position.y = currentY;
    
    if (currentY >= 0) {
      clearInterval(animateUp);
      planet.mesh.position.y = 0;
      
      // Wait 4 seconds then move to next
      setTimeout(() => {
        infoPanel.style.display = 'none';
        introIndex++;
        if (introIndex < introOrder.length) {
          introduceCelestialBody();
        } else {
          finishIntroSequence();
        }
      }, 4000);
    }
  }, 30);
}
function finishIntroSequence() {
  isIntroSequence = false;
  refreshPlanetList();
  infoPanel.style.display = 'none';
}

function showIntroInfo(obj) {
  infoPanel.style.display = 'block';
  
  // Create brief intro version
  let briefInfo = '';
  
  if (obj.name === 'Sun') {
    briefInfo = `
      <h2 style="text-align:center;">☀️ ${obj.name}</h2>
      ${obj.image ? `<img src="${obj.image}" style="width:100%; border-radius:8px; margin-bottom:15px;">` : ''}
      <p style="font-size:16px; text-align:center;"><strong>The Sun is a giant ball of fire that gives us light and warmth!</strong></p>
      <p>🔥 Temperature: 15 million °C in the core</p>
      <p>⭐ It's a star, not a planet</p>
      <p>🌍 Holds all planets with its gravity</p>
    `;
  } else {
    briefInfo = `
      <h2 style="text-align:center;">🪐 ${obj.name}</h2>
      ${obj.image ? `<img src="${obj.image}" style="width:100%; border-radius:8px; margin-bottom:15px;">` : ''}
      <p style="font-size:16px; text-align:center;"><strong>${obj.name} is the ${getOrdinal(introIndex)} planet from the Sun!</strong></p>
      <p>🎨 Type: ${obj.type}</p>
      <p>🌙 Moons: ${obj.moons.length}</p>
      <p>💧 Water: ${obj.water}</p>
    `;
  }
  
  infoPanel.innerHTML = briefInfo;
}

function getOrdinal(n) {
  const ordinals = ['', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth'];
  return ordinals[n] || n + 'th';
}



function createExplosion(position, planetSize = 10) {
  // Create more particles based on planet size
  const particleCount = Math.min(200, 50 + planetSize * 5);
  
  for (let i = 0; i < particleCount; i++) {
    const particleGeometry = new THREE.SphereGeometry(Math.random() * 2 + 0.5, 8, 8);
    const particleMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color().setHSL(Math.random() * 0.2 + 0.05, 1, 0.5 + Math.random() * 0.5)
    });
    
    const particle = new THREE.Mesh(particleGeometry, particleMaterial);
    particle.position.copy(position);
    
    const speed = 15 + Math.random() * 25;
    const velocity = new THREE.Vector3(
      (Math.random() - 0.5) * speed,
      (Math.random() - 0.5) * speed,
      (Math.random() - 0.5) * speed
    );
    
    particle.userData = {
      velocity: velocity,
      life: 80 + Math.random() * 40,
      maxLife: 80 + Math.random() * 40
    };
    
    particles.push(particle);
    scene.add(particle);
  }
  
  // Add camera shake
  cameraShake.intensity = Math.min(15, planetSize * 0.8);
  cameraShake.duration = 30;
}

function updateCameraShake() {
  if (cameraShake.duration > 0) {
    // Apply random shake to camera position
    const shakeX = (Math.random() - 0.5) * cameraShake.intensity;
    const shakeY = (Math.random() - 0.5) * cameraShake.intensity;
    const shakeZ = (Math.random() - 0.5) * cameraShake.intensity;
    
    camera.position.x += shakeX;
    camera.position.y += shakeY;
    camera.position.z += shakeZ;
    
    // Reduce shake over time
    cameraShake.duration--;
    cameraShake.intensity *= 0.95;
  }
}



function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    const particle = particles[i];
    
    particle.position.add(particle.userData.velocity);
    particle.userData.velocity.multiplyScalar(0.98); // Friction
    particle.userData.life--;
    
    const alpha = particle.userData.life / particle.userData.maxLife;
    particle.material.opacity = alpha;
    particle.material.transparent = true;
    
    if (particle.userData.life <= 0) {
      scene.remove(particle);
      particles.splice(i, 1);
    }
  }
}

function checkCollisions() {
  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const planet1 = planets[i];
      const planet2 = planets[j];
      
      const distance = planet1.mesh.position.distanceTo(planet2.mesh.position);
      const combinedRadius = planet1.data.size + planet2.data.size;
      
      if (distance < combinedRadius) {
        // Collision detected
        const collisionPoint = planet1.mesh.position.clone().lerp(planet2.mesh.position, 0.5);
        const maxSize = Math.max(planet1.data.size, planet2.data.size);
        createExplosion(collisionPoint, maxSize);
      
        // Merge planets (keep the larger one)
        let survivor, absorbed;
        if (planet1.data.mass >= planet2.data.mass) {
          survivor = planet1;
          absorbed = planet2;
        } else {
          survivor = planet2;
          absorbed = planet1;
        }
        
        // Update survivor properties
        survivor.data.mass += absorbed.data.mass;
        survivor.data.size = Math.pow(survivor.data.mass / 10, 0.33) * 7; // New size based on mass
        
        // Update mesh scale
        const scale = survivor.data.size / survivor.mesh.geometry.parameters.radius;
        survivor.mesh.scale.setScalar(scale);
        
        // Remove absorbed planet
        absorbed.destroy();
        planets.splice(planets.indexOf(absorbed), 1);
        
        refreshPlanetList();
        break;
      }
    }
  }
}

function refreshPlanetList() {
  planetUL.innerHTML = '';
  planets.forEach((planet, i) => {
    const li = document.createElement('li');
    li.textContent = `${planet.name} (${planet.mesh.userData.type})`;
    li.onclick = () => {
  // Create dramatic explosion at planet position
  createExplosion(planet.mesh.position, planet.data.size);
  
  // Add to deleted planets list (preserving restore functionality)
  deletedPlanets.push(planet.name);
  updateRestorePlanetSelect();
  
  // Remove planet after brief delay for effect
  setTimeout(() => {
    planet.destroy();
    planets.splice(i, 1);
    refreshPlanetList();
  }, 100);
};
    planetUL.appendChild(li);
  });
}

function updateRestorePlanetSelect() {
  restorePlanetSelect.innerHTML = '<option value="">Select a planet to restore</option>';
  deletedPlanets.forEach(planetName => {
    const option = document.createElement('option');
    option.value = planetName;
    option.textContent = planetName;


    restorePlanetSelect.appendChild(option);
  });
}

function setupUIControls() {
  // Speed slider
  speedSlider.oninput = () => {
    globalSpeed = parseFloat(speedSlider.value);
  };
  
  // Reset button
  // document.getElementById('resetBtn').onclick = () => {
  //   // Clear existing planets
  //   planets.forEach(planet => planet.destroy());
  //   planets = [];
  //   deletedPlanets = [];
    
  //   // Clear particles
  //   particles.forEach(particle => scene.remove(particle));
  //   particles = [];
    
  //   // Reset camera
  //   camera.position.set(0, 200, 400);
  //   camera.lookAt(0, 0, 0);
    
  //   // Create new planets
  //   createDefaultPlanets();
  //   updateRestorePlanetSelect();
  //   infoPanel.style.display = 'none';
  // };
  // Replace the existing resetBtn.onclick with:
document.getElementById('resetBtn').onclick = () => {
  // Clear existing planets
  planets.forEach(planet => planet.destroy());
  planets = [];
  deletedPlanets = [];
  
  // Clear particles
  particles.forEach(particle => scene.remove(particle));
  particles = [];
  
  // Reset camera
  camera.position.set(0, 200, 400);
  camera.lookAt(0, 0, 0);
  
  // Start intro sequence instead of creating planets directly
  startIntroSequence();
  
  updateRestorePlanetSelect();
  infoPanel.style.display = 'none';
};


  // Toggle planet list
  document.getElementById('toggleListBtn').onclick = () => {
    const list = document.getElementById('planetList');
    list.open = !list.open;
  };
  
  // Camera controls
  // Camera controls
document.getElementById('zoomInBtn').onclick = () => {
  camera.position.multiplyScalar(0.8);
  const distance = camera.position.length();
  if (distance < 50) camera.position.normalize().multiplyScalar(50);
  camera.lookAt(0, 0, 0);
};

document.getElementById('zoomOutBtn').onclick = () => {
  camera.position.multiplyScalar(1.25);
  const distance = camera.position.length();
  if (distance > 1500) camera.position.normalize().multiplyScalar(1500);
  camera.lookAt(0, 0, 0);
};

document.getElementById('resetCameraBtn').onclick = () => {
  camera.position.set(0, 200, 400);
  camera.lookAt(0, 0, 0);
};


  // Restore planet
  document.getElementById('restorePlanetBtn').onclick = () => {
    const planetName = restorePlanetSelect.value;
    if (!planetName) return;
    
    const index = deletedPlanets.indexOf(planetName);
    if (index > -1) {
      deletedPlanets.splice(index, 1);
      
      const planet = new Planet3D(planetName, planetData[planetName]);
      planets.push(planet);
      
      refreshPlanetList();
      updateRestorePlanetSelect();
    }
  };
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  
  // Update raycaster
  raycaster.setFromCamera(mouse, camera);
  
  // Check for intersections
  const allObjects = [sun, ...planets.map(p => p.mesh)];
  
  // Add moons to check
  planets.forEach(planet => {
    planet.moons.forEach(moon => {
      allObjects.push(moon.mesh);
    });
  });
  
  const intersects = raycaster.intersectObjects(allObjects);
  
  // Change cursor on hover
  if (intersects.length > 0) {
    document.body.style.cursor = 'pointer';
  } else {
    document.body.style.cursor = 'default';
  }
}

function onMouseClick(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  
  raycaster.setFromCamera(mouse, camera);
  
  // Check for intersections
  const allObjects = [sun, ...planets.map(p => p.mesh)];
  
  // Add moons to check
  planets.forEach(planet => {
    planet.moons.forEach(moon => {
      allObjects.push(moon.mesh);
    });
  });
  
  const intersects = raycaster.intersectObjects(allObjects);
  
  if (intersects.length > 0) {
    const clickedObject = intersects[0].object;
    showInfoPanel(clickedObject.userData);
  } else {
    infoPanel.style.display = 'none';
  }
}

// function showInfoPanel(obj) {
//   infoPanel.style.display = 'block';
  
//   // Stop any currently playing audio
//   if (currentAudio) {
//     currentAudio.pause();
//     currentAudio.currentTime = 0;
//   }
  
//   let panelContent = '';
  
//   if (obj.name === 'Sun') {
//     panelContent = `
//       <h3>☀️ ${obj.name}</h3>
//       ${obj.image ? `<img src="${obj.image}" style="width:100%; border-radius:8px; margin-bottom:15px;">` : ''}
//       <p>${obj.info}</p>
//       <p><strong>Radius:</strong> ${obj.radius} (scaled)</p>
//       <p><strong>Mass:</strong> ${obj.mass}</p>
//       <p><strong>Gravity:</strong> ${obj.gravity} m/s²</p>
//       <p><strong>Water:</strong> ${obj.water}</p>
//       <p><strong>Type:</strong> ${obj.type}</p>
//     `;
//   } else if (obj.type === 'Moon') {
//     panelContent = `
//       <h3>🌙 ${obj.name}</h3>
//       <p>${obj.info}</p>
//       <p><strong>Parent Planet:</strong> ${obj.parentPlanet}</p>
//       <p><strong>Type:</strong> ${obj.type}</p>
//     `;
//   } else {
//     panelContent = `
//       <h3>🪐 ${obj.name}</h3>
//       ${obj.image ? `<img src="${obj.image}" style="width:100%; border-radius:8px; margin-bottom:15px;">` : ''}
//       <p>${obj.info}</p>
//       <p><strong>Radius:</strong> ${obj.radius} (scaled)</p>
//       <p><strong>Mass:</strong> ${obj.mass}</p>
//       <p><strong>Distance from Sun:</strong> ${Math.round(obj.distance)}</p>
//       <p><strong>Gravity:</strong> ${obj.gravity} m/s²</p>
//       <p><strong>Water:</strong> ${obj.water}</p>
//       <p><strong>Farthest from Sun:</strong> ${obj.farthest} million km</p>
//       <p><strong>Number of Moons:</strong> ${obj.moons.length}</p>
//       <p><strong>Type:</strong> ${obj.type}</p>
//     `;
//   }
  
//   infoPanel.innerHTML = panelContent;
// }

function showInfoPanel(obj) {
  infoPanel.style.display = 'block';
  
  // Stop any currently playing audio
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }
  
  let panelContent = '';
  
  // Add mic button at the top
  const audioPath = planetAudio[obj.name];
  const micButton = audioPath ? `
    <div style="text-align: center; margin-bottom: 15px;">
      <button id="audioBtn" style="
        background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        cursor: pointer;
        font-size: 24px;
        transition: all 0.3s;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
      " onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
        🎤
      </button>
      <p style="font-size: 11px; color: #ccc; margin-top: 5px;">Click to hear me speak!</p>
    </div>
  ` : '';
  
  if (obj.name === 'Sun') {
    panelContent = `
      ${micButton}
      <h3>☀️ ${obj.name}</h3>
      ${obj.image ? `<img src="${obj.image}" style="width:100%; border-radius:8px; margin-bottom:15px;">` : ''}
      <p>${obj.info}</p>
      <p><strong>Radius:</strong> ${obj.radius} (scaled)</p>
      <p><strong>Mass:</strong> ${obj.mass}</p>
      <p><strong>Gravity:</strong> ${obj.gravity} m/s²</p>
      <p><strong>Water:</strong> ${obj.water}</p>
      <p><strong>Type:</strong> ${obj.type}</p>
    `;
  } else if (obj.type === 'Moon') {
    panelContent = `
      <h3>🌙 ${obj.name}</h3>
      <p>${obj.info}</p>
      <p><strong>Parent Planet:</strong> ${obj.parentPlanet}</p>
      <p><strong>Type:</strong> ${obj.type}</p>
    `;
  } else {
    panelContent = `
      ${micButton}
      <h3>🪐 ${obj.name}</h3>
      ${obj.image ? `<img src="${obj.image}" style="width:100%; border-radius:8px; margin-bottom:15px;">` : ''}
      <p>${obj.info}</p>
      <p><strong>Radius:</strong> ${obj.radius} (scaled)</p>
      <p><strong>Mass:</strong> ${obj.mass}</p>
      <p><strong>Distance from Sun:</strong> ${Math.round(obj.distance)}</p>
      <p><strong>Gravity:</strong> ${obj.gravity} m/s²</p>
      <p><strong>Water:</strong> ${obj.water}</p>
      <p><strong>Farthest from Sun:</strong> ${obj.farthest} million km</p>
      <p><strong>Number of Moons:</strong> ${obj.moons.length}</p>
      <p><strong>Type:</strong> ${obj.type}</p>
    `;
  }
  
  infoPanel.innerHTML = panelContent;
  
  // Add event listener to audio button if it exists
  if (audioPath) {
    const audioBtn = document.getElementById('audioBtn');
    if (audioBtn) {
      audioBtn.onclick = () => playPlanetAudio(obj.name);
    }
  }
}


function playPlanetAudio(planetName) {
  const audioPath = planetAudio[planetName];
  
  if (!audioPath) {
    console.log('No audio available for ' + planetName);
    return;
  }
  
  // If audio is already playing, stop it
  if (currentAudio && !currentAudio.paused) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    
    // Update button to show it's stopped
    const audioBtn = document.getElementById('audioBtn');
    if (audioBtn) {
      audioBtn.textContent = '🎤';
    }
    return;
  }
  
  // Create and play new audio
  currentAudio = new Audio(audioPath);
  
  // Update button while playing
  const audioBtn = document.getElementById('audioBtn');
  if (audioBtn) {
    audioBtn.textContent = '⏸️';
  }
  
  currentAudio.play().catch(error => {
    console.error('Error playing audio:', error);
    alert('Could not play audio. Make sure the audio file exists at: ' + audioPath);
  });
  
  // Reset button when audio ends
  currentAudio.onended = () => {
    if (audioBtn) {
      audioBtn.textContent = '🎤';
    }
  };
}



function animate() {
  requestAnimationFrame(animate);
  
  // Update planets
  planets.forEach(planet => planet.update());
  
  // Check for collisions
  checkCollisions();
  
  // Update particles
  updateParticles();

  // Update camera shake
  updateCameraShake();
  
  // Rotate sun
  sun.rotation.y += 0.005;
  
  // Render
  renderer.render(scene, camera);
}

// Initialize the 3D solar system
init();