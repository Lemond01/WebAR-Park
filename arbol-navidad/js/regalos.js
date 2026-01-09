// regalos.js - Regalos decorativos
function crearRegalos() {
    const grupoRegalos = new THREE.Group();
    
    // Colores para los regalos
    const coloresRegalos = [
        { color: 0xFF0000, cinta: 0xFFFFFF }, // Rojo con cinta blanca
        { color: 0x0000FF, cinta: 0xFFFF00 }, // Azul con cinta amarilla
        { color: 0x00FF00, cinta: 0xFF0000 }, // Verde con cinta roja
        { color: 0xFFFF00, cinta: 0x0000FF }, // Amarillo con cinta azul
        { color: 0xFF69B4, cinta: 0xFFFFFF }  // Rosa con cinta blanca
    ];
    
    // Posiciones de los regalos
    const posiciones = [
        { x: -1.5, z: -1.2, tamaño: 0.5 },
        { x: 1.2, z: -1.5, tamaño: 0.4 },
        { x: -1.0, z: 1.3, tamaño: 0.6 },
        { x: 1.5, z: 0.8, tamaño: 0.45 },
        { x: 0.5, z: -1.8, tamaño: 0.55 }
    ];
    
    posiciones.forEach((pos, index) => {
        const colorRegalo = coloresRegalos[index % coloresRegalos.length];
        
        // Caja del regalo
        const cajaGeometry = new THREE.BoxGeometry(
            pos.tamaño, 
            pos.tamaño * 0.6, 
            pos.tamaño
        );
        const cajaMaterial = new THREE.MeshStandardMaterial({ 
            color: colorRegalo.color,
            roughness: 0.5
        });
        const caja = new THREE.Mesh(cajaGeometry, cajaMaterial);
        caja.position.set(pos.x, -1.8, pos.z);
        grupoRegalos.add(caja);
        
        // Cinta horizontal
        const cintaHGeometry = new THREE.BoxGeometry(
            pos.tamaño * 1.2, 
            pos.tamaño * 0.1, 
            pos.tamaño * 0.1
        );
        const cintaMaterial = new THREE.MeshStandardMaterial({ 
            color: colorRegalo.cinta,
            roughness: 0.3
        });
        const cintaH = new THREE.Mesh(cintaHGeometry, cintaMaterial);
        cintaH.position.copy(caja.position);
        grupoRegalos.add(cintaH);
        
        // Cinta vertical
        const cintaVGeometry = new THREE.BoxGeometry(
            pos.tamaño * 0.1, 
            pos.tamaño * 0.1, 
            pos.tamaño * 1.2
        );
        const cintaV = new THREE.Mesh(cintaVGeometry, cintaMaterial);
        cintaV.position.copy(caja.position);
        grupoRegalos.add(cintaV);
        
        // Moño (opcional - pequeño cubo en el centro)
        const monoGeometry = new THREE.BoxGeometry(
            pos.tamaño * 0.15, 
            pos.tamaño * 0.15, 
            pos.tamaño * 0.15
        );
        const mono = new THREE.Mesh(monoGeometry, cintaMaterial);
        mono.position.copy(caja.position);
        mono.position.y += pos.tamaño * 0.3;
        grupoRegalos.add(mono);
    });
    
    return grupoRegalos;
}