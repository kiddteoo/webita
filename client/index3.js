import * as THREE from 'three';
import { OBJLoader } from './node_modules/three/examples/jsm/loaders/OBJLoader.js';
import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls.js';
import { MTLLoader } from './node_modules/three/examples/jsm/loaders/MTLLoader.js';
import { GLTFLoader } from './node_modules/three/examples/jsm/loaders/GLTFLoader.js';
const w = window.innerWidth;
const h = window.innerHeight;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 1000);


const container = document.getElementById('section3');
container.width = "100%";

const canvas = container.querySelector('canvas');
document.body.style.touchAction = 'none';

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setPixelRatio(window.devicePixelRatio);
canvas.width = "100%";
canvas.height = container.offsetHeight;
renderer.setSize(container.offsetWidth, container.offsetHeight);
renderer.setClearColor( 0xffffff, 0);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.1;
controls.rotateSpeed = 0.1;
controls.minAzimuthAngle = -Math.PI/4; // minimum horizontal rotation
controls.maxAzimuthAngle = Math.PI/4; // maximum horizontal rotation
controls.minPolarAngle = 0; // minimum vertical rotation
controls.maxPolarAngle = Math.PI/2; // maximum vertical rotation
controls.minDistance = 50; // minimum distance
controls.maxDistance = 500;


// Adjust camera position to be closer to the model
camera.position.z = 145;
camera.position.x = -102;
camera.position.y = 53;
document.addEventListener('wheel', function(event) {
	// Disable zoom if the user is scrolling
	controls.enableZoom = false;
	
  })
controls.update();

/* function init(geometry){ */
var textureLoader = new THREE.TextureLoader();

var loader = new GLTFLoader();
loader.load(
	'./assets/scene.gltf',  // The URL of the GLTF model file
	function (gltf) {

	  
		// Move the model to the left side of the screen
		gltf.scene.position.x = -100;
		gltf.scene.rotation.y = 0.8;
		
		// Add the model to the scene
		scene.add(gltf.scene);
	},
	function (xhr) {
		console.log((xhr.loaded / xhr.total * 100) + '% loaded');
	},
	function (error) {
		console.error('Error loading GLTF model', error);
	}
);

var ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);


var directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(0, 1, 0);
scene.add(directionalLight);

var pointLight = new THREE.PointLight(0xffffff, 2, 100);
pointLight.position.set(0, 0, 10);
scene.add(pointLight);

function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
	if (window.innerWidth < 768) {
		scene.children[3].position.x = 0;
		scene.children[3].rotation.y = 0;
	  }
	 

}
animate();


function handleWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', handleWindowResize, false);