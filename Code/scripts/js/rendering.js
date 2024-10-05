import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";

//pan, zoom etc
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";

//importing custom models with glb
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

//variables
let width = window.innerWidth;
let height = window.innerHeight;
let INTERSECTED;

//constants
const SPEED = 3;
const scene = new THREE.Scene();
const models = [{
	name: "bigSphere.glb",
	x: 5,
	y: 5,
	z: 5,
	info: "This is a big exoplanet"
}, {
	name: "smallSphere.glb",
	x: -5,
	y: -5,
	z: -5,
	info: "Lorem Ipsum"
}];
const displacement = 10;
const loader = new GLTFLoader();
let objects = [];
const lights = [{
	x: 0,
	y: 10,
	z: 10,
	color: 0xffffff,
	intensity: 2,
	distance: 100
}];
const pointer = new THREE.Vector2(0, 0);

//raycaster
let raycaster = new THREE.Raycaster();

//init
(function() {
	//loading GLB models
	models.forEach(model => {
		loader.load("/assets/"+model.name, function(glb) {
			console.log("Loaded "+model);
			
			objects.push(glb.scene);
			objects[objects.length-1].position.set(model.x, model.y, model.z);
			objects[objects.length-1].updateMatrixWorld();

			scene.add(objects[objects.length-1]);
		}, function(xhr) {
			console.log((xhr.loaded/xhr.total*100)+"% loaded of "+model);
		}, function(error) {
			console.error("There was an error loading "+model+":", error);
		});
	});

	//adding lights
	lights.forEach(light => {
		let l = new THREE.PointLight(light.color||0xffffff, light.intensity||1, light.distance||100);
		l.position.set(light.x||0, light.y||0, light.z||0);
		scene.add(l);
	});
	
	//world light
	const ambientLight = new THREE.AmbientLight(0x404040, 1); // color of light(keep this color), intensity(default=1)
	scene.add(ambientLight);
})();


//camera
const camera = new THREE.PerspectiveCamera(45, width / height);
camera.position.z = 20;
scene.add(camera);

//renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(width, height);
renderer.setPixelRatio(2);
renderer.render(scene, camera);

//controls
const controls = new OrbitControls(camera, canvas);
controls.enableDampening = true;
controls.enablePan = true;
controls.enableZoom = true;
controls.autoRotation = true;
controls.update();

//adjust canvas size if screen changes
window.addEventListener("resize", () => {
	width = window.innerWidth;
	height = window.innerHeight;
	camera.aspect = width / height;
	camera.updateProjectionMatrix();
	renderer.setSize(width, height);
});

//arrow controls
window.addEventListener("keyup", function(key) {
	if (key.key == "ArrowUp" || key.key.toLowerCase() == "w") {
		camera.position.add(camera.getWorldDirection().multiplyScalar(SPEED));
	}
	else if (key.key == "ArrowDown" || key.key.toLowerCase() == "s") {
		camera.position.add(camera.getWorldDirection().multiplyScalar(-SPEED));
	}
});

window.addEventListener("mousemove", function(event) {
	pointer.set(
		(event.clientX / window.innerWidth) * 2 - 1,
		-(event.clientY / window.innerHeight) * 2 + 1
	);
});

window.addEventListener("click", function() {
	if (INTERSECTED == null) return;
	let p = INTERSECTED;
	gsap.to(camera.position, {
		duration: 1,
		x: p.position.x,
		y: p.position.y,
		z: p.position.z+displacement,
		onUpdate: function() {
			camera.lookAt(p.position);
			console.log(p.children);
		}
	});
});

//render again every frame
function loop(time) {
	objects.forEach(object => {
		const radians = ( time / 1000 ) % ( 2 * Math.PI );
		object.rotation.y = (radians);
	});
	raycaster.setFromCamera(pointer, camera);
	const intersects = raycaster.intersectObjects(scene.children, true);
	if (intersects.length > 0) {
		if (INTERSECTED != intersects[0].object) {
			INTERSECTED = intersects[0].object.parent;
		}
	} else {
		INTERSECTED = null;
	}
	renderer.render(scene, camera);
	window.requestAnimationFrame(loop);
}
renderer.setAnimationLoop(loop);



//spheres
/* const geometry = new THREE.SphereGeometry(3, 64, 64);
const geometry2 = new THREE.SphereGeometry(4, 64, 64);
const geometry3 = new THREE.SphereGeometry(2, 64, 64);
const material = new THREE.MeshStandardMaterial({
	color: "#00ff83",
	roughness: 0.5
});
const material2 = new THREE.MeshStandardMaterial({
	color: "#5046ff",
	roughness: 0.6
});
const material3 = new THREE.MeshStandardMaterial({
	color: "#ff4687",
	roughness: 0.6
});
const mesh = new THREE.Mesh(geometry, material);
const mesh2 = new THREE.Mesh(geometry2, material2);
const mesh3 = new THREE.Mesh(geometry3, material3);
mesh2.position.set(-8, 0, 0);
mesh3.position.set(8, 0, 0);
scene.add(mesh);
scene.add(mesh2);
scene.add(mesh3);
*/

//scene.add(new THREE.AxesHelper(5));