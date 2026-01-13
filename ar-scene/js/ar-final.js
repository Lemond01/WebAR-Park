import * as THREE from './three.module.js';
import { ARButton } from './jsm/webxr/ARButton.js';

let camera, scene, renderer;
let controller;

function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);

    // Detectar si es computadora
    const isDesktop = !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isDesktop) {
        // Solo mostrar mensaje en computadora
        showDesktopMessage();
        // Opcional: agregar un cubo fijo para ver que funciona
        addTestCube();
        animate();
    } else {
        // Modo AR normal para móviles
        setupAR();
    }

    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 3);
    light.position.set(0.5, 1, 0.75);
    scene.add(light);

    const floorGeometry = new THREE.PlaneGeometry(4, 4);
    const floorMaterial = new THREE.MeshBasicMaterial({
        color: 0xcccccc,
        opacity: 0.1,
        transparent: true
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    window.addEventListener('resize', onWindowResize);
}

function setupAR() {
    renderer.xr.enabled = true;
    
    const arButton = new ARButton(renderer, {
        requiredFeatures: ['hit-test'],
        sessionInit: { requiredFeatures: ['hit-test'] }
    });

    controller = renderer.xr.getController(0);
    controller.addEventListener('select', onSelect);
    scene.add(controller);

    animate();
}

function showDesktopMessage() {
    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 20px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        border-radius: 10px;
        text-align: center;
        font-family: Arial, sans-serif;
        z-index: 1000;
        max-width: 80%;
    `;
    message.innerHTML = `
        <h3>Modo de Vista Previa</h3>
        <p>Esta aplicación está diseñada para Realidad Aumentada en dispositivos móviles.</p>
        <p>Para probar la funcionalidad completa:</p>
        <p>1. Usa un dispositivo móvil (Android/iOS)</p>
        <p>2. Abre Chrome (Android) o Safari (iOS)</p>
        <p>3. Conéctate al mismo servidor local</p>
    `;
    document.body.appendChild(message);
}

function addTestCube() {
    // Solo para mostrar que el renderizado funciona
    const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    const material = new THREE.MeshStandardMaterial({ 
        color: 0xf27f5d,
        roughness: 0.7,
        metalness: 0.2
    });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(0, 0, -1);
    scene.add(cube);
}

function onSelect() {
    const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    const material = new THREE.MeshStandardMaterial({ 
        color: 0xf27f5d,
        roughness: 0.7,
        metalness: 0.2
    });
    const cube = new THREE.Mesh(geometry, material);

    const position = new THREE.Vector3();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();
    
    controller.matrixWorld.decompose(position, quaternion, scale);
    position.z -= 0.3;
    cube.position.copy(position);
    cube.quaternion.copy(quaternion);
    
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

// Iniciar
init();