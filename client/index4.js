import * as THREE from 'three';
import { OBJLoader } from './node_modules/three/examples/jsm/loaders/OBJLoader.js';
import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls.js';
import { MTLLoader } from './node_modules/three/examples/jsm/loaders/MTLLoader.js';
import { GLTFLoader } from './node_modules/three/examples/jsm/loaders/GLTFLoader.js';
const w = window.innerWidth;
const h = window.innerHeight;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 1000);


const container = document.getElementById('section4');
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
controls.minAzimuthAngle = -Math.PI/4;
controls.maxAzimuthAngle = Math.PI/4; 
controls.minPolarAngle = 0;
controls.maxPolarAngle = Math.PI/2; 
controls.minDistance = 50; 
controls.maxDistance = 500;


camera.position.z = 68;
camera.position.x = -59;
camera.position.y = 31;
document.addEventListener('wheel', function(event) {
	controls.enableZoom = false;
	
  })
controls.update();

/* function init(geometry){ */
var textureLoader = new THREE.TextureLoader();

var loader = new GLTFLoader();
loader.load(
	'./assets/laptop/scene.gltf', 
	function (gltf) {

	  
		gltf.scene.position.x = -40;
		gltf.scene.position.y = 10;
		gltf.scene.rotation.x = 0.2;
		
		scene.add(gltf.scene);
	},
	function (xhr) {
		console.log((xhr.loaded / xhr.total * 100) + '% loaded');
	},
	function (error) {
		console.error('Error loading GLTF model', error);
	}
);


var directionalLight = new THREE.DirectionalLight(0xffffff, 2.5);
directionalLight.position.set(0, 1, 0);
scene.add(directionalLight);
var flag = false;

function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
	if (window.innerWidth < 768) {
		scene.children[1].position.x = 0;
		scene.children[1].rotation.y = 0;
	  }

	  if(scene.children[1].rotation.x < 0.8 && flag == false){
		scene.children[1].rotation.x += 0.004;
		
	  }
	  if(scene.children[1].rotation.x >= 0.8)
	  {
		flag = true;
		scene.children[1].rotation.x -= 0.004;
	  }
	  if(scene.children[1].rotation.x < 0.8 && flag == true){
		scene.children[1].rotation.x -= 0.004;
		if(scene.children[1].rotation.x <= 0.2)
			flag = false;
	  }
	  	

	  console.log(scene.children[1].rotation)


}
animate();


function handleWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', handleWindowResize, false);