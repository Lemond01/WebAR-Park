// Variables globales
let scene, camera, renderer;
let treeGroup, lights = [], ornaments = [];
let isRotating = false;
let snowParticles = [];
let lightsOn = false;

// Inicialización
function init() {
    // Crear escena
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c0c2e);
    
    // Crear cámara
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 15);
    
    // Crear renderizador
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);
    
    // Controles de órbita (simulados)
    setupControls();
    
    // Crear el árbol
    createChristmasTree();
    
    // Crear suelo
    createGround();
    
    // Crear luces base
    createBaseLights();
    
    // Crear nieve
    createSnow();
    
    // Crear estrellas en el fondo
    createStars();
    
    // Manejo de ventana
    window.addEventListener('resize', onWindowResize);
    
    // Iniciar animación
    animate();
}

// Crear árbol de Navidad
function createChristmasTree() {
    treeGroup = new THREE.Group();
    
    // Tronco del árbol
    const trunkGeometry = new THREE.CylinderGeometry(0.5, 0.7, 3, 8);
    const trunkMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x8B4513, 
        shininess: 30 
    });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.y = 1.5;
    trunk.castShadow = true;
    treeGroup.add(trunk);
    
    // Capas del árbol (de abajo hacia arriba)
    const layers = [
        { radius: 6, height: 3, y: 4, color: 0x228B22 },
        { radius: 4.5, height: 2.5, y: 6.5, color: 0x2E8B57 },
        { radius: 3, height: 2, y: 8.5, color: 0x3CB371 },
        { radius: 1.5, height: 1.5, y: 10, color: 0x66CDAA }
    ];
    
    layers.forEach(layer => {
        const coneGeometry = new THREE.ConeGeometry(layer.radius, layer.height, 8);
        const coneMaterial = new THREE.MeshPhongMaterial({ 
            color: layer.color,
            shininess: 100 
        });
        const cone = new THREE.Mesh(coneGeometry, coneMaterial);
        cone.position.y = layer.y;
        cone.castShadow = true;
        treeGroup.add(cone);
    });
    
    // Estrella en la punta
    const starGeometry = new THREE.ConeGeometry(0.8, 1.5, 5);
    const starMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xFFD700,
        emissive: 0xFF4500,
        emissiveIntensity: 0.5 
    });
    const star = new THREE.Mesh(starGeometry, starMaterial);
    star.position.y = 11.5;
    star.rotation.x = Math.PI;
    treeGroup.add(star);
    
    // Agregar algunas bolas de colores iniciales
    for (let i = 0; i < 15; i++) {
        addOrnament(true);
    }
    
    scene.add(treeGroup);
}

// Añadir una bola decorativa
function addBall() {
    addOrnament(false);
}

function addOrnament(randomPosition = false) {
    const colors = [
        0xFF0000, // Rojo
        0x00FF00, // Verde
        0x0000FF, // Azul
        0xFFFF00, // Amarillo
        0xFF00FF, // Magenta
        0xFFA500  // Naranja
    ];
    
    const radius = 0.3 + Math.random() * 0.2;
    const geometry = new THREE.SphereGeometry(radius, 16, 16);
    const color = colors[Math.floor(Math.random() * colors.length)];
    const material = new THREE.MeshPhongMaterial({ 
        color: color,
        shininess: 100,
        specular: 0x222222
    });
    
    const ball = new THREE.Mesh(geometry, material);
    ball.castShadow = true;
    
    let x, y, z;
    if (randomPosition) {
        // Posición aleatoria en el árbol
        const layer = Math.floor(Math.random() * 4);
        const angle = Math.random() * Math.PI * 2;
        const distance = 1 + Math.random() * (3 - layer * 0.5);
        
        x = Math.cos(angle) * distance;
        z = Math.sin(angle) * distance;
        y = 3 + layer * 1.5 + Math.random() * 1.2;
    } else {
        // Posición aleatoria cerca del árbol
        x = (Math.random() - 0.5) * 8;
        z = (Math.random() - 0.5) * 8;
        y = Math.random() * 10 + 2;
    }
    
    ball.position.set(x, y, z);
    ornaments.push(ball);
    scene.add(ball);
    
    // Animación de caída (si no es posición aleatoria inicial)
    if (!randomPosition) {
        let speed = 0;
        const gravity = 0.02;
        const bounceFactor = 0.7;
        
        function animateFall() {
            speed -= gravity;
            ball.position.y += speed;
            
            if (ball.position.y <= radius) {
                ball.position.y = radius;
                speed = -speed * bounceFactor;
                
                if (Math.abs(speed) < 0.1) {
                    return; // Detener animación
                }
            }
            
            requestAnimationFrame(animateFall);
        }
        
        animateFall();
    }
}

