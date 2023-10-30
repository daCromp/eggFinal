import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
// renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 3, 0);

// camera.position.z = 5;

// var ambientLight = new THREE.AmbientLight(0x404040); // A soft white light
// ambientLight.intensity = 100;
// scene.add(ambientLight);

// const light = new THREE.PointLight( 0xffffff, 10, 100 );
// light.position.set( 0, 2, 0 );
// scene.add( light );

const loader = new GLTFLoader();

let table;

loader.load('./modelV2.glb',
	function (gltf) {
		table = gltf.scene;
		scene.add(gltf.scene);
	},
	function (xhr) {
		console.log((xhr.loaded / xhr.total * 100) + '% loaded');
	},
	function (error) {
		console.log('An error happened');
	}
);


function phoneAnimation(phone) {
    phone.intensity += 1;
    console.log(`Intensity is now ${phone.intensity}`);
}


const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

let lampLight = 'on';
let phoneLight = 'off';

function onClick(event) {

	const lamp1 = scene.getObjectByName("lampLight1");
	const lamp2 = scene.getObjectByName("lampLight2");
	const phone = scene.getObjectByName("phoneLight");

	raycaster.setFromCamera(pointer, camera);

	const intersects = raycaster.intersectObjects(scene.children);

	for (let i = 0; i < intersects.length; i++) {

		console.log(intersects[i].object.name);

		if (intersects[i].object.name === 'lampSwitch') {
			switch (lampLight) {
				case 'on':
					lamp1.intensity = 0;
					lamp2.intensity = 0;
					lampLight = 'off';
					break;
				case 'off':
					lamp1.intensity = 10;
					lamp2.intensity = 10;
					lampLight = 'on';
					break;
			}
			break;
		}
		else if (intersects[i].object.name === 'phoneScreen') {

			switch (phoneLight) {
				case 'off':
					for (let i = 0; i < 10; i++) {
						setTimeout(increaseIntensity(phone), 100000); // Execute the function with a 1-second delay between each call
					}
					break;
				case 'on':
					break;
			}
			break;
		}
		else {
			break;
		}
	}
}

function onPointerMove(event) {

	// calculate pointer position in normalized device coordinates
	// (-1 to +1) for both components

	pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
	pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;

}


function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);

}


animate();

window.addEventListener('pointermove', onPointerMove);
window.addEventListener('mousedown', onClick);


window.requestAnimationFrame(animate);