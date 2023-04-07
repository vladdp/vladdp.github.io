import * as THREE from 'three';
import { addToScene } from 'main';
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

        this.createAxis();
    }

    createAxis() {
        const line_material = new THREE.LineBasicMaterial( { color: 0x00ffff});
        const lx = [];
        lx.push( new THREE.Vector3(0, 0, 0) );
        lx.push( new THREE.Vector3(1, 0, 0) );
        const ly = [];
        ly.push( new THREE.Vector3(0, 0, 0) );
        ly.push( new THREE.Vector3(0, 1, 0) );
        const lz = [];
        lz.push( new THREE.Vector3(0, 0, 0) );
        lz.push( new THREE.Vector3(0, 0, 1) );

        const lx_geometry = new THREE.BufferGeometry().setFromPoints( lx );
        const ly_geometry = new THREE.BufferGeometry().setFromPoints( ly );
        const lz_geometry = new THREE.BufferGeometry().setFromPoints( lz );

        const line_x = new THREE.Line( lx_geometry, line_material );
        const line_y = new THREE.Line( ly_geometry, line_material );
        const line_z = new THREE.Line( lz_geometry, line_material );

        addToScene(line_x);
        addToScene(line_y);
        addToScene(line_z);
    }
}

export { Earth };