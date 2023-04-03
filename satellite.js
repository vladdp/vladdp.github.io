import * as THREE from 'three';
import * as utils from 'utils';

class Satellite {
    scale = utils.scale;
    a = 10000/this.scale;
    e = 0;
    i = 0;
    raan = 0;
    w = 0;
    T = 0;

    r = [];
    x = [];
    y = [];
    z = new Array(100).fill();

    points = [];
    
    constructor(name="") {
        this.name = name;
        this.option = document.createElement('option');
        this.option.text = this.name;
    }

    orbit() {
        const theta = utils.linspace( 0, 2*Math.PI, 100 );
        const p = this.a * (1-Math.pow(this.e, 2));

        for (var i=0; i < 100; i++) {
            this.r[i] = p / ( 1 + this.e * Math.cos(theta[i]) );
            this.x[i] = this.r[i] * Math.cos(theta[i]);
            this.y[i] = this.r[i] * Math.sin(theta[i]);
            this.points.push( new THREE.Vector3( this.x[i], this.y[i], this.z[i] ));
        }

        utils.rot_x(this.points, Math.PI / 2);
        // utils.rot_y(points, 45 * (Math.PI/180));

        var ellipse_geometry = new THREE.BufferGeometry().setFromPoints( this.points );
        var ellipse_material = new THREE.LineBasicMaterial( { color: 0xeb7134 } );
        var orbit = new THREE.Line( ellipse_geometry, ellipse_material );
        orbit.geometry.attributes.position.needsUpdate = true; // required after the first render

        return orbit;
    }

    update() {
        // this.orbit();
    }
}

export { Satellite };