import * as THREE from 'three';

class CelestialBody {

    constructor(radius, texture) {
        this.shape = new THREE.Mesh(
            new THREE.SphereGeometry( radius, 64, 64 ),
            new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load(texture),
            })
        );
    }
}

export { CelestialBody };