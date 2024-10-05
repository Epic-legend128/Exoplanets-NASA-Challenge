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
	name: "Proxima_Centauri_b.glb",
	x: 5,
	y: 5,
	z: 5,
	info: "This is a big exoplanet. This is used for testing for now. Lorem Ipsum.",
	title: "Proxima_Centauri_b"
}, {
	name: "Earth.glb",
	x: -5,
	y: 5,
	z: 5,
	info: "This is the Earth.",
	title: "Earth"
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
	models.forEach(model => {
		//filling options for searching
		document.getElementById("selector").innerHTML += "<option value='"+model.title+"'>"+model.title+"</option>";

		//loading GLB models
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

//when camera is transformed
controls.addEventListener("change", _ => {
	deleteText();
});

//searching for planets
document.getElementById("selector").addEventListener("change", function(e) {
	let v = e.target.selectedOptions[0].value;
	objects.forEach(object => {
		let o = object.children[0];
		console.log(o);
		if (v == o.name) {
			goTo(object, o.name);
		}
	});
});

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
		deleteText();
		camera.position.add(camera.getWorldDirection().multiplyScalar(SPEED));
	}
	else if (key.key == "ArrowDown" || key.key.toLowerCase() == "s") {
		deleteText();
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
	deleteText();
	if (INTERSECTED == null) return;
	let p = INTERSECTED.object;
	let name = INTERSECTED.name;
	goTo(p, name);
});

function goTo(p, name) {
	let pos = new THREE.Vector3();
	pos.add(p.children[0].position);
	pos.add(p.position);
	console.log("Start")
	console.log(p.children[0].position);
	console.log(p.position);
	console.log(pos);
	gsap.to(camera.position, {
		duration: 1,
		x: pos.x,
		y: pos.y,
		z: pos.z+displacement,
		onUpdate: function() {
			camera.lookAt(pos);
			displayText(name);
		}
	});
}

function deleteText() {
	document.getElementById("info").innerHTML = "";
}

function displayText(name) {
	console.log("Inside with "+name);
	let info = "";
	Object.keys(models).forEach(x => {
		if (models[x].title == name) {
			info = models[x].info;
		}
	});
	document.getElementById("info").innerHTML = info;
}

//render again every frame
function loop(time) {
	objects.forEach(object => {
		const radians = ( time / 1000 ) % ( 2 * Math.PI );
		// uncomment later
		object.children[0].rotation.y = (radians);
	});
	raycaster.setFromCamera(pointer, camera);
	const intersects = raycaster.intersectObjects(scene.children, true);
	if (intersects.length > 0) {
		if (INTERSECTED == null || INTERSECTED.object != intersects[0].object) {
			//console.log(intersects[0]);
			INTERSECTED = {name: intersects[0].object.name, object: intersects[0].object.parent};
		}
	} else {
		INTERSECTED = null;
	}
	renderer.render(scene, camera);
	window.requestAnimationFrame(loop);
}
renderer.setAnimationLoop(loop);