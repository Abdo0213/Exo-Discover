import React, { useRef, useEffect, useState, useCallback } from 'react'; 
import * as THREE from 'three'; 
import PlanetInfo from './PlanetInfo'; 
import { planetData, planetFacts, planetAudio } from '../../data/gameData'; 
import styles from './styles/SolarSystem3D.module.css'; 

// Planet3D class - Updated with animation support
class Planet3D {
  constructor(name, data, scene) {
    this.name = name;
    this.data = data;
    this.angle = Math.random() * Math.PI * 2;
    this.rotationSpeed = 0.01;
    this.scene = scene;
    
    // Create geometry
    const geometry = new THREE.SphereGeometry(data.size, 32, 32);
    
    // Create texture loader
    const textureLoader = new THREE.TextureLoader();
    
    // Load texture based on planet name
    let texture;
    try {
      // Try to load planet texture
      texture = textureLoader.load(`/textures/planets/${name.toLowerCase()}.jpg`);
    } catch (error) {
      console.warn(`Texture not found for ${name}, using color fallback`);
      texture = null;
    }

    // Create material with texture or fallback to color
    // Use MeshBasicMaterial for simple textures without lighting
    const material = texture 
      ? new THREE.MeshBasicMaterial({
          map: texture
        })
      : new THREE.MeshBasicMaterial({
          color: data.color
        });
    
    this.mesh = new THREE.Mesh(geometry, material);
    
    // Calculate FINAL orbital position but don't set it yet
    this.finalPosition = {
      x: Math.cos(this.angle) * data.distance,
      y: 0,
      z: Math.sin(this.angle) * data.distance
    };
    
    // Start at center (will be animated to position)
    this.mesh.position.set(0, 0, 0);
    this.mesh.visible = false; // Hide until animation starts
    
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    
    // Store planet info in userData with audio support
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
      image: facts.image || null,
      hasAudio: !!planetAudio[name],
      hasTexture: !!texture
    };
    
    scene.add(this.mesh);
    
    // Create orbit line (make it invisible during intro)
    this.createOrbitLine();
    this.orbitLine.visible = false;
    
    // Create moons (but hide them during intro)
    this.createMoons();
    this.moons.forEach(moon => {
      moon.mesh.visible = false;
    });
    
    // Create rings for Saturn with texture
    if (name === 'Saturn') {
      this.createRings();
      if (this.rings) this.rings.visible = false;
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
    this.scene.add(this.orbitLine);
  }
  
  createMoons() {
    this.moons = [];
    const moonCount = this.data.moons;
    const textureLoader = new THREE.TextureLoader();
    
    for (let i = 0; i < moonCount; i++) {
      const moonSize = Math.max(0.5, this.data.size * 0.15);
      const moonDistance = this.data.size + 8 + i * 5;
      
      const moonGeometry = new THREE.SphereGeometry(moonSize, 16, 16);
      
      // Try to load moon texture
      let moonTexture;
      try {
        moonTexture = textureLoader.load('/textures/moons/moon.jpg');
      } catch (error) {
        moonTexture = null;
      }

      const moonMaterial = moonTexture
        ? new THREE.MeshStandardMaterial({
            map: moonTexture,
            roughness: 0.9,
            metalness: 0.1
          })
        : new THREE.MeshStandardMaterial({ 
            color: 0xcccccc,
            roughness: 0.9,
            metalness: 0.1
          });
      
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
        parentPlanet: this.name,
        hasAudio: false,
        hasTexture: !!moonTexture
      };
      
      this.moons.push(moon);
      this.mesh.userData.moons.push(moon);
      this.scene.add(moonMesh);
    }
  }
  
  createRings() {
    const textureLoader = new THREE.TextureLoader();
    let ringTexture;
    
    try {
      ringTexture = textureLoader.load('/textures/planets/saturn_ring.png');
    } catch (error) {
      console.warn('Saturn ring texture not found, using default material');
      ringTexture = null;
    }

    const ringGeometry = new THREE.RingGeometry(this.data.size + 2, this.data.size + 8, 32);
    const ringMaterial = ringTexture 
      ? new THREE.MeshStandardMaterial({
          map: ringTexture,
          transparent: true,
          opacity: 0.8,
          side: THREE.DoubleSide
        })
      : new THREE.MeshStandardMaterial({  
          color: 0xaaaaaa,
          transparent: true,
          opacity: 0.6,
          side: THREE.DoubleSide
        });
    
    this.rings = new THREE.Mesh(ringGeometry, ringMaterial);
    this.rings.rotation.x = -Math.PI / 2 + 0.3;
    this.mesh.add(this.rings);
  }
  
  update(globalSpeed = 1) {
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
  
  // Method to start the planet's orbit after intro
  startOrbit() {
    this.mesh.visible = true;
    this.mesh.position.set(this.finalPosition.x, this.finalPosition.y, this.finalPosition.z);
    
    // Show orbit line and moons
    if (this.orbitLine) this.orbitLine.visible = true;
    this.moons.forEach(moon => {
      moon.mesh.visible = true;
    });
    if (this.rings) this.rings.visible = true;
  }
  
  destroy() {
    this.scene.remove(this.mesh);
    if (this.orbitLine) {
      this.scene.remove(this.orbitLine);
    }
    
    for (let moon of this.moons) {
      this.scene.remove(moon.mesh);
    }
    
    if (this.rings) {
      this.mesh.remove(this.rings);
    }
  }
}

