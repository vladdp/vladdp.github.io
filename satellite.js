import * as THREE from 'three';
import * as utils from 'utils';

class Satellite {
    scale = utils.scale;
    a = 100000/this.scale;
    e = 0.5;
    points = [];
    
    constructor(name="") {
        this.name = name;
        this.option = document.createElement('option');
        this.option.text = this.name;
    }

    orbit() {
        const theta = utils.linspace( 0, 2*Math.PI, 100 );
        const p = this.a * (1-Math.pow(this.e, 2));

        var radius = [];
        var x = [];
        var y = [];
        var z = new Array(100).fill();
        var points = [];
        for (var i=0; i < 100; i++) {
            radius[i] = p / ( 1 + this.e * Math.cos(theta[i]) );
            x[i] = radius[i] * Math.cos(theta[i]);
            y[i] = radius[i] * Math.sin(theta[i]);
            points.push( new THREE.Vector3( x[i], y[i], z[i] ));
        }

        utils.rot_x(points, Math.PI / 2);
        // utils.rot_y(points, 45 * (Math.PI/180));

        const ellipse_geometry = new THREE.BufferGeometry().setFromPoints( points );
        const ellipse_material = new THREE.LineBasicMaterial( { color: 0xeb7134 } );
        const orbit = new THREE.Line( ellipse_geometry, ellipse_material );

        return orbit;
    }
}

export { Satellite };