import * as THREE from 'three';

// Create starfield background
export const createStarfield = (scene, starCount = 10000) => {
  const starsGeometry = new THREE.BufferGeometry();
  const starsMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 1,
    transparent: true,
    sizeAttenuation: true
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
  
  return stars;
};

// Create orbit lines
export const createOrbitLine = (distance, color = 0x444444) => {
  const curve = new THREE.EllipseCurve(
    0, 0,
    distance, distance,
    0, 2 * Math.PI,
    false,
    0
  );
  
  const points = curve.getPoints(128);
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ 
    color: color,
    transparent: true,
    opacity: 0.3
  });
  
  const orbitLine = new THREE.Line(geometry, material);
  orbitLine.rotation.x = -Math.PI / 2;
  
  return orbitLine;
};

// Create planet with basic properties
export const createPlanet = (radius, color, position) => {
  const geometry = new THREE.SphereGeometry(radius, 32, 32);
  const material = new THREE.MeshLambertMaterial({ 
    color: color,
    transparent: true,
    opacity: 0.9
  });
  
  const planet = new THREE.Mesh(geometry, material);
  planet.position.copy(position);
  planet.castShadow = true;
  planet.receiveShadow = true;
  
  return planet;
};

// Create rings for Saturn
export const createRings = (innerRadius, outerRadius, color = 0xffffaa) => {
  const ringGeometry = new THREE.RingGeometry(innerRadius, outerRadius, 32);
  const ringMaterial = new THREE.MeshLambertMaterial({ 
    color: color,
    transparent: true,
    opacity: 0.6,
    side: THREE.DoubleSide
  });
  
  const rings = new THREE.Mesh(ringGeometry, ringMaterial);
  rings.rotation.x = -Math.PI / 2 + 0.3;
  
  return rings;
};

// Create explosion particles
export const createExplosion = (position, particleCount = 50, planetSize = 10) => {
  const particles = [];
  const actualCount = Math.min(200, particleCount + planetSize * 5);
  
  for (let i = 0; i < actualCount; i++) {
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
  }
  
  return particles;
};

// Update particles animation
export const updateParticles = (particles, scene) => {
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
};

// Camera controls helper
export const setupCameraControls = (camera, renderer) => {
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
};

// Raycaster helper for object selection
export const setupRaycaster = (camera, scene) => {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  
  const getIntersectedObject = (event, domElement) => {
    const rect = domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    
    const objects = [];
    scene.traverse((object) => {
      if (object.isMesh && object.userData.name) {
        objects.push(object);
      }
    });
    
    const intersects = raycaster.intersectObjects(objects);
    return intersects.length > 0 ? intersects[0].object : null;
  };
  
  return { getIntersectedObject, mouse };
};