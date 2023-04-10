import * as THREE from 'three';
let camera, scene, renderer, material, mouseX = 0, mouseY = 0, windowHalfX = window.innerWidth / 2, windowHalfY = window.innerHeight / 2;
init();
animate();
function init() {
	camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 2000);
	camera.position.z = 1000;
	scene = new THREE.Scene();
	scene.fog = null;
	const geometry = new THREE.BufferGeometry();
	const vrtx = [];
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
		shading: THREE.FlatShading,
	});
	const particles = new THREE.Points(geometry, material);
	scene.add(particles);
	const container = document.getElementById('section1');
	container.width = "100%";
	var texture = new THREE.Texture(container);
	texture.needsUpdate = true;
	const canvas = container.querySelector('canvas');
	renderer = new THREE.WebGLRenderer({ canvas });
	renderer.setPixelRatio(window.devicePixelRatio);
	canvas.width = container.offsetWidth;
	canvas.height = container.offsetHeight;
	renderer.setSize(container.offsetWidth, container.offsetHeight);
	document.body.style.touchAction = 'auto';
	document.body.addEventListener('pointermove', mouseMove);
	window.addEventListener("keydown", onKeyDown);
	window.addEventListener('resize', windowRes);
}
function onKeyDown(event) {
	if (event.key === "s" || event.key === "S") {
		camera.position.z -= 10;
	}
	if (event.key === "w" || event.key === "W") {
		camera.position.z += 10;
	}
}
function windowRes() {
	windowHalfX = container.offsetWidth / 2;
	windowHalfY = container.offsetHeight / 2;
	camera.aspect = container.offsetWidth / container.offsetHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(container.offsetWidth, container.offsetHeight);
}
function mouseMove(event) {
	mouseX = event.clientX - windowHalfX;
	mouseY = event.clientY - windowHalfY;
}
function animate() {
	requestAnimationFrame(animate);
	render();
}
function render() {
	camera.position.x += (mouseX * 2 - camera.position.x) * 0.02;
	camera.position.y += (-mouseY * 2 - camera.position.y) * 0.02;

	camera.lookAt(scene.position);
	renderer.render(scene, camera);
	scene.rotation.x += 0.001;
	scene.rotation.y += 0.002;
}