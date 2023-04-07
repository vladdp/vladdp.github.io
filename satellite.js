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
    p;
    
    points = [];
    resolution = 1000;

    r = [];
    x = [];
    y = [];
    z = new Array(100).fill();
    theta = utils.linspace( 0, 2*Math.PI, this.resolution );

    vx = 0;
    vy = 0;

    width = 0.05;
    height = 0.05;
    depth = 0.05;

    
    constructor(name, color) {
        this.name = name;
        this.option = document.createElement('option');
        this.option.text = this.name;

        this.geometry = new THREE.BoxGeometry( this.width, this.height, this.depth );
        this.material = new THREE.MeshBasicMaterial( {color: color} );
        this.material.wireframe = true;
        this.cube = new THREE.Mesh( this.geometry, this.material );

        this.ellipse_geometry = new THREE.BufferGeometry().setFromPoints(this.points);
        this.ellipse_material = new THREE.LineBasicMaterial( { color: color } );
        this.ellipse = new THREE.Line( this.ellipse_geometry, this.ellipse_material );
        this.ellipse.geometry.attributes.position.needsUpdate = true;
    }

    setEllipse() {
        this.points = [];
        this.p = this.a * (1-Math.pow(this.e, 2));

        for (var i=0; i < this.resolution; i++) {
            this.r[i] = this.p / ( 1 + this.e * Math.cos(this.theta[i]) );
            this.x[i] = this.r[i] * Math.cos(this.theta[i]);
            this.y[i] = this.r[i] * Math.sin(this.theta[i]);
            this.points.push( new THREE.Vector3( this.x[i], this.y[i], this.z[i] ));
        }
        
        utils.rot_z( this.points, this.w );
        utils.rot_x( this.points, -(Math.PI / 2) + this.i );
        utils.rot_y( this.points, this.raan );

        this.ellipse_geometry.setFromPoints( this.points );
    }

    setPos() {
        this.pos = [];
        this.p = this.a * ( 1-Math.pow(this.e, 2) );
        this.pos_r = this.p / ( 1 + this.e * Math.cos( this.v_0 ) );
        this.pos_x = this.pos_r * Math.cos( this.v_0 );
        this.pos_y = this.pos_r * Math.sin( this.v_0 );
        this.pos_z = 0;

        // this.updateTrueAnomaly();
        
        this.pos.push( new THREE.Vector3( this.pos_x, this.pos_y, this.pos_z ) );
        
        utils.rot_z( this.pos, this.w );
        utils.rot_x( this.pos, -(Math.PI / 2) + this.i );
        utils.rot_y( this.pos, this.raan );

        this.cube.position.set( this.pos[0].x, this.pos[0].y, this.pos[0].z );
    }
    
    updateTrueAnomaly() {
        this.vx = Math.sqrt( utils.MU / (this.p * utils.scale) ) * -Math.sin( this.v_0 );
        this.vy = Math.sqrt( utils.MU / (this.p * utils.scale) ) * (this.e + Math.cos( this.v_0 ) );

        this.vx /= utils.scale;
        this.vy /= utils.scale;

        var nx = this.pos_x + this.vx * 20;
        var ny = this.pos_y + this.vy * 20;

        var nr = Math.sqrt( nx**2 + ny**2 );

        var v_0x = Math.acos( nx / nr );
        var inc = v_0x - this.v_0;

        if ( inc > 0 ) {
            this.v_0 = v_0x;
            console.log(v_0x);
        } else {
            console.log("here", v_0x, inc);
            this.v_0 = 2*Math.PI - v_0x;
        }

    }
}

export { Satellite };