import * as THREE from 'three';
import * as utils from 'utils';

class Satellite {
    scale = utils.scale;
    a = 10000/this.scale;
    e = 0;
    i = 0;
    raan = 0;
    w = 0;
    v_0 = 0;

    r = [];
    x = [];
    y = [];
    z = new Array(100).fill();

    points = [];
    resolution = 1000;
    
    constructor(name, color) {
        this.name = name;
        this.option = document.createElement('option');
        this.option.text = this.name;

        this.ellipse_geometry = new THREE.BufferGeometry().setFromPoints(this.points);
        this.ellipse_material = new THREE.LineBasicMaterial( { color: color } );
        this.ellipse = new THREE.Line( this.ellipse_geometry, this.ellipse_material );
        this.ellipse.geometry.attributes.position.needsUpdate = true;
    }

    set_orbit() {
        this.points = [];
        const theta = utils.linspace( 0, 2*Math.PI, this.resolution );
        const p = this.a * (1-Math.pow(this.e, 2));

        for (var i=0; i < this.resolution; i++) {
            this.r[i] = p / ( 1 + this.e * Math.cos(theta[i]) );
            this.x[i] = this.r[i] * Math.cos(theta[i]);
            this.y[i] = this.r[i] * Math.sin(theta[i]);
            this.points.push( new THREE.Vector3( this.x[i], this.y[i], this.z[i] ));
        }

        utils.rot_x(this.points, (Math.PI / 2) + this.i);
        utils.rot_y(this.points, this.raan);
        utils.rot_z(this.points, this.w);
    }

    update() {
        this.set_orbit();

        this.ellipse_geometry.setFromPoints(this.points);
    }
}

export { Satellite };