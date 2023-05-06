import * as THREE from 'three';
import { OBJLoader } from './node_modules/three/examples/jsm/loaders/OBJLoader.js';
import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls.js';
import { MTLLoader } from './node_modules/three/examples/jsm/loaders/MTLLoader.js';
import { GLTFLoader } from './node_modules/three/examples/jsm/loaders/GLTFLoader.js';
const w = window.innerWidth;
const h = window.innerHeight;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
/* const helper = new THREE.CameraHelper( camera );
scene.add( helper ); */
camera.position.z = 5;
camera.position.x = -11.04;
camera.position.y = 0;

const container = document.getElementById('section5');
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
document.addEventListener('wheel', function(event) {
	controls.enableZoom = false;
	
  })
controls.update();

/* function init(geometry){ */
var textureLoader = new THREE.TextureLoader();

var loader = new GLTFLoader();
const models = ['./assets/melia3.glb', './assets/teoo.glb', './assets/neisis.glb'];
Promise.all(models.map(url => loader.loadAsync(url)))
  .then(gltfModels => {
    gltfModels.forEach((gltf, index) => {
      const model = gltf.scene;
      if(index == 0)
      {
        model.position.y = -13;
        model.rotation.y = 5.6;
        model.scale.set(22, 22, 22);
        model.position.z = -10; // Adjust the spacing between models
        
      }
      else if(index == 1){
        model.position.y = -11;
        model.rotation.y = 5.2;
        model.scale.set(18, 18, 18);
        model.position.z = -0; // Adjust the spacing between models
      }
      else if(index == 2){
        model.position.y = -9;
        model.rotation.y = 4.8;
        model.scale.set(15, 15, 15);
        model.position.z = 7; // Adjust the spacing between models
      }
      scene.add(model);
    });
  });
/* loader.load(
  './melia2.glb',  // The URL of the GLTF model file
  function (gltf) {


    scene.add(gltf.scene);
    gltf.scene.position.y = -10;
    gltf.scene.rotation.y = 5.5;
    gltf.scene.scale.set(20, 20, 20);


	
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    console.error('Error loading GLTF model', error);
  }
);
 */

console.log(scene.children)
var ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();


function onMouseMove(event) {
  // Calculate mouse position in normalized device coordinates
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Raycast from the camera
  raycaster.setFromCamera(mouse, camera);

  // Check for intersections with objects in the scene
  const intersects = raycaster.intersectObjects(scene.children);

  // Get a reference to the text div
 
  const teo = document.getElementById("text-teo");
  const melia = document.getElementById("text-melia");
  const narcis = document.getElementById("text-narcis");


  // If there is at least one intersection and the text is hidden, show it
  if (intersects.length > 0  ) {

    // Print the name of the intersected object to the console
    if(intersects[0].object.name == "Melia")
	{
		melia.style.display = "block";
	}

	if(intersects[0].object.name == "teo")
	{
		teo.style.display = "block";
	}

	if(intersects[0].object.name == "neisis")
	{
		narcis.style.display = "block";
	}
  }

  // If there are no intersections and the text is visible, hide it
   if (intersects.length === 0 && melia.style.display === "block") {
    melia.style.display = "none";
  } 
  if (intersects.length === 0 && teo.style.display === "block") {
    teo.style.display = "none";
  } 
  if (intersects.length === 0 && narcis.style.display === "block") {
    narcis.style.display = "none";
  } 
}

function onMouseClick(event) {
	// Calculate mouse position in normalized device coordinates
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  
	// Raycast from the camera
	raycaster.setFromCamera(mouse, camera);
  
	// Check for intersections with objects in the scene
	const intersects = raycaster.intersectObjects(scene.children);
  
	// Get a reference to the text div
   

	// If there is at least one intersection and the text is hidden, show it
	if (intersects.length > 0  ) {
  
	  // Print the name of the intersected object to the console
	  if(intersects[0].object.name == "Melia")
	  {
		  window.open('https://github.com/SergiMS03', '_blank');
	  }
	  	  if(intersects[0].object.name == "teo")
	  {
		  window.open('https://github.com/kiddteoo', '_blank');
	  }
	  if(intersects[0].object.name == "neisis")
	  {
		  window.open('https://github.com/A19Narcis', '_blank');
	  }

	}
  
  }

window.addEventListener("mousemove", onMouseMove, false);
window.addEventListener("click", onMouseClick, false);


function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}
animate();


function handleWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', handleWindowResize, false);