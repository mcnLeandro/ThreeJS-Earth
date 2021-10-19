import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js';
import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';
import atomosphereVertexShader from './shaders/atomosphereVertex.glsl';
import atomosphereFragmentShader from './shaders/atomosphereFragment.glsl';
import gsap from 'gsap';
import globeImgUrl from './img/globe.jpg'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  innerWidth / innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
});
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(window.devisePixelRatio);
document.body.appendChild(renderer.domElement);
new OrbitControls(camera, renderer.domElement);
// create sphere
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(5, 50, 50),
  new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      globeTexture: {
        value: new THREE.TextureLoader().load(globeImgUrl),
      },
    },
  })
);

scene.add(sphere);

// create atomosphere
const atomosphere = new THREE.Mesh(
  new THREE.SphereGeometry(5, 50, 50),
  new THREE.ShaderMaterial({
    vertexShader: atomosphereVertexShader,
    fragmentShader: atomosphereFragmentShader,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
  })
);
atomosphere.scale.set(1.1, 1.1, 1.1);
scene.add(atomosphere);

const group = new THREE.Group();
group.add(sphere);
scene.add(group);

const starGeometry = new THREE.BufferGeometry();
const starMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  side: THREE.BackSide,
});
const starVertices = [];
for (let i = 0; i < 5000; i++) {
  const x = (Math.random() - 0.5) * 2000;
  const y = (Math.random() - 0.5) * 2000;
  const z = Math.random() * (2000 - (-2000)) + (-2000);
  starVertices.push(x, y, z);
}

console.log(starVertices);
starGeometry.setAttribute(
  'position',
  new THREE.Float32BufferAttribute(starVertices, 3)
);
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

camera.position.z = 15;

const mouse = {
  x: undefined,
  y: undefined,
};
addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / innerWidth) * 2 - 1;
  mouse.y = (event.clientY / innerHeight) * 2 - 1;
});

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  sphere.rotation.y += 0.001;

  gsap.to(group.rotation, {
    x: mouse.y * 0.3,
    y: mouse.x * 0.5,
    duration: 2,
  });
}

animate();
