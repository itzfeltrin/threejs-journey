import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { GroundProjectedSkybox } from "three/examples/jsm/objects/GroundProjectedSkybox";
import * as lil from "lil-gui";

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader();
// const cubeTextureLoader = new THREE.CubeTextureLoader().setPath(
//   "/environmentMaps"
// );
const rgbeLoader = new RGBELoader().setPath("/environmentMaps");
const textureLoader = new THREE.TextureLoader().setPath("/environmentMaps");

/**
 * Base
 */
// Debug
const gui = new lil.GUI();
const global = {};

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Update all materials
 */
const updateAllMaterials = () => {
  scene.traverse((child) => {
    if (child.isMesh && child.material.isMeshStandardMaterial) {
      child.material.envMapIntensity = global.envMapIntensity;
    }
  });
};

/**
 * Environment map
 */
// LDR (Low Dynamic Range) cube texture
// const environmentMap = cubeTextureLoader.load([
//   "/0/px.png",
//   "/0/nx.png",
//   "/0/py.png",
//   "/0/ny.png",
//   "/0/pz.png",
//   "/0/nz.png",
// ]);

// HDR (RGBE) equirectangular
// const environmentMap = await rgbeLoader.loadAsync("/blender-2k.hdr");

// LDR equirectangular
// const environmentMap = await textureLoader.loadAsync(
//   "/realistic_shredded_albert_einstein_eats_a_pepperon.jpg"
// );

// Ground projected skybox
// const environmentMap = await rgbeLoader.loadAsync("/2/2k.hdr");

// Base environment map
const environmentMap = textureLoader.load(
  "/realistic_shredded_albert_einstein_eats_a_pepperon.jpg"
);

environmentMap.mapping = THREE.EquirectangularReflectionMapping;
// This is needed when using jpg environtmentMap
environmentMap.colorSpace = THREE.SRGBColorSpace;

// scene.environment = environmentMap;
scene.background = environmentMap;
scene.backgroundBlurriness = 0.05;
scene.backgroundIntensity = 5;

gui.add(scene, "backgroundBlurriness").min(0).max(1).step(0.01);
gui.add(scene, "backgroundIntensity").min(0).max(10).step(0.1);

// const skybox = new GroundProjectedSkybox(environmentMap);
// skybox.scale.setScalar(50);
// scene.add(skybox);

// gui.add(skybox, "radius", 1, 200, 0.1).name("skyboxRadius");
// gui.add(skybox, "height", 1, 200, 0.1).name("skyboxHeight");

global.envMapIntensity = 1;

gui
  .add(global, "envMapIntensity")
  .min(0)
  .max(10)
  .step(0.001)
  .onChange(updateAllMaterials);

/**
 * Torus Knot
 */
const torusKnot = new THREE.Mesh(
  new THREE.TorusKnotGeometry(1, 0.4, 100, 16),
  new THREE.MeshStandardMaterial({
    roughness: 0.3,
    metalness: 1,
    color: 0xaaaaaa,
  })
);
torusKnot.material.envMap = environmentMap;
torusKnot.position.x = -4;
torusKnot.position.y = 4;
scene.add(torusKnot);

gui.add(torusKnot.material, "roughness").min(0).max(1).step(0.01);
gui.add(torusKnot.material, "metalness").min(0).max(1).step(0.01);

/**
 * Models
 */
const flightHelmet = await gltfLoader.loadAsync(
  "/models/FlightHelmet/glTF/FlightHelmet.gltf"
);
flightHelmet.scene.scale.set(10, 10, 10);
scene.add(flightHelmet.scene);
updateAllMaterials();

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(4, 5, 4);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.target.y = 3.5;
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();
const tick = () => {
  // Time
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
