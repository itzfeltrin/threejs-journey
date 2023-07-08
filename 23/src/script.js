import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as lil from "lil-gui";

THREE.ColorManagement.enabled = false;

/**
 * Base
 */
// Debug
const gui = new lil.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */
const object1 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: "#ff0000" })
);
object1.position.x = -2;

const object2 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: "#ff0000" })
);

const object3 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: "#ff0000" })
);
object3.position.x = 2;

scene.add(object1, object2, object3);

// object1.updateMatrixWorld();
// object2.updateMatrixWorld();
// object3.updateMatrixWorld();

/**
 * Raycaster
 */
const raycaster = new THREE.Raycaster();
// const rayOrigin = new THREE.Vector3(-3, 0, 0);
// const rayDirection = new THREE.Vector3(10, 0, 0);
// rayDirection.normalize();
// raycaster.set(rayOrigin, rayDirection);

// const intersect = raycaster.intersectObject(object2);
// console.log(intersect);

// const intersects = raycaster.intersectObjects([object1, object2, object3]);
// console.log(intersects);

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
 * Mouse
 */
const mouse = new THREE.Vector2(-1, 1);

window.addEventListener("mousemove", (e) => {
  mouse.x = (e.clientX / sizes.width) * 2 - 1;
  mouse.y = -(e.clientY / sizes.height) * 2 + 1;
});

window.addEventListener("click", (_) => {
  clicked = currentIntersect || null;
  console.log(clicked);
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
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const gltfLoader = new GLTFLoader();
const duck = await new Promise((resolve) => {
  gltfLoader.load("/models/Duck/glTF-Binary/Duck.glb", (gltf) => {
    resolve(gltf);
  });
});
duck.scene.position.y = -1.2;
scene.add(duck.scene);

const ambientLight = new THREE.AmbientLight("#ffffff", 0.3);
const directionalLight = new THREE.DirectionalLight("#ffffff", 0.7);
directionalLight.position.set(1, 2, 3);
scene.add(ambientLight, directionalLight);

/**
 * Animate
 */
const clock = new THREE.Clock();

let currentIntersect = null;
let clicked = null;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Animate objects
  object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5;
  object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5;
  object3.position.y = Math.sin(elapsedTime * 1.4) * 1.5;

  // Cast a ray
  // const rayOrigin = new THREE.Vector3(-3, 0, 0);
  // const rayDirection = new THREE.Vector3(1, 0, 0);
  // rayDirection.normalize();
  // raycaster.set(rayOrigin, rayDirection);

  raycaster.setFromCamera(mouse, camera);

  // const objectsToTest = [object1, object2, object3];
  // const intersects = raycaster.intersectObjects(objectsToTest);
  // const intersectsIds = intersects.reduce(
  //   (acc, item) => ({ ...acc, [item.object.id]: true }),
  //   {}
  // );

  // for (const obj of objectsToTest) {
  // if (obj === clicked?.object) {
  //   obj.material.color.set("#00ff00");
  // } else {
  //   if (intersectsIds[obj.id]) {
  //     obj.material.color.set("#0000ff");
  //   } else {
  //     obj.material.color.set("#ff0000");
  //   }
  // }
  // }

  // if (intersects.length) {
  //   if (!currentIntersect) {
  //     console.log("mouse enter");
  //     currentIntersect = intersects[0];
  //   }
  // } else {
  //   currentIntersect = null;
  // }

  const intersect = raycaster.intersectObject(duck.scene);
  const scale = intersect.length ? 2 : 1;

  duck.scene.scale.set(scale, scale, scale);

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
