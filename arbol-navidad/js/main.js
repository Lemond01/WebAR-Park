// main.js - Archivo principal que junta todo
document.addEventListener('DOMContentLoaded', () => {
    // 1. Configuración básica
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a1929);
    
    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(5, 3, 5);
    camera.lookAt(0, 1, 0);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);
    
    // 2. Controles de cámara (rotación con mouse)
    let mouseDown = false;
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;
    let actualRotationX = 0;
    let actualRotationY = 0;
    
    document.addEventListener('mousedown', (e) => {
        mouseDown = true;
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    document.addEventListener('mouseup', () => {
        mouseDown = false;
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!mouseDown) return;
        
        const deltaX = e.clientX - mouseX;
        const deltaY = e.clientY - mouseY;
        
        targetRotationY += deltaX * 0.01;
        targetRotationX += deltaY * 0.01;
        
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // 3. Iluminación
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    // 4. Crear y agregar todos los elementos del árbol
    const arbolNavidad = new THREE.Group();
    
    // Agregar pino
    const pino = crearPino();
    arbolNavidad.add(pino);
    
    // Agregar esferas
    const esferas = crearEsferas();
    arbolNavidad.add(esferas);
    
    // Agregar estrella
    const estrella = crearEstrella();
    arbolNavidad.add(estrella);
    
    // Agregar luces
    const { grupoLuces, posicionesLuces, coloresLuces } = crearLuces();
    arbolNavidad.add(grupoLuces);
    
    // Agregar regalos
    const regalos = crearRegalos();
    scene.add(regalos);
    
    // Agregar nieve (opcional)
    const { grupoNieve, particulas } = crearNieve();
    scene.add(grupoNieve);
    
    // Agregar árbol a la escena
    scene.add(arbolNavidad);
    
    // 5. Crear piso
    const pisoGeometry = new THREE.PlaneGeometry(20, 20);
    const pisoMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x1a3c2f,
        roughness: 0.8
    });
    const piso = new THREE.Mesh(pisoGeometry, pisoMaterial);
    piso.rotation.x = -Math.PI / 2;
    piso.position.y = -2;
    piso.receiveShadow = true;
    scene.add(piso);
    
    // 6. Animación de luces
    let tiempo = 0;
    const luces = grupoLuces.children.filter(child => child instanceof THREE.PointLight);
    
    // 7. Función de animación
    function animate() {
        requestAnimationFrame(animate);
        
        // Actualizar rotación suave
        actualRotationX += (targetRotationX - actualRotationX) * 0.05;
        actualRotationY += (targetRotationY - actualRotationY) * 0.05;
        
        // Rotar toda la escena
        scene.rotation.x = actualRotationX;
        scene.rotation.y = actualRotationY;
        
        // Animar luces (parpadeo)
        tiempo += 0.1;
        luces.forEach((luz, index) => {
            const intensidad = 0.3 + Math.sin(tiempo * 2 + index) * 0.2;
            luz.intensity = intensidad;
        });
        
        // Animar estrella (rotación suave)
        estrella.rotation.y += 0.01;
        
        // Animar esferas (pequeña oscilación)
        esferas.children.forEach((esfera, index) => {
            esfera.position.y += Math.sin(tiempo + index) * 0.001;
        });
        
        // Animar nieve
        if (particulas) {
            particulas.forEach((particula, index) => {
                particula.position.y -= particula.userData.velocidad;
                particula.position.x += Math.sin(tiempo + particula.userData.oscilacion) * 0.005;
                
                // Si la partícula llega al suelo, reiniciar arriba
                if (particula.position.y < -2) {
                    particula.position.y = 10;
                    particula.position.x = (Math.random() - 0.5) * 20;
                    particula.position.z = (Math.random() - 0.5) * 20;
                }
            });
        }
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // 8. Ajustar a tamaño de ventana
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
});