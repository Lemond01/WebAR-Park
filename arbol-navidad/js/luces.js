// luces.js - Luces parpadeantes
function crearLuces() {
    const grupoLuces = new THREE.Group();
    
    // Crear puntos de luz
    const posicionesLuces = [];
    const radioArbol = 2.5;
    
    // Generar posiciones en espiral alrededor del árbol
    for (let i = 0; i < 20; i++) {
        const altura = (i / 20) * 4;
        const angulo = (i / 20) * Math.PI * 4;
        const radio = radioArbol * (1 - altura / 5);
        
        posicionesLuces.push({
            x: Math.cos(angulo) * radio,
            y: altura,
            z: Math.sin(angulo) * radio
        });
    }
    
    // Crear esferas pequeñas para las luces
    const coloresLuces = [0xFF0000, 0x00FF00, 0x0000FF, 0xFFFF00, 0xFF00FF, 0x00FFFF];
    
    posicionesLuces.forEach((pos, index) => {
        const geometry = new THREE.SphereGeometry(0.08, 8, 8);
        const colorIndex = index % coloresLuces.length;
        const material = new THREE.MeshBasicMaterial({ 
            color: coloresLuces[colorIndex]
        });
        
        const luzMesh = new THREE.Mesh(geometry, material);
        luzMesh.position.set(pos.x, pos.y, pos.z);
        
        // Agregar luz puntual
        const luz = new THREE.PointLight(coloresLuces[colorIndex], 0.5, 2);
        luz.position.copy(luzMesh.position);
        
        grupoLuces.add(luzMesh);
        grupoLuces.add(luz);
    });
    
    return { grupoLuces, posicionesLuces, coloresLuces };
}