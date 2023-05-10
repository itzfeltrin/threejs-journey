const scene = new THREE.Scene();

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

const SIZES = {
  width: 800,
  height: 600,
};

const camera = new THREE.PerspectiveCamera(75, SIZES.width / SIZES.height);
camera.position.z = 3;
scene.add(camera);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("canvas.webgl"),
});
renderer.setSize(SIZES.width, SIZES.height);
renderer.render(scene, camera);
