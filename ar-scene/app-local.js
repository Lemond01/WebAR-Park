// Usar Three.js desde archivos locales
console.log("Iniciando con Three.js local");

let camera, scene, renderer;
let cube;

const infoDiv = document.getElementById('info');

function init() {
    infoDiv.textContent = "Three.js cargado. Creando escena...";
    
    // Escena
    scene = new THREE.Scene();
    
    // Cámara
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 2;
    
    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 1);
    document.body.appendChild(renderer.domElement);
    
    // Cubo
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ 
        color: 0x00ff00,
        wireframe: true 
    });
    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    
    // Luz (para materiales estándar)
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    scene.add(light);
    
    infoDiv.textContent = "¡Escena 3D funcionando!";
    
    // Animación
    animate();
    
    // Redimensionar
    window.addEventListener('resize', function() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

function animate() {
    requestAnimationFrame(animate);
    
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    
    renderer.render(scene, camera);
}

// Iniciar
init();