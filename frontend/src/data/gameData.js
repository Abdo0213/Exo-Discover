export const planetData = {
  Mercury: { 
    color: 0xa9a9a9, 
    size: 4, 
    distance: 40, 
    mass: 5, 
    moons: 0, 
    speed: 0.02,
    icon: '☿'
  },
  Venus: { 
    color: 0xffcc66, 
    size: 6, 
    distance: 60, 
    mass: 8, 
    moons: 0, 
    speed: 0.015,
    icon: '♀'
  },
  Earth: { 
    color: 0x3399ff, 
    size: 7, 
    distance: 80, 
    mass: 10, 
    moons: 1, 
    speed: 0.01,
    icon: '♁'
  },
  Mars: { 
    color: 0xff3300, 
    size: 5, 
    distance: 100, 
    mass: 8, 
    moons: 2, 
    speed: 0.008,
    icon: '♂'
  },
  Jupiter: { 
    color: 0xff9966, 
    size: 14, 
    distance: 140, 
    mass: 40, 
    moons: 4, 
    speed: 0.005,
    icon: '♃'
  },
  Saturn: { 
    color: 0xffcc99, 
    size: 13, 
    distance: 180, 
    mass: 35, 
    moons: 3, 
    speed: 0.004,
    icon: '♄'
  },
  Uranus: { 
    color: 0x66ccff, 
    size: 9, 
    distance: 220, 
    mass: 20, 
    moons: 2, 
    speed: 0.003,
    icon: '♅'
  },
  Neptune: { 
    color: 0x3366ff, 
    size: 9, 
    distance: 260, 
    mass: 20, 
    moons: 1, 
    speed: 0.002,
    icon: '♆'
  }
};

export const planetFacts = {
  Sun: {
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
    gravity: '274 m/s²',
    water: 'No',
    radius: '696,340 km',
    mass: '1.989 × 10³⁰ kg',
    distance: '0 km',
    moons: [],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/The_Sun_by_the_Atmospheric_Imaging_Assembly_of_NASA%27s_Solar_Dynamics_Observatory_-_20100819.jpg/240px-The_Sun_by_the_Atmospheric_Imaging_Assembly_of_NASA%27s_Solar_Dynamics_Observatory_-_20100819.jpg',
    icon: '☀️'
  },
  Mercury: {
    name: 'Mercury',
    type: 'Rocky Planet',
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
    gravity: '3.7 m/s²',
    water: 'No',
    radius: '2,439.7 km',
    mass: '3.301 × 10²³ kg',
    distance: '57.9 million km',
    moons: [],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Mercury_in_color_-_Prockter07_centered.jpg/240px-Mercury_in_color_-_Prockter07_centered.jpg',
    icon: '☿'
  },
  Venus: {
    name: 'Venus',
    type: 'Rocky Planet',
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
    gravity: '8.87 m/s²',
    water: 'No',
    radius: '6,051.8 km',
    mass: '4.867 × 10²⁴ kg',
    distance: '108.2 million km',
    moons: [],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Venus-real_color.jpg/240px-Venus-real_color.jpg',
    icon: '♀'
  },
  Earth: {
    name: 'Earth',
    type: 'Rocky Planet',
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
    gravity: '9.8 m/s²',
    water: 'Yes',
    radius: '6,371 km',
    mass: '5.972 × 10²⁴ kg',
    distance: '149.6 million km',
    moons: [{ name: 'Moon' }],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/The_Earth_seen_from_Apollo_17.jpg/240px-The_Earth_seen_from_Apollo_17.jpg',
    icon: '♁'
  },
  Mars: {
    name: 'Mars',
    type: 'Rocky Planet',
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
    gravity: '3.71 m/s²',
    water: 'Ice',
    radius: '3,396.2 km',
    mass: '6.417 × 10²³ kg',
    distance: '227.9 million km',
    moons: [{ name: 'Phobos' }, { name: 'Deimos' }],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/OSIRIS_Mars_true_color.jpg/240px-OSIRIS_Mars_true_color.jpg',
    icon: '♂'
  },
  Jupiter: {
    name: 'Jupiter',
    type: 'Gas Giant',
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
    gravity: '24.79 m/s²',
    water: 'No',
    radius: '69,911 km',
    mass: '1.898 × 10²⁷ kg',
    distance: '778.5 million km',
    moons: [{ name: 'Ganymede' }, { name: 'Callisto' }, { name: 'Io' }, { name: 'Europa' }],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Jupiter_and_its_shrunken_Great_Red_Spot.jpg/240px-Jupiter_and_its_shrunken_Great_Red_Spot.jpg',
    icon: '♃'
  },
  Saturn: {
    name: 'Saturn',
    type: 'Gas Giant',
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
    gravity: '10.44 m/s²',
    water: 'No',
    radius: '58,232 km',
    mass: '5.683 × 10²⁶ kg',
    distance: '1.429 billion km',
    moons: [{ name: 'Titan' }, { name: 'Rhea' }, { name: 'Iapetus' }],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Saturn_during_Equinox.jpg/480px-Saturn_during_Equinox.jpg',
    icon: '♄'
  },
  Uranus: {
    name: 'Uranus',
    type: 'Ice Giant',
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
    gravity: '8.69 m/s²',
    water: 'No',
    radius: '25,362 km',
    mass: '8.681 × 10²⁵ kg',
    distance: '2.871 billion km',
    moons: [{ name: 'Titania' }, { name: 'Oberon' }],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Uranus2.jpg/240px-Uranus2.jpg',
    icon: '♅'
  },
  Neptune: {
    name: 'Neptune',
    type: 'Ice Giant',
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
    gravity: '11.15 m/s²',
    water: 'No',
    radius: '24,622 km',
    mass: '1.024 × 10²⁶ kg',
    distance: '4.495 billion km',
    moons: [{ name: 'Triton' }],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Neptune_Full.jpg/240px-Neptune_Full.jpg',
    icon: '♆'
  }
};

export const moonData = {
  Moon: {
    name: 'Moon',
    type: 'Natural Satellite',
    info: `Earth's only natural satellite, the Moon is the fifth largest moon in the Solar System.`,
    parent: 'Earth'
  },
  Phobos: {
    name: 'Phobos',
    type: 'Moon',
    info: `The larger and closer of the two natural satellites of Mars.`,
    parent: 'Mars'
  },
  Deimos: {
    name: 'Deimos', 
    type: 'Moon',
    info: `The smaller and outer of the two natural satellites of Mars.`,
    parent: 'Mars'
  }
};