// Crear luces navideñas
function toggleLights() {
    lightsOn = !lightsOn;
    
    if (lightsOn) {
        // Crear luces de colores
        const lightColors = [0xFF0000, 0x00FF00, 0x0000FF, 0xFFFF00, 0xFF00FF, 0xFFA500];
        
        for (let i = 0; i < 20; i++) {
            const angle = (i / 20) * Math.PI * 2;
            const height = 3 + (i % 10) * 0.7;
            const radius = 2 + (i % 3);
            
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            const y = height;
            
            const light = new THREE.PointLight(
                lightColors[i % lightColors.length],
                1,  // intensidad
                10  // distancia
            );
            light.position.set(x, y, z);
            scene.add(light);
            lights.push(light);
            
            // Crear esfera pequeña para representar la luz
            const sphere = new THREE.SphereGeometry(0.15, 8, 8);
            const material = new THREE.MeshBasicMaterial({ 
                color: lightColors[i % lightColors.length] 
            });
            const lightSphere = new THREE.Mesh(sphere, material);
            lightSphere.position.set(x, y, z);
            scene.add(lightSphere);
            lights.push(lightSphere);
        }
    } else {
        // Eliminar luces
        lights.forEach(light => {
            if (light.dispose) light.dispose();
            scene.remove(light);
        });
        lights = [];
    }
}

// Crear nieve
function createSnow() {
    const snowGeometry = new THREE.BufferGeometry();
    const snowCount = 1000;
    const positions = new Float32Array(snowCount * 3);
    
    for (let i = 0; i < snowCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 50;
        positions[i + 1] = Math.random() * 30;
        positions[i + 2] = (Math.random() - 0.5) * 50;
    }
    
    snowGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const snowMaterial = new THREE.PointsMaterial({
        color: 0xFFFFFF,
        size: 0.1,
        transparent: true
    });
    
    const snow = new THREE.Points(snowGeometry, snowMaterial);
    scene.add(snow);
    snowParticles.push(snow);
}

function toggleSnow() {
    snowParticles.forEach(snow => {
        snow.visible = !snow.visible;
    });
}

// Crear suelo
function createGround() {
    const groundGeometry = new THREE.PlaneGeometry(30, 30, 32, 32);
    const groundMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x2d5016,
        shininess: 30
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    ground.receiveShadow = true;
    scene.add(ground);
    
    // Crear una alfombra de nieve
    const snowGeometry = new THREE.CircleGeometry(8, 32);
    const snowMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xF0F8FF,
        shininess: 10
    });
    const snow = new THREE.Mesh(snowGeometry, snowMaterial);
    snow.rotation.x = -Math.PI / 2;
    snow.position.y = 0.01;
    scene.add(snow);
}

// Crear luces base
function createBaseLights() {
    // Luz ambiental
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);
    
    // Luz direccional (sol)
    const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.8);
    directionalLight.position.set(10, 20, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);
    
    // Luz puntual suave
    const pointLight = new THREE.PointLight(0xFFE4B5, 0.5, 20);
    pointLight.position.set(0, 5, 5);
    scene.add(pointLight);
}

// Crear estrellas en el fondo
function createStars() {
    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = 500;
    const positions = new Float32Array(starsCount * 3);
    
    for (let i = 0; i < starsCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 100;
        positions[i + 1] = (Math.random() - 0.5) * 50 + 10;
        positions[i + 2] = (Math.random() - 0.5) * 100 - 50;
    }
    
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const starsMaterial = new THREE.PointsMaterial({
        color: 0xFFFFFF,
        size: 0.1,
        transparent: true
    });
    
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
}

// Controles simples de cámara
let mouseDown = false;
let lastMouseX = 0;
let lastMouseY = 0;

function setupControls() {
    document.addEventListener('mousedown', (e) => {
        mouseDown = true;
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
    });
    
    document.addEventListener('mouseup', () => {
        mouseDown = false;
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!mouseDown) return;
        
        const deltaX = e.clientX - lastMouseX;
        const deltaY = e.clientY - lastMouseY;
        
        camera.position.x -= deltaX * 0.01;
        camera.position.y += deltaY * 0.01;
        
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
    });
    
    document.addEventListener('wheel', (e) => {
        camera.position.z += e.deltaY * 0.01;
        camera.position.z = Math.max(5, Math.min(30, camera.position.z));
    });
}

// Rotar el árbol
function rotateTree() {
    isRotating = !isRotating;
}

// Animación
function animate() {
    requestAnimationFrame(animate);
    
    // Rotar árbol si está activado
    if (isRotating && treeGroup) {
        treeGroup.rotation.y += 0.01;
    }
    
    // Animar nieve
    snowParticles.forEach(snow => {
        if (snow.visible) {
            const positions = snow.geometry.attributes.position.array;
            for (let i = 1; i < positions.length; i += 3) {
                positions[i] -= 0.05;
                if (positions[i] < 0) {
                    positions[i] = 30;
                    positions[i-1] = (Math.random() - 0.5) * 50;
                    positions[i+1] = (Math.random() - 0.5) * 50;
                }
            }
            snow.geometry.attributes.position.needsUpdate = true;
        }
    });
    
    // Parpadeo de luces navideñas
    if (lightsOn) {
        lights.forEach((light, index) => {
            if (light.intensity !== undefined) {
                light.intensity = 0.5 + Math.sin(Date.now() * 0.001 + index) * 0.5;
            }
        });
    }
    
    renderer.render(scene, camera);
}

// Manejo de redimensionamiento
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Inicializar cuando se cargue la página
window.addEventListener('DOMContentLoaded', init);