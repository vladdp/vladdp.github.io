import * as THREE from 'three';
import { addToScene } from 'main';
import * as utils from "utils";

class Moon {
    radius = 1737 / utils.scale;

    a = 384399 / utils.scale;
    e = 0.0549;
    i = utils.toRadians(5.149);
    raan = 0;
    w = 0;
    v_0 = 0;

    resolution = 1000;
    points = [];
    r = [];
    x = [];
    y = [];
    z = new Array(100).fill();

    pos = new THREE.Vector3();

    constructor() {
        this.shape = new THREE.Mesh(
            new THREE.SphereGeometry( this.radius, 64, 64 ),
            new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load('assets/moon.jpg'),
            })
        );

        this.ellipse_geometry = new THREE.BufferGeometry().setFromPoints(this.points);
        this.ellipse_material = new THREE.LineBasicMaterial( { color: utils.colors[19] } );
        this.ellipse = new THREE.Line( this.ellipse_geometry, this.ellipse_material );
        this.ellipse.geometry.attributes.position.needsUpdate = true;

        this.draw_orbit();
        this.set_pos();
    }

    draw_orbit() {
        const theta = utils.linspace( 0, 2*Math.PI, this.resolution );
        const p = this.a * (1-Math.pow(this.e, 2));

        for (var i=0; i < this.resolution; i++) {
            this.r[i] = p / ( 1 + this.e * Math.cos(theta[i]) );
            this.x[i] = this.r[i] * Math.cos(theta[i]);
            this.y[i] = this.r[i] * Math.sin(theta[i]);
            this.points.push( new THREE.Vector3( this.x[i], this.y[i], this.z[i] ));
        }
        
        utils.rot_z( this.points, this.w );
        utils.rot_x( this.points, -(Math.PI / 2) + this.i );
        utils.rot_y( this.points, this.raan );

        this.ellipse_geometry.setFromPoints( this.points );

        addToScene(this.ellipse);
    }

    set_pos() {
        this.pos.x = this.x[0];
        this.pos.y = 0;
        this.pos.z = 0;
        this.shape.position.set( this.pos.x, this.pos.y, this.pos.z );
    }
}

export { Moon };