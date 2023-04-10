import * as THREE from 'three';

let camera, scene, renderer, material, geometry,  mouseX = 0, mouseY = 0, windowHalfX = window.innerWidth / 2, windowHalfY = window.innerHeight / 2, vrtx, composer;


export function init() {
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 5000);
    camera.position.z = 1;
    scene = new THREE.Scene();
    scene.fog = null;
    geometry = new THREE.BufferGeometry();
    vrtx = [];
    const size = 2000;
    for (let i = 0; i < 10000; i++) {
        const x = (Math.random() * size + Math.random() * size) / 2 - size / 2;
        const y = (Math.random() * size + Math.random() * size) / 2 - size / 2;
        const z = (Math.random() * size + Math.random() * size) / 2 - size / 2;
        vrtx.push(x, y, z);
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vrtx, 3));
    material = new THREE.PointsMaterial({
        size: 2,
        color: 0xffffff,
        flatShading: true,
    });
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    particles.velocity = 0;
    particles.acceleration = 0.02;
    const container = document.getElementById('section2');
    container.width = "100%";
    var texture = new THREE.Texture(container);
    texture.needsUpdate = true;

    const canvas = container.querySelector('canvas');
    renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setPixelRatio(window.devicePixelRatio);
    canvas.width = "100%";
    canvas.height = container.offsetHeight;
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    document.body.style.touchAction = 'auto';
    window.addEventListener('resize', onWindowResize, false);
}


function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

export function animate2(param) {
	const positions = geometry.attributes.position.array;
	for (let i = 0; i < positions.length; i += 3) {
		if (param !== undefined) {
			positions[i + 2] -= param; // Move particles towards camera by param units
		} else {
			positions[i + 2] -= 0; // Default value: Move particles towards camera by 0 units
		}
        
        if (positions[i + 2] < -1000) { // If particle has gone too far, reset its position
			positions[i + 2] = 10;
		}
	}
	geometry.attributes.position.needsUpdate = true;
	render();
	requestAnimationFrame(() => {
	    animate2(param);
	});
}
function render() {

	camera.lookAt(scene.position);
	renderer.render(scene, camera);
}
