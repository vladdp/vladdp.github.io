import * as THREE from 'three';
import * as utils from "utils";

class Earth {
    radius = 6371 / utils.scale;

    constructor() {
        this.shape = new THREE.Mesh(
            new THREE.SphereGeometry( this.radius, 64, 64 ),
            new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load('assets/earth.jpg'),
            })
        );
    }
}

export { Earth };