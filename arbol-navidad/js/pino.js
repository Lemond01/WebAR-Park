// pino.js - Estructura del árbol de navidad
function crearPino() {
    const grupoPino = new THREE.Group();
    
    // Tronco
    const troncoGeometry = new THREE.CylinderGeometry(0.3, 0.4, 1.5, 8);
    const troncoMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x8B4513,
        roughness: 0.9
    });
    const tronco = new THREE.Mesh(troncoGeometry, troncoMaterial);
    tronco.position.y = -1.5;
    grupoPino.add(tronco);
    
    // Capas del árbol (de abajo hacia arriba)
    const niveles = [
        { radio: 2.5, altura: 1.2, y: 0 },
        { radio: 2.0, altura: 1.0, y: 1.2 },
        { radio: 1.5, altura: 0.8, y: 2.2 },
        { radio: 1.0, altura: 0.6, y: 3.0 },
        { radio: 0.5, altura: 0.4, y: 3.6 }
    ];
    
    niveles.forEach((nivel, index) => {
        const conoGeometry = new THREE.ConeGeometry(
            nivel.radio, 
            nivel.altura, 
            8
        );
        const conoMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x0a5c0a,
            roughness: 0.8
        });
        
        const capa = new THREE.Mesh(conoGeometry, conoMaterial);
        capa.position.y = nivel.y;
        grupoPino.add(capa);
    });
    
    return grupoPino;
}