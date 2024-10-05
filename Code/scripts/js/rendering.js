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
	info: `<li>Discovery Date: August 24, 2016</li>
<li>Distance from Earth: ~4.24 light years</li>
<li>Type: Terrestrial </li>
<li>Radius: ~1.07 times that of Earth</li>
<li>Composition: Nitrogen, Oxygen, Carbon Dioxide, Argon, Water</li>
<li>Mass: Estimated to be around 1.17 Earth masses (6.986×1021 tons)</li>
<li>Diameter: ~14% of the Sun's diameter</li>
<li>Proxima Centauri b orbits in the habitable zone of its star, Proxima Centauri, the closest star to the Sun.</li>
<li>Conditions might allow for liquid water to exist on its surface, although the planet is subject to intense stellar flares and radiation due to its proximity to its star.</li>
`,
	extra: `
<li>Semi-Major Axis: Approximately 0.0485 AU</li>
<li>Eccentricity: 0.0</li>
<li>Distance from Star: ~7.5 million km</li>
<li>Spectral Type: M5.5 (Red Dwarf)</li>
<li>Star Age: Approximately 4.85 billion years</li>
<li>Luminosity: 0.15% of the Sun's luminosity</li>

`,
	title: "Proxima_Centauri_b"
}, {
	name: "55_Cancri_e.glb",
	x: -30,
	y: -30,
	z: -30,
	info: `<li>Discovery Date: August 30, 2004</li>
<li>Distance from Earth: ~41 light-years</li>
<li>Type: Super-Earth</li>
<li>Radius: 1.875 times that of Earth</li>
<li>Composition: Carbon, Silicon, Hydrogen, Diamond, Graphite, Hydrogen</li>
<li>Mass: Estimated at about 8.08 Earth masses (4.82×10²⁴ tons)</li>
<li>Diameter: 80% larger than Earth</li>
<li>Orbital Period: 0.736 days (17.6 hours)</li>

<li>55 Cancri e is located extremely close to its star, with temperatures on the surface exceeding 2,000°C.</li>
<li>There is speculation about volcanic activity or even liquid lava oceans. </li>
`,
	extra: `<li>Semi-Major Axis: Approximately 0.0156 AU</li>
<li>Eccentricity: ~0.03 (mildly eccentric orbit)</li>
<li>Distance from Star: ~2.2 million km</li>
<li>Spectral Type: K0</li>
<li>Star Age: Approximately 8 billion years</li>
<li>Luminosity: About 40% of the Sun's luminosity</li>

`,
	title: "55_Cancri_e"
}/* , {
	name: "HD_189733_b.glb",
	x: 15,
	y: 0,
	z: 15,
	info: "This is a big exoplanet. This is used for testing for now. Lorem Ipsum.",
	title: "HD_189733_b"
}, {
	name: "Kepler_186_f.glb",
	x: -10,
	y: -10,
	z: -10,
	info: "This is a big exoplanet. This is used for testing for now. Lorem Ipsum.",
	title: "Kepler_186_f"
}, {
	name: "Kepler_452_b.glb",
	x: -5,
	y: -5,
	z: -5,
	info: `<li>Discovery Date: July 23, 2015</li>
<li>Distance from Earth: ~1,400 light-years</li>
<li>Type: Super-Earth</li>
<li>Radius: 1.63 times that of Earth</li>
<li>Composition: 82% nitrogen, 14% Oxygen, 2% Carbon Dioxide, 2% trace element</li>
<li>Mass: Estimated at about 3.29 Earth masses (1.964×1022 tons)</li>
<li>Diameter: 60% larger than Earth</li>
<li>Orbital Period: 384.8 days (~5% longer than Earth's year)</li>
<li>Kepler-452b is located in the habitable zone of its star, conditions allow for liquid water to exist on its surface.</li>
<li>Composition similar to Neptune, with a small rocky core surrounded by a thick mantle of ice and gasses.</li>
<li>Kepler-452b was notable for being the first approximately Earth-sized planet found in the habitable zone of a Sun-like star.</li>
The<li> data leading to the discovery of Kepler-452b was collected through the Kepler Space Telescope.</li>`,
	extra: `
		<li>Semi-Major Axis: Approximately 1.046 AU</li>
		<li>Eccentricity: 0.0</li>
		<li>Distance from Star: 156.5 million km</li>
		<li>Spectral Type: G2</li>
		<li>Star Age: Approximately 6 billion years</li>
		<li>Luminosity: 20% brighter than the Sun</li>
`
	title: "Kepler_452_b"
}, {
	name: "Wasp_12_b.glb",
	x: 15,
	y: 0,
	z: -15,
	info: "This is a big exoplanet. This is used for testing for now. Lorem Ipsum.",
	title: "Wasp_12_b"
} */];
const loader = new GLTFLoader();
let objects = [];
let sizes = {};
const lights = [{
	x: 0,
	y: 0,
	z: 0,
	color: 0xffffff,
	intensity: 1.5,
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

			console.log(objects[objects.length-1].children[0]);
			scene.add(objects[objects.length-1]);

			
			let box = new THREE.Box3().setFromObject(glb.scene);
			let s = box.getSize(new THREE.Vector3());
			sizes[objects[objects.length-1].children[0].name] = (s.x+s.y+s.z)/3;
		}, function(xhr) {
			console.log((xhr.loaded/xhr.total*100)+"% loaded of "+model);
		}, function(error) {
			console.error("There was an error loading "+model+":", error);
		});
		console.log(objects);
	});

	//adding lights
	lights.forEach(light => {
		let l = new THREE.PointLight(light.color||0xffffff, light.intensity||1, light.distance||100);
		l.position.set(light.x||0, light.y||0, light.z||0);
		scene.add(l);
	});
	
	//world light
	const ambientLight = new THREE.AmbientLight(0x404040, 3); // color of light(keep this color), intensity(default=1)
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

function displacement(size) {
	return 3+size;
}

function goTo(p, name) {
	let pos = new THREE.Vector3();
	pos.add(p.children[0].position);
	pos.add(p.position);
	
	gsap.to(camera.position, {
		duration: 1,
		x: pos.x,
		y: pos.y,
		z: pos.z+displacement(sizes[name]),
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
		//object.children[0].rotation.y = (radians/10);
	});
	raycaster.setFromCamera(pointer, camera);
	const intersects = raycaster.intersectObjects(scene.children, true);
	if (intersects.length > 0) {
		if (INTERSECTED == null || INTERSECTED.object != intersects[0].object) {
			INTERSECTED = {name: intersects[0].object.name, object: intersects[0].object.parent};
		}
	} else {
		INTERSECTED = null;
	}
	renderer.render(scene, camera);
	window.requestAnimationFrame(loop);
}
renderer.setAnimationLoop(loop);