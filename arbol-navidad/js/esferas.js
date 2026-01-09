// esferas.js - Esferas navideñas
function crearEsferas() {
    const grupoEsferas = new THREE.Group();
    
    // Colores de las esferas
    const colores = [
        0xFF0000, // Rojo
        0xFFD700, // Dorado
        0x0000FF, // Azul
        0xFFFFFF, // Blanco
        0xFF69B4, // Rosa
        0x800080  // Púrpura
    ];
    
    // Posiciones para las esferas
    const posiciones = [
        { x: 0.8, y: 0.5, z: 0.8 },
        { x: -0.8, y: 0.5, z: 0.6 },
        { x: 0.6, y: 1.0, z: -0.7 },
        { x: -0.7, y: 1.0, z: -0.5 },
        { x: 0.4, y: 1.8, z: 0.5 },
        { x: -0.5, y: 1.8, z: 0.4 },
        { x: 0.3, y: 2.5, z: -0.3 },
        { x: -0.3, y: 2.5, z: 0.3 },
        { x: 0, y: 3.2, z: 0 }
    ];
    
    // Crear esferas
    posiciones.forEach((pos, index) => {
        const radio = 0.15 + Math.random() * 0.1;
        const geometry = new THREE.SphereGeometry(radio, 16, 16);
        const colorIndex = index % colores.length;
        const material = new THREE.MeshStandardMaterial({ 
            color: colores[colorIndex],
            metalness: 0.7,
            roughness: 0.2
        });
        
        const esfera = new THREE.Mesh(geometry, material);
        esfera.position.set(pos.x, pos.y, pos.z);
        grupoEsferas.add(esfera);
    });
    
    return grupoEsferas;
}