// estrella.js - Estrella para la punta del árbol
function crearEstrella() {
    const grupoEstrella = new THREE.Group();
    
    // Crear una estrella simple con conos
    const crearPunta = (rotacionY) => {
        const geometry = new THREE.ConeGeometry(0.15, 0.5, 4);
        const material = new THREE.MeshStandardMaterial({ 
            color: 0xFFD700,
            emissive: 0xFFD700,
            emissiveIntensity: 0.5
        });
        
        const punta = new THREE.Mesh(geometry, material);
        punta.rotation.y = rotacionY;
        return punta;
    };
    
    // Crear 5 puntas para la estrella
    for (let i = 0; i < 5; i++) {
        const punta = crearPunta((i * Math.PI * 2) / 5);
        grupoEstrella.add(punta);
    }
    
    // Centro de la estrella
    const centroGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.2, 6);
    const centroMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xFFD700,
        emissive: 0xFFD700,
        emissiveIntensity: 0.7
    });
    const centro = new THREE.Mesh(centroGeometry, centroMaterial);
    grupoEstrella.add(centro);
    
    // Posicionar la estrella en la punta del árbol
    grupoEstrella.position.y = 4.2;
    grupoEstrella.rotation.y = Math.PI / 10;
    
    return grupoEstrella;
}