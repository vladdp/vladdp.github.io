import * as THREE from 'three';
import { addToScene } from 'main';
import * as utils from "utils";

class Moon {
    speed = utils.speed;
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

        this.drawOrbit();
        this.setPos();
    }

    drawOrbit() {
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

    setPos() {
        this.pos = [];
        this.p = this.a * ( 1-Math.pow(this.e, 2) );
        this.pos_r = this.p / ( 1 + this.e * Math.cos( this.v_0 ) );
        this.pos_x = this.pos_r * Math.cos( this.v_0 );
        this.pos_y = this.pos_r * Math.sin( this.v_0 );
        this.pos_z = 0;

        this.updateTrueAnomaly();
        
        this.pos.push( new THREE.Vector3( this.pos_x, this.pos_y, this.pos_z ) );
        
        utils.rot_z( this.pos, this.w );
        utils.rot_x( this.pos, -(Math.PI / 2) + this.i );
        utils.rot_y( this.pos, this.raan );

        this.shape.position.set( this.pos[0].x, this.pos[0].y, this.pos[0].z );
    }
    
    updateTrueAnomaly() {
        this.nup = Math.sqrt( utils.MU / (this.p * utils.scale) );
        this.vx = this.nup * -Math.sin( this.v_0 );
        this.vy = this.nup * ( parseFloat(this.e) + Math.cos( this.v_0 ) );

        this.vx /= utils.scale;
        this.vy /= utils.scale;

        this.nx = this.pos_x + this.vx * (this.speed / 60);
        this.ny = this.pos_y + this.vy * (this.speed / 60);

        this.nr = Math.sqrt( this.nx**2 + this.ny**2 );

        if ( this.ny > 0 ) {
            this.v_0 = Math.acos( this.nx / this.nr );
        } else {
            this.v_0 = 2*Math.PI - Math.acos( this.nx / this.nr );
        }
    }
}

export { Moon };