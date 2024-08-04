import * as THREE from 'three';
import { OrbitControls } from
    'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import * as YUKA from 'yuka'



const textures = [];
const textureLoader = new THREE.TextureLoader();
// const cubeTextureLoader = new THREE.CubeTextureLoader();


const venusTexture = textureLoader.load('https://i.imgur.com/zU5oOjt.jpeg');
const marsTexture = textureLoader.load('https://i.imgur.com/U6upjrv.jpeg');
const jupiterTexture = textureLoader.load('https://i.imgur.com/4APG00k.jpeg');
const saturnTexture = textureLoader.load('https://i.imgur.com/YKw0m4x.jpeg');
const plutoTexture = textureLoader.load('https://i.imgur.com/YNsmmHV.jpeg');
const uranus = textureLoader.load('https://i.imgur.com/olpgGMo.jpeg');
const neptune = textureLoader.load('https://i.imgur.com/pycXdLM.jpeg');

textures.push(
    venusTexture,
    marsTexture,            
    jupiterTexture,
    saturnTexture,
    plutoTexture,
    neptune,
    uranus
);


textures.forEach(function (texture) {
    texture.colorSpace = THREE.SRGBColorSpace;
});



const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

//  const orbitControls = new OrbitControls(camera, renderer.domElement);

// orbitControls.update();
camera.position.set(0, 0, 30);


function createSphere(texture , x , y , z ){
    const geo = new THREE.SphereGeometry(11, 30, 30);
    const mat = new THREE.MeshBasicMaterial({
         map: texture,
         metalness: 0.7,
         roughness: 0.5,

        
     });
    
     const sphere= new THREE.Mesh(geo, mat);
     scene.add(sphere);
     
    sphere.position.set(x, y, z);
    return sphere;

}


const positions = [
    new YUKA.Vector3(-33, -39, -20),
    new YUKA.Vector3(-2, -7, -4),
    new YUKA.Vector3(25, 11, -20),
    new YUKA.Vector3(77, 32, -39),
    new YUKA.Vector3(149, 53, -55),
    new YUKA.Vector3(233 , -53 -50)
];
// // Create Spheres
const spheres = [
    createSphere(plutoTexture, positions[0].x, positions[0].y, positions[0].z),
    createSphere(venusTexture, positions[1].x, positions[1].y, positions[1].z),
    createSphere(neptune, positions[2].x, positions[2].y, positions[2].z),
    createSphere(jupiterTexture, positions[3].x, positions[3].y, positions[3].z),
    createSphere(uranus, positions[4].x, positions[4].y, positions[4].z),
    createSphere(marsTexture, positions[5].x, positions[5].y, positions[5].z),

];

const swapInterval = 3000;

function swapPositions() {
    spheres.forEach((sphere) => {
        const currentPosition = sphere.position.clone();
        let nextPosition;

        switch (true) {
            case currentPosition.equals(positions[0]):
                nextPosition = positions[5];
                break;
            case currentPosition.equals(positions[5]):
                nextPosition = positions[4];
                break;
            case currentPosition.equals(positions[4]):
                nextPosition = positions[3];
                break;
            case currentPosition.equals(positions[3]):
                nextPosition = positions[2];
                break;
            case currentPosition.equals(positions[2]):
                nextPosition = positions[1];
                break;
            case currentPosition.equals(positions[1]):
                nextPosition = positions[0];
                break;
            default:
                console.error('Position not matched:', currentPosition);
                return;
        }

        // Animate position change
        animatePosition(sphere, nextPosition);
    });
}



scene.background = new THREE.Color("white");

 

// Function to animate the position of a sphere
function animatePosition(sphere, targetPosition) {
    const duration = 3000; // Duration in milliseconds
    const startTime = Date.now();
    const startPosition = sphere.position.clone();

    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        sphere.position.set(
            THREE.MathUtils.lerp(startPosition.x, targetPosition.x, progress),
            THREE.MathUtils.lerp(startPosition.y, targetPosition.y, progress),
            THREE.MathUtils.lerp(startPosition.z, targetPosition.z, progress)
        );
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }

    animate();
}

function continuousSwap() {
    swapPositions();
    setTimeout(continuousSwap, swapInterval);
}

setTimeout(() => {
    continuousSwap();
}, 5000); // Delay of 5 seconds

function animate() {
    requestAnimationFrame(animate);
    // orbitControls.update(); // Update controls.
    renderer.render(scene, camera);
}

animate();



