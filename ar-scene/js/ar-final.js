import * as THREE from './three.module.js';
import { ARButton } from './jsm/webxr/ARButton.js';

let camera, scene, renderer;
let controller;
let isDesktop = false;
let debugMode = false;

function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);
    
    // Posicionar cámara para modo escritorio
    if (isDesktop) {
        camera.position.set(0, 1.6, 3);
    }

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);

    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 3);
    light.position.set(0.5, 1, 0.75);
    scene.add(light);

    // Añadir un piso de referencia
    const floorGeometry = new THREE.PlaneGeometry(4, 4);
    const floorMaterial = new THREE.MeshBasicMaterial({
        color: 0xcccccc,
        opacity: 0.1,
        transparent: true
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    // Detectar si es escritorio
    const userAgent = navigator.userAgent.toLowerCase();
    isDesktop = !(/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent));
    
    if (isDesktop) {
        // Modo debug para escritorio
        setupDebugMode();
    } else {
        // Modo AR para móviles
        setupARMode();
    }

    window.addEventListener('resize', onWindowResize);
}

function setupARMode() {
    // Habilitar WebXR para AR
    renderer.xr.enabled = true;
    
    // Crear botón AR
    const arButton = new ARButton(renderer, {
        sessionInit: { requiredFeatures: ['hit-test'] }
    });

    controller = renderer.xr.getController(0);
    controller.addEventListener('select', onSelect);
    scene.add(controller);
    
    animate();
    
    // Mostrar mensaje de instrucciones
    showMessage('Usa el botón "START AR" para activar la realidad aumentada', 'info');
}

function setupDebugMode() {
    debugMode = true;
    
    // Mostrar mensaje de debug
    showMessage('MODO DEBUG - Click para agregar cubos | WASD para mover | R/F para subir/bajar', 'debug');
    
    // Cubo inicial de referencia
    addDebugCube(0, 0, -1);
    
    // Controlador de debug (simula el controlador AR)
    controller = new THREE.Group();
    scene.add(controller);
    
    // Controles de ratón para agregar cubos
    renderer.domElement.addEventListener('click', (event) => {
        // Calcular posición en el mundo 3D
        const mouse = new THREE.Vector2();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);
        
        // Intersección con el plano del piso
        const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
        const intersectionPoint = new THREE.Vector3();
        raycaster.ray.intersectPlane(plane, intersectionPoint);
        
        addDebugCube(intersectionPoint.x, intersectionPoint.y, intersectionPoint.z);
    });
    
    // Controles de teclado para mover la cámara (WASD)
    const keys = {};
    const cameraSpeed = 0.1;
    
    document.addEventListener('keydown', (event) => {
        keys[event.key.toLowerCase()] = true;
    });
    
    document.addEventListener('keyup', (event) => {
        keys[event.key.toLowerCase()] = false;
    });
    
    // Animación para modo debug
    function animateDebug() {
        requestAnimationFrame(animateDebug);
        
        // Movimiento con WASD
        if (keys['w'] || keys['arrowup']) {
            camera.position.z -= cameraSpeed;
        }
        if (keys['s'] || keys['arrowdown']) {
            camera.position.z += cameraSpeed;
        }
        if (keys['a'] || keys['arrowleft']) {
            camera.position.x -= cameraSpeed;
        }
        if (keys['d'] || keys['arrowright']) {
            camera.position.x += cameraSpeed;
        }
        if (keys['r']) { // Subir
            camera.position.y += cameraSpeed;
        }
        if (keys['f']) { // Bajar
            camera.position.y -= cameraSpeed;
        }
        
        // Rotación de cámara con ratón
        let mouseX = 0, mouseY = 0;
        document.addEventListener('mousemove', (event) => {
            if (event.buttons === 2) { // Click derecho
                mouseX = (event.movementX / window.innerWidth) * 10;
                mouseY = (event.movementY / window.innerHeight) * 10;
                camera.rotation.y -= mouseX * 0.01;
                camera.rotation.x -= mouseY * 0.01;
            }
        });
        
        // Simular posición del controlador (frente a la cámara)
        controller.position.copy(camera.position);
        controller.position.z -= 0.5;
        
        renderer.render(scene, camera);
    }
    
    // Tecla para simular evento "select" (barra espaciadora)
    document.addEventListener('keydown', (event) => {
        if (event.code === 'Space') {
            onSelect();
        }
    });
    
    animateDebug();
}

function addDebugCube(x, y, z) {
    const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    const material = new THREE.MeshStandardMaterial({ 
        color: Math.random() * 0xffffff,
        roughness: 0.7,
        metalness: 0.2
    });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(x, y, z);
    scene.add(cube);
    
    // Agregar etiqueta de coordenadas (solo en debug)
    if (debugMode) {
        const coordText = `${x.toFixed(2)}, ${y.toFixed(2)}, ${z.toFixed(2)}`;
        console.log('Cubo agregado en:', coordText);
    }
}

function onSelect() {
    const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    const material = new THREE.MeshStandardMaterial({ 
        color: 0xf27f5d,
        roughness: 0.7,
        metalness: 0.2
    });
    const cube = new THREE.Mesh(geometry, material);

    // Posicionar el cubo frente al controlador
    const position = new THREE.Vector3();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();
    
    controller.matrixWorld.decompose(position, quaternion, scale);
    
    // Ajustar posición
    position.z -= 0.3;
    cube.position.copy(position);
    cube.quaternion.copy(quaternion);
    
    scene.add(cube);
    
    if (debugMode) {
        console.log('Cubo AR agregado en:', position);
    }
}

function showMessage(text, type = 'info') {
    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        top: 10px;
        left: 50%;
        transform: translateX(-50%);
        padding: 10px 20px;
        border-radius: 5px;
        color: white;
        font-family: Arial, sans-serif;
        font-size: 14px;
        z-index: 1000;
        text-align: center;
        background: ${type === 'debug' ? 'rgba(255, 100, 0, 0.8)' : 'rgba(0, 100, 255, 0.8)'};
        max-width: 90%;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    `;
    message.textContent = text;
    document.body.appendChild(message);
    
    // Auto-remover después de 5 segundos (excepto mensajes debug)
    if (type !== 'debug') {
        setTimeout(() => {
            if (message.parentNode) {
                message.parentNode.removeChild(message);
            }
        }, 5000);
    }
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

// Iniciar siempre, pero con modo diferente según el dispositivo
if (navigator.xr) {
    init();
} else {
    // Si no hay WebXR, forzar modo debug
    isDesktop = true;
    debugMode = true;
    init();
    showMessage('WebXR no disponible - Modo Debug Activado', 'debug');
}
