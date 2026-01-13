import * as THREE from './three.module.js';
import { ARButton } from './jsm/webxr/ARButton.js';

let camera, scene, renderer;
let controller;

function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);

    const arButton = new ARButton(renderer, {
        sessionInit: { requiredFeatures: ['hit-test'] }
    });

    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    scene.add(light);

    controller = renderer.xr.getController(0);
    controller.addEventListener('select', onSelect);
    scene.add(controller);

    window.addEventListener('resize', onWindowResize);
}

function onSelect() {
    const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    const material = new THREE.MeshStandardMaterial({ color: 0xf27f5d });
    const cube = new THREE.Mesh(geometry, material);
    const position = new THREE.Vector3();

    position.setFromMatrixPosition(controller.matrixWorld);
    cube.position.copy(position);
    
    scene.add(cube);
}

function animate() {
    renderer.setAnimationLoop(render);
}

function render() {
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Validar WebXR
if ('xr' in navigator) {
    init();
    animate();
} else {
    document.body.innerHTML = '<p style="text-align:center;padding:20px;color:red;">WebXR no está soportado en este navegador.<br>Usa Chrome para Android o Safari para iOS.</p>';
}