const SolarSystem3D = () => {
  const mountRef = useRef(null);
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [globalSpeed, setGlobalSpeed] = useState(1);
  const [deletedPlanets, setDeletedPlanets] = useState([]);
  const [planetsList, setPlanetsList] = useState([]);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false); // Audio state
  const [currentAudioName, setCurrentAudioName] = useState(null);

  // Refs to maintain Three.js objects between renders
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const planetsRef = useRef([]);
  const particlesRef = useRef([]);
  const sunRef = useRef(null);
  const animationIdRef = useRef(null);
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());
  const currentGlobalSpeedRef = useRef(1);
  const cameraShakeRef = useRef({ intensity: 0, duration: 0 });
  const isIntroSequenceRef = useRef(false);
  const introIndexRef = useRef(0);
  const introOrderRef = useRef(['Sun', 'Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune']);

  // Audio ref
  const currentAudioRef = useRef(null);

  // Audio functions - with toggle support and state updates
  const playPlanetAudio = useCallback((planetName) => {
    const audioPath = planetAudio[planetName];
    if (!audioPath) {
      console.log('No audio available for ' + planetName);
      return false;
    }

    // If the same planet's audio is loaded
    if (currentAudioName === planetName && currentAudioRef.current) {
      // If it's currently playing -> pause (toggle off)
      if (!currentAudioRef.current.paused) {
        currentAudioRef.current.pause();
        setIsAudioPlaying(false);
        setCurrentAudioName(null);
        return false; // now paused
      }

      // If same audio file is loaded but paused -> resume play
      currentAudioRef.current.play().catch(err => {
        console.error('Error resuming audio:', err);
        setIsAudioPlaying(false);
        setCurrentAudioName(null);
      });
      setIsAudioPlaying(true);
      return true;
    }

    // Different audio: stop previous if exists
    if (currentAudioRef.current) {
      try {
        currentAudioRef.current.pause();
        currentAudioRef.current.currentTime = 0;
      } catch (e) {
        // ignore
      }
    }

    // Load and play new audio
    const audio = new Audio(audioPath);
    currentAudioRef.current = audio;
    setCurrentAudioName(planetName);
    setIsAudioPlaying(true);

    audio.play().catch(error => {
      console.error('Error playing audio:', error);
      setIsAudioPlaying(false);
      setCurrentAudioName(null);
    });

    // Cleanup when it ends or errors
    audio.onended = () => {
      setIsAudioPlaying(false);
      setCurrentAudioName(null);
    };
    audio.onerror = () => {
      setIsAudioPlaying(false);
      setCurrentAudioName(null);
    };

    return true; // now playing
  }, [currentAudioName]);

  const stopAudio = useCallback(() => {
    if (currentAudioRef.current) {
      try {
        currentAudioRef.current.pause();
        currentAudioRef.current.currentTime = 0;
      } catch (e) {}
      currentAudioRef.current = null;
    }
    setIsAudioPlaying(false);
    setCurrentAudioName(null);
  }, []);

  // Create starfield
  const createStarfield = useCallback((scene, starCount = 10000) => {
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1,
      transparent: true
    });
    
    const starsVertices = [];
    for (let i = 0; i < starCount; i++) {
      const x = (Math.random() - 0.5) * 4000;
      const y = (Math.random() - 0.5) * 4000;
      const z = (Math.random() - 0.5) * 4000;
      starsVertices.push(x, y, z);
    }
    
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
  }, []);

  // Create explosion
  const createExplosion = useCallback((position, planetSize = 10) => {
    const particleCount = Math.min(200, 50 + planetSize * 5);
    const particles = [];
    
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
      sceneRef.current.add(particle);
    }
    
    // Add camera shake
    cameraShakeRef.current.intensity = Math.min(15, planetSize * 0.8);
    cameraShakeRef.current.duration = 30;
    
    return particles;
  }, []);

  // Update particles animation
  const updateParticles = useCallback(() => {
    const particles = particlesRef.current;
    for (let i = particles.length - 1; i >= 0; i--) {
      const particle = particles[i];
      
      particle.position.add(particle.userData.velocity);
      particle.userData.velocity.multiplyScalar(0.98); // Friction
      particle.userData.life--;
      
      const alpha = particle.userData.life / particle.userData.maxLife;
      particle.material.opacity = alpha;
      particle.material.transparent = true;
      
      if (particle.userData.life <= 0) {
        sceneRef.current.remove(particle);
        particles.splice(i, 1);
      }
    }
  }, []);

  // Update camera shake
  const updateCameraShake = useCallback(() => {
    const cameraShake = cameraShakeRef.current;
    if (cameraShake.duration > 0 && cameraRef.current) {
      // Apply random shake to camera position
      const shakeX = (Math.random() - 0.5) * cameraShake.intensity;
      const shakeY = (Math.random() - 0.5) * cameraShake.intensity;
      const shakeZ = (Math.random() - 0.5) * cameraShake.intensity;
      
      cameraRef.current.position.x += shakeX;
      cameraRef.current.position.y += shakeY;
      cameraRef.current.position.z += shakeZ;
      
      // Reduce shake over time
      cameraShake.duration--;
      cameraShake.intensity *= 0.95;
    }
  }, []);

  // Setup camera controls
  const setupCameraControls = useCallback((camera, renderer) => {
    let isMouseDown = false;
    let mouseX = 0, mouseY = 0;
    let cameraRadius = camera.position.length();
    let cameraTheta = Math.atan2(camera.position.z, camera.position.x);
    let cameraPhi = Math.acos(camera.position.y / cameraRadius);
    
    const onMouseDown = (event) => {
      isMouseDown = true;
      mouseX = event.clientX;
      mouseY = event.clientY;
      event.preventDefault();
    };
    
    const onMouseUp = () => {
      isMouseDown = false;
    };
    
    const onMouseMove = (event) => {
      if (isMouseDown) {
        const deltaX = event.clientX - mouseX;
        const deltaY = event.clientY - mouseY;
        
        const sensitivity = 0.005;
        
        cameraTheta -= deltaX * sensitivity;
        cameraPhi += deltaY * sensitivity;
        
        cameraPhi = Math.max(0.1, Math.min(Math.PI - 0.1, cameraPhi));
        
        camera.position.x = cameraRadius * Math.sin(cameraPhi) * Math.cos(cameraTheta);
        camera.position.y = cameraRadius * Math.cos(cameraPhi);
        camera.position.z = cameraRadius * Math.sin(cameraPhi) * Math.sin(cameraTheta);
        
        camera.lookAt(0, 0, 0);
        
        mouseX = event.clientX;
        mouseY = event.clientY;
      }
    };
    
    const onWheel = (event) => {
      event.preventDefault();
      const zoomSpeed = 20;
      const direction = event.deltaY > 0 ? 1 : -1;
      
      cameraRadius *= (1 + direction * zoomSpeed * 0.001);
      cameraRadius = Math.max(50, Math.min(1500, cameraRadius));
      
      camera.position.x = cameraRadius * Math.sin(cameraPhi) * Math.cos(cameraTheta);
      camera.position.y = cameraRadius * Math.cos(cameraPhi);
      camera.position.z = cameraRadius * Math.sin(cameraPhi) * Math.sin(cameraTheta);
      
      camera.lookAt(0, 0, 0);
    };
    
    // Add event listeners
    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('mouseup', onMouseUp);
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('wheel', onWheel);
    renderer.domElement.addEventListener('contextmenu', (e) => e.preventDefault());
    
    // Return cleanup function
    return () => {
      renderer.domElement.removeEventListener('mousedown', onMouseDown);
      renderer.domElement.removeEventListener('mouseup', onMouseUp);
      renderer.domElement.removeEventListener('mousemove', onMouseMove);
      renderer.domElement.removeEventListener('wheel', onWheel);
    };
  }, []);

  // Mouse move handler
  const handleMouseMove = useCallback((event) => {
    if (!rendererRef.current || !cameraRef.current) return;
    
    const rect = rendererRef.current.domElement.getBoundingClientRect();
    mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    // Update raycaster
    raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
    
    // Check for intersections
    const allObjects = [];
    if (sunRef.current) allObjects.push(sunRef.current);
    planetsRef.current.forEach(planet => {
      allObjects.push(planet.mesh);
      planet.moons.forEach(moon => {
        allObjects.push(moon.mesh);
      });
    });
    
    const intersects = raycasterRef.current.intersectObjects(allObjects);
    
    // Change cursor on hover
    if (intersects.length > 0) {
      rendererRef.current.domElement.style.cursor = 'pointer';
    } else {
      rendererRef.current.domElement.style.cursor = 'default';
    }
  }, []);

  // Mouse click handler
  const handleClick = useCallback((event) => {
    if (!rendererRef.current || !cameraRef.current) return;
    
    // Check if click was on the info panel or UI elements
    const uiPanel = document.querySelector(`.${styles.uiPanel}`);
    const planetInfo = document.querySelector(`.${styles.planetInfo}`);
    
    if (uiPanel?.contains(event.target) || planetInfo?.contains(event.target)) {
      return; // Ignore clicks on UI elements
    }
    
    const rect = rendererRef.current.domElement.getBoundingClientRect();
    mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
    
    // Check for intersections
    const allObjects = [];
    if (sunRef.current) allObjects.push(sunRef.current);
    planetsRef.current.forEach(planet => {
      allObjects.push(planet.mesh);
      planet.moons.forEach(moon => {
        allObjects.push(moon.mesh);
      });
    });
    
    const intersects = raycasterRef.current.intersectObjects(allObjects);
    
    if (intersects.length > 0) {
      const clickedObject = intersects[0].object;
      setSelectedPlanet(clickedObject.userData);
    } else {
      setSelectedPlanet(null);
    }
  }, []);

  // Collision detection
  const checkCollisions = useCallback(() => {
    const planets = planetsRef.current;
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
          
          // Create explosion
          const explosionParticles = createExplosion(collisionPoint, maxSize);
          particlesRef.current.push(...explosionParticles);
        
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
          survivor.data.size = Math.pow(survivor.data.mass / 10, 0.33) * 7;
          
          // Update mesh scale
          const scale = survivor.data.size / survivor.mesh.geometry.parameters.radius;
          survivor.mesh.scale.setScalar(scale);
          
          // Remove absorbed planet
          absorbed.destroy();
          planets.splice(planets.indexOf(absorbed), 1);
          setDeletedPlanets(prev => [...prev, absorbed.name]);
          setPlanetsList(planets.map(p => p.name));
          
          break;
        }
      }
    }
  }, [createExplosion]);

  // Create sun - UPDATED VERSION (remove helper)
  const createSun = useCallback((scene) => {
    const textureLoader = new THREE.TextureLoader();
    let sunTexture;
    
    try {
      sunTexture = textureLoader.load('/textures/planets/sun.jpg');
    } catch (error) {
      console.warn('Sun texture not found, using default material');
      sunTexture = null;
    }

    // Sun visible mesh - Use MeshBasicMaterial for self-illuminated objects
    const sunGeometry = new THREE.SphereGeometry(20, 32, 32);
    const sunMaterial = sunTexture
      ? new THREE.MeshBasicMaterial({
          map: sunTexture
        })
      : new THREE.MeshBasicMaterial({    
          color: 0xffaa00
        });
    
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    
    // Add sun data with audio support
    sun.userData = {
      ...planetFacts.Sun,
      hasAudio: !!planetAudio.Sun,
      hasTexture: !!sunTexture
    };
    
    scene.add(sun);
    sunRef.current = sun;

    // Strong point light at the sun's position
    const sunLight = new THREE.PointLight(0xffffff, 2.0, 2000);
    sunLight.position.set(0, 0, 0);
    sunLight.castShadow = true;
    scene.add(sunLight);

    // Small ambient so the dark side isn't fully black
    const ambient = new THREE.AmbientLight(0xffffff, 0.15);
    scene.add(ambient);
  }, []);

  // Intro sequence functions
  const startIntroSequence = useCallback(() => {
    isIntroSequenceRef.current = true;
    introIndexRef.current = 0;
    planetsRef.current = [];
    
    // Hide the sun initially
    if (sunRef.current) {
      sunRef.current.scale.set(0, 0, 0);
    }
    
    // Start with the sun after a brief delay
    setTimeout(() => {
      introduceCelestialBody();
    }, 1000);
  }, []);

  const introduceCelestialBody = useCallback(() => {
    const currentName = introOrderRef.current[introIndexRef.current];
    
    if (currentName === 'Sun') {
      animateSunAppearance();
    } else {
      const planet = new Planet3D(currentName, planetData[currentName], sceneRef.current);
      planetsRef.current.push(planet);
      animatePlanetAppearance(planet);
    }
  }, []);

  const animateSunAppearance = useCallback(() => {
    if (!sunRef.current) return;
    
    // Show info panel with audio
    const sunData = {
      ...sunRef.current.userData,
      name: 'Sun'
    };
    setSelectedPlanet(sunData);
    
    // Start sun below the scene
    sunRef.current.position.y = -200;
    sunRef.current.scale.set(1, 1, 1);
    
    // Animate sun rising up to center
    let currentY = -200;
    const animateUp = setInterval(() => {
      currentY += 5;
      sunRef.current.position.y = currentY;
      
      if (currentY >= 0) {
        clearInterval(animateUp);
        sunRef.current.position.y = 0;
        
        // Wait 4 seconds then move to next
        setTimeout(() => {
          setSelectedPlanet(null);
          introIndexRef.current++;
          if (introIndexRef.current < introOrderRef.current.length) {
            introduceCelestialBody();
          } else {
            finishIntroSequence();
          }
        }, 4000);
      }
    }, 30);
  }, [introduceCelestialBody]);

  const animatePlanetAppearance = useCallback((planet) => {
    // Show info panel with audio
    setSelectedPlanet(planet.mesh.userData);
    
    // Make planet visible for animation
    planet.mesh.visible = true;
    
    // Store the FINAL orbital position (where it should end up)
    const finalPosition = planet.finalPosition;
    
    // Start planet below the scene (centered below)
    const startPosition = { x: 0, y: -300, z: 0 };
    planet.mesh.position.set(startPosition.x, startPosition.y, startPosition.z);
    planet.mesh.scale.set(1, 1, 1);
    
    // Animate planet rising up AND moving to orbital position
    let progress = 0;
    const duration = 2000; // 2 seconds
    const startTime = Date.now();
    
    const animateToOrbit = () => {
      const currentTime = Date.now();
      progress = (currentTime - startTime) / duration;
      
      // Easing function for smooth animation
      const easedProgress = 1 - Math.pow(1 - progress, 3); // Cubic ease out
      
      if (progress < 1) {
        const currentX = startPosition.x + (finalPosition.x - startPosition.x) * easedProgress;
        const currentY = startPosition.y + (finalPosition.y - startPosition.y) * easedProgress;
        const currentZ = startPosition.z + (finalPosition.z - startPosition.z) * easedProgress;
        
        planet.mesh.position.set(currentX, currentY, currentZ);
        requestAnimationFrame(animateToOrbit);
      } else {
        planet.mesh.position.set(finalPosition.x, finalPosition.y, finalPosition.z);
        
        // Wait 4 seconds then move to next
        setTimeout(() => {
          setSelectedPlanet(null);
          introIndexRef.current++;
          if (introIndexRef.current < introOrderRef.current.length) {
            introduceCelestialBody();
          } else {
            finishIntroSequence();
          }
        }, 4000);
      }
    };
    
    animateToOrbit();
  }, [introduceCelestialBody]);

  const finishIntroSequence = useCallback(() => {
    isIntroSequenceRef.current = false;
    // Start all planets orbiting
    planetsRef.current.forEach(planet => {
      planet.startOrbit();
    });
    setPlanetsList(planetsRef.current.map(p => p.name));
  }, []);

  // Initialize the solar system
  const initializeSolarSystem = useCallback(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    if (mountRef.current) {
      // Clear any existing canvas
      while (mountRef.current.firstChild) {
        mountRef.current.removeChild(mountRef.current.firstChild);
      }
      mountRef.current.appendChild(renderer.domElement);
    }

    // Store in refs
    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;

    // Add starfield background
    createStarfield(scene);
    
    // Camera setup
    camera.position.set(0, 200, 400);
    camera.lookAt(0, 0, 0);

    // Create sun
    createSun(scene);

    // Setup camera controls
    const cleanupCameraControls = setupCameraControls(camera, renderer);

    // Add event listeners
    renderer.domElement.addEventListener('click', handleClick);
    renderer.domElement.addEventListener('mousemove', handleMouseMove);

    // Start intro sequence
    startIntroSequence();

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      
      // Update planets (only if not in intro sequence)
      if (!isIntroSequenceRef.current) {
        planetsRef.current.forEach(planet => planet.update(currentGlobalSpeedRef.current));
        
        // Check for collisions
        checkCollisions();
      }
      
      // Update particles
      updateParticles();

      // Update camera shake
      updateCameraShake();
      
      // Rotate sun
      if (sunRef.current) {
        sunRef.current.rotation.y += 0.005;
      }
      
      // Render
      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Return cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      if (rendererRef.current && rendererRef.current.domElement) {
        rendererRef.current.domElement.removeEventListener('click', handleClick);
        rendererRef.current.domElement.removeEventListener('mousemove', handleMouseMove);
      }
      cleanupCameraControls();
      stopAudio(); // Stop any playing audio
      
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      
      // Clean up Three.js objects
      planetsRef.current.forEach(planet => planet.destroy());
      particlesRef.current.forEach(particle => scene.remove(particle));
      
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      renderer.dispose();
    };
  }, [createStarfield, createSun, setupCameraControls, handleClick, handleMouseMove, checkCollisions, updateParticles, updateCameraShake, startIntroSequence, stopAudio]);

  // Initialize only once on mount
  useEffect(() => {
    const cleanup = initializeSolarSystem();
    return cleanup;
  }, [initializeSolarSystem]);

  // Update speed ref when state changes
  useEffect(() => {
    currentGlobalSpeedRef.current = globalSpeed;
  }, [globalSpeed]);

  // UI control functions
  const handleReset = useCallback(() => {
    // Clear existing planets
    planetsRef.current.forEach(planet => planet.destroy());
    planetsRef.current = [];
    
    // Clear particles
    particlesRef.current.forEach(particle => sceneRef.current.remove(particle));
    particlesRef.current = [];
    
    // Reset camera
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 200, 400);
      cameraRef.current.lookAt(0, 0, 0);
    }
    
    // Stop any audio
    stopAudio();
    
    // Start intro sequence
    startIntroSequence();
    
    setDeletedPlanets([]);
    setSelectedPlanet(null);
    setGlobalSpeed(1);
    currentGlobalSpeedRef.current = 1;
    cameraShakeRef.current = { intensity: 0, duration: 0 };
  }, [startIntroSequence, stopAudio]);

  const handleDeletePlanet = useCallback((planetName) => {
    const planets = planetsRef.current;
    const planetIndex = planets.findIndex(p => p.name === planetName);
    
    if (planetIndex !== -1) {
      const planet = planets[planetIndex];
      
      // Create explosion
      const explosionParticles = createExplosion(planet.mesh.position, planet.data.size);
      particlesRef.current.push(...explosionParticles);
      
      // Add to deleted planets
      setDeletedPlanets(prev => [...prev, planetName]);
      
      // Remove planet after brief delay for effect
      setTimeout(() => {
        planet.destroy();
        planets.splice(planetIndex, 1);
        setPlanetsList(planets.map(p => p.name));
      }, 100);
    }
  }, [createExplosion]);

  const handleRestorePlanet = useCallback((planetName) => {
    if (planetData[planetName]) {
      const planet = new Planet3D(planetName, planetData[planetName], sceneRef.current);
      planetsRef.current.push(planet);
      planet.startOrbit(); // Start orbiting immediately
      setDeletedPlanets(prev => prev.filter(name => name !== planetName));
      setPlanetsList(prev => [...prev, planetName]);
    }
  }, []);

  const handleZoom = useCallback((direction) => {
    if (cameraRef.current) {
      if (direction === 'in') {
        cameraRef.current.position.multiplyScalar(0.8);
        const distance = cameraRef.current.position.length();
        if (distance < 50) cameraRef.current.position.normalize().multiplyScalar(50);
      } else {
        cameraRef.current.position.multiplyScalar(1.25);
        const distance = cameraRef.current.position.length();
        if (distance > 1500) cameraRef.current.position.normalize().multiplyScalar(1500);
      }
      cameraRef.current.lookAt(0, 0, 0);
    }
  }, []);

  const handleSpeedChange = useCallback((newSpeed) => {
    setGlobalSpeed(newSpeed);
  }, []);

  return (
    <div className={styles.solarSystem}>
      <div ref={mountRef} className={styles.canvasContainer} />
      
      {/* UI Panel */}
      <div className={styles.uiPanel}>
        <h2>🌌 3D Solar System</h2>
        
        <button onClick={handleReset} className={styles.uiButton}>🔄 Reset Solar System</button>
        
        <div className={styles.controlGroup}>
          <label>🌠 Orbital Speed:</label>
          <input 
            type="range" 
            min="0.1" 
            max="3" 
            step="0.1" 
            value={globalSpeed}
            onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
            className={styles.slider}
          />
          <span>{globalSpeed.toFixed(1)}x</span>
        </div>
        
        <div className={styles.controlGroup}>
          <label>🎥 Camera Controls:</label>
          <div className={styles.zoomControls}>
            <button onClick={() => handleZoom('in')} className={styles.uiButton}>🔍+ Zoom In</button>
            <button onClick={() => handleZoom('out')} className={styles.uiButton}>🔍- Zoom Out</button>
          </div>
          <button onClick={() => {
            if (cameraRef.current) {
              cameraRef.current.position.set(0, 200, 400);
              cameraRef.current.lookAt(0, 0, 0);
            }
          }} className={styles.uiButton}>
            🎯 Reset Camera
          </button>
        </div>
        
        {deletedPlanets.length > 0 && (
          <div className={styles.restorePanel}>
            <label>🌍 Restore Deleted Planet:</label>
            <select 
              onChange={(e) => handleRestorePlanet(e.target.value)}
              className={styles.select}
              defaultValue=""
            >
              <option value="">Select a planet to restore</option>
              {deletedPlanets.map(planetName => (
                <option key={planetName} value={planetName}>{planetName}</option>
              ))}
            </select>
          </div>
        )}
        
        <details className={styles.planetList}>
          <summary>🌍 Planets List (Click to Remove)</summary>
          <ul>
            {planetsList.map(planetName => (
              <li 
                key={planetName} 
                onClick={() => handleDeletePlanet(planetName)}
                className={styles.planetListItem}
              >
                {planetName}
              </li>
            ))}
          </ul>
        </details>
      </div>
      
      {/* Planet Info Panel with Audio Support */}
      {selectedPlanet && (
        <PlanetInfo
          planet={selectedPlanet}
          onClose={() => {
            setSelectedPlanet(null);
            stopAudio();
          }}
          onPlayAudio={() => playPlanetAudio(selectedPlanet.name)}
          isAudioPlaying={isAudioPlaying && currentAudioName === selectedPlanet.name}
        />
      )}
    </div>
  );
};

export default SolarSystem3D;