import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

const canvas = document.getElementById('globe');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
scene.fog = new THREE.Fog('#04070f', 6, 12);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0, 6);

const ambientLight = new THREE.AmbientLight('#ffffff', 0.5);
const pointLight = new THREE.PointLight('#ffffff', 1.2, 30);
pointLight.position.set(5, 4, 6);
scene.add(ambientLight, pointLight);

const globe = new THREE.Mesh(
  new THREE.SphereGeometry(2.1, 64, 64),
  new THREE.MeshStandardMaterial({
    color: '#0b132b',
    roughness: 0.9,
    metalness: 0.1,
  })
);
scene.add(globe);

const starsGeometry = new THREE.BufferGeometry();
const starsCount = 1500;
const starsVertices = [];
for (let i = 0; i < starsCount; i += 1) {
  starsVertices.push(
    (Math.random() - 0.5) * 40,
    (Math.random() - 0.5) * 40,
    (Math.random() - 0.5) * 40
  );
}
starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
const starsMaterial = new THREE.PointsMaterial({ color: '#ffffff', size: 0.15 });
const stars = new THREE.Points(starsGeometry, starsMaterial);
scene.add(stars);

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

const locations = [
  {
    id: 1,
    name: 'Westminster Cathedral',
    city: 'London',
    country: 'United Kingdom',
    diocese: 'Diocese of Westminster',
    lat: 51.4993,
    lng: -0.1273,
    url: 'https://westminstercathedral.org.uk/',
    schedule: [
      { day: 'Monday', time: '09:00 – 18:00' },
      { day: 'Tuesday', time: '09:00 – 18:00' },
      { day: 'Wednesday', time: '09:00 – 18:00' },
      { day: 'Thursday', time: '09:00 – 18:00' },
      { day: 'Friday', time: '09:00 – 18:00' },
      { day: 'Saturday', time: '—' },
      { day: 'Sunday', time: '14:00 – 17:00' },
    ],
    next: {
      start: '2026-01-28T09:00:00Z',
      end: '2026-01-28T18:00:00Z',
    },
  },
  {
    id: 2,
    name: 'Our Lady of Sorrows Parish',
    city: 'Lagos',
    country: 'Nigeria',
    diocese: 'Archdiocese of Lagos',
    lat: 6.5244,
    lng: 3.3792,
    url: 'https://catholiclagos.org/',
    schedule: [
      { day: 'Monday', time: '—' },
      { day: 'Tuesday', time: '—' },
      { day: 'Wednesday', time: '10:00 – 16:00' },
      { day: 'Thursday', time: '10:00 – 16:00' },
      { day: 'Friday', time: '10:00 – 16:00' },
      { day: 'Saturday', time: '09:00 – 12:00' },
      { day: 'Sunday', time: '—' },
    ],
    next: {
      start: '2026-01-28T10:00:00Z',
      end: '2026-01-28T16:00:00Z',
    },
  },
  {
    id: 3,
    name: 'St. Mary of the Angels',
    city: 'Kraków',
    country: 'Poland',
    diocese: 'Archdiocese of Kraków',
    lat: 50.0614,
    lng: 19.9366,
    url: 'https://diecezja.pl/',
    schedule: [
      { day: 'Monday', time: '07:00 – 19:00' },
      { day: 'Tuesday', time: '07:00 – 19:00' },
      { day: 'Wednesday', time: '07:00 – 19:00' },
      { day: 'Thursday', time: '07:00 – 19:00' },
      { day: 'Friday', time: '07:00 – 19:00' },
      { day: 'Saturday', time: '08:00 – 12:00' },
      { day: 'Sunday', time: '—' },
    ],
    next: {
      start: '2026-01-28T07:00:00Z',
      end: '2026-01-28T19:00:00Z',
    },
  },
  {
    id: 4,
    name: 'Basilica of the National Shrine',
    city: 'Washington, D.C.',
    country: 'United States',
    diocese: 'Archdiocese of Washington',
    lat: 38.9333,
    lng: -77.0014,
    url: 'https://www.nationalshrine.org/',
    schedule: [
      { day: 'Monday', time: '08:00 – 17:00' },
      { day: 'Tuesday', time: '08:00 – 17:00' },
      { day: 'Wednesday', time: '08:00 – 17:00' },
      { day: 'Thursday', time: '08:00 – 17:00' },
      { day: 'Friday', time: '08:00 – 17:00' },
      { day: 'Saturday', time: '09:00 – 12:00' },
      { day: 'Sunday', time: '14:00 – 16:00' },
    ],
    next: {
      start: '2026-01-28T08:00:00Z',
      end: '2026-01-28T17:00:00Z',
    },
  },
];

