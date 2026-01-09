// nieve.js - Efecto de nieve
function crearNieve() {
    const particulas = [];
    const grupoNieve = new THREE.Group();
    
    // Crear geometría de partícula
    const particulaGeometry = new THREE.SphereGeometry(0.03, 4, 4);
    const particulaMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xFFFFFF,
        transparent: true,
        opacity: 0.8
    });
    
    // Crear 100 copos de nieve
    for (let i = 0; i < 100; i++) {
        const particula = new THREE.Mesh(particulaGeometry, particulaMaterial);
        
        // Posición aleatoria
        particula.position.x = (Math.random() - 0.5) * 20;
        particula.position.y = Math.random() * 15;
        particula.position.z = (Math.random() - 0.5) * 20;
        
        // Velocidad aleatoria
        particula.userData = {
            velocidad: 0.01 + Math.random() * 0.02,
            oscilacion: Math.random() * Math.PI * 2
        };
        
        grupoNieve.add(particula);
        particulas.push(particula);
    }
    
    return { grupoNieve, particulas };
}