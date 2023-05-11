import * as THREE from "three";

const canvas = document.querySelector("canvas.webgl");

const scene = new THREE.Scene();

const SIZES = {
  width: 800,
  height: 600,
};

const camera = new THREE.PerspectiveCamera(75, SIZES.width / SIZES.height);
camera.translateZ(3);
scene.add(camera);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const box = new THREE.Mesh(geometry, material);
scene.add(box);

const renderer = new THREE.WebGLRenderer({
  canvas,
});
renderer.setSize(SIZES.width, SIZES.height);
renderer.render(scene, camera);