const pointsGroup = new THREE.Group();
scene.add(pointsGroup);

const glowMaterial = new THREE.MeshStandardMaterial({
  color: '#ffd166',
  emissive: '#ffd166',
  emissiveIntensity: 2.2,
});

const baseRadius = 2.1;

function latLngToVector(lat, lng, radius = baseRadius + 0.05) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

function buildPoint(location) {
  const geometry = new THREE.SphereGeometry(0.055, 16, 16);
  const mesh = new THREE.Mesh(geometry, glowMaterial.clone());
  mesh.position.copy(latLngToVector(location.lat, location.lng));
  mesh.userData = { location };
  return mesh;
}

const points = locations.map((location) => buildPoint(location));
points.forEach((point) => pointsGroup.add(point));

let activeMode = 'now';
let selectedPoint = null;

function parseIso(dateString) {
  return new Date(dateString);
}

function isWithinWindow(date, windowHours) {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  return diffMs >= 0 && diffMs <= windowHours * 60 * 60 * 1000;
}

function isActive(location) {
  const start = parseIso(location.next.start);
  const end = parseIso(location.next.end);
  const now = new Date();

  if (activeMode === 'now') {
    return now >= start && now <= end;
  }

  if (activeMode === '24h') {
    return (now >= start && now <= end) || isWithinWindow(start, 24);
  }

  return (now >= start && now <= end) || isWithinWindow(start, 168);
}

function updatePointsVisibility() {
  points.forEach((point) => {
    const location = point.userData.location;
    point.visible = isActive(location);
  });
}

const panel = document.getElementById('detailPanel');
const panelClose = document.getElementById('panelClose');
const panelName = document.getElementById('panelName');
const panelLocation = document.getElementById('panelLocation');
const panelDiocese = document.getElementById('panelDiocese');
const panelStatus = document.getElementById('panelStatus');
const panelSchedule = document.getElementById('panelSchedule');
const panelLink = document.getElementById('panelLink');

function openPanel(location) {
  panelName.textContent = location.name;
  panelLocation.textContent = `${location.city}, ${location.country}`;
  panelDiocese.textContent = location.diocese;

  const start = parseIso(location.next.start);
  const end = parseIso(location.next.end);
  const now = new Date();

  if (now >= start && now <= end) {
    const remainingMs = end.getTime() - now.getTime();
    const remainingHours = Math.floor(remainingMs / (1000 * 60 * 60));
    const remainingMinutes = Math.floor((remainingMs / (1000 * 60)) % 60);
    panelStatus.innerHTML = `<strong>🟡 Exposition in progress</strong><br />Ends in ${remainingHours}h ${remainingMinutes}m`;
  } else {
    panelStatus.innerHTML = `<strong>⚪ No exposition now</strong><br />Next begins at ${start.toUTCString().slice(17, 22)} UTC`;
  }

  panelSchedule.innerHTML = location.schedule
    .map((entry) => `<div><strong>${entry.day}</strong> ${entry.time}</div>`)
    .join('');

  panelLink.href = location.url;
  panel.classList.add('is-open');
  panel.setAttribute('aria-hidden', 'false');
}

function closePanel() {
  panel.classList.remove('is-open');
  panel.setAttribute('aria-hidden', 'true');
}

panelClose.addEventListener('click', closePanel);

const tooltipButton = document.getElementById('tooltipButton');
const tooltipPanel = document.getElementById('tooltipPanel');

tooltipButton.addEventListener('click', () => {
  const isVisible = tooltipPanel.classList.toggle('is-visible');
  tooltipButton.setAttribute('aria-expanded', String(isVisible));
  tooltipPanel.setAttribute('aria-hidden', String(!isVisible));
});

const modeButtons = document.querySelectorAll('.mode-toggle__button');
modeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    modeButtons.forEach((btn) => btn.setAttribute('aria-selected', 'false'));
    button.setAttribute('aria-selected', 'true');
    activeMode = button.dataset.mode;
    updatePointsVisibility();
  });
});

canvas.addEventListener('pointerdown', (event) => {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(pointsGroup.children);

  if (intersects.length > 0) {
    selectedPoint = intersects[0].object;
    openPanel(selectedPoint.userData.location);
  }
});

function animate(time) {
  requestAnimationFrame(animate);
  const pulse = (Math.sin(time * 0.002) + 1.5) * 0.6;

  pointsGroup.children.forEach((point) => {
    point.material.emissiveIntensity = 1.6 + pulse;
  });

  globe.rotation.y += 0.0005;
  stars.rotation.y += 0.0002;

  renderer.render(scene, camera);
}

updatePointsVisibility();
animate(0);

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
