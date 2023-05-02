import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import * as main from 'main';
import * as utils from 'utils';

class Satellite {
    simSpeed = 1;
    scale = utils.scale;
    a = 10000/this.scale;
    e = 0;
    i = 0;
    raan = 0;
    w = 0;
    v_0 = 0;

    resolution = 1000;

    r = [];
    x = [];
    y = [];
    z = new Array(this.resolution).fill();
    theta = utils.linspace( 0, 2*Math.PI, this.resolution );

    nup;
    nx;
    ny;
    nr;

    vx = 0;
    vy = 0;

    width = 0.05;
    height = 0.05;
    depth = 0.05;

    
    constructor(name, color) {
        this.name = name;
        this.color = color;
        this.option = document.createElement('option');
        this.option.text = this.name;

        // this.parent = main.getFocus();
        this.parent = 'Earth';
        this.parentPos = main.getBodyPosition( this.parent );

        this.option = document.createElement('option');
        this.option.text = this.name;
        this.option.value = this.name;

        this.radius = 12;

        main.addFocus(this.option);

        this.loadModel();

        this.ellipsePoints = [];
        this.ellipseGeometry = new THREE.BufferGeometry().setFromPoints(this.ellipsePoints);
        this.ellipseMaterial = new THREE.LineBasicMaterial( { color: color } );
        this.ellipse = new THREE.Line( this.ellipseGeometry, this.ellipseMaterial );
        this.ellipse.geometry.attributes.position.needsUpdate = true;

        // main.addToScene( this.ellipse );
    }

    async loadModel() {
        const loader = new GLTFLoader();

        this.model = await loader.loadAsync( 'assets/models/deep_space/deep_space.glb' );

        main.addToScene( this.model.scene );
    }

    drawOrbit() {
        this.ellipsePoints = [];
        this.p = this.a * (1-Math.pow(this.e, 2));

        for (var i=0; i < this.resolution; i++) {
            this.r[i] = this.p / ( 1 + this.e * Math.cos( this.theta[i] ) );
            this.x[i] = this.r[i] * Math.cos( this.theta[i] );
            this.y[i] = this.r[i] * Math.sin( this.theta[i] );
            this.ellipsePoints.push( new THREE.Vector3( this.x[i], this.y[i], this.z[i] ));
        }

        utils.rot_z( this.ellipsePoints, this.w );
        utils.rot_x( this.ellipsePoints, -(Math.PI / 2) + this.i );
        utils.rot_y( this.ellipsePoints, this.raan );
        
        for (let i = 0; i < this.ellipsePoints.length; i++) {
            this.ellipsePoints[i].add( this.parentPos );
        }

        this.ellipseGeometry.setFromPoints( this.ellipsePoints );
        this.ellipse.geometry.computeBoundingSphere();
    }

    setPos() {
        this.pos = [];
        this.p = this.a * ( 1 - Math.pow( this.e, 2 ) );
        this.pos_r = this.p / ( 1 + this.e * Math.cos( this.v_0 ) );
        this.pos_x = this.pos_r * Math.cos( this.v_0 );
        this.pos_y = this.pos_r * Math.sin( this.v_0 );
        this.pos_z = 0;

        this.updateTrueAnomaly();
        
        this.pos.push( new THREE.Vector3( this.pos_x, this.pos_y, this.pos_z ) );
        
        utils.rot_z( this.pos, this.w );
        utils.rot_x( this.pos, -(Math.PI / 2) + this.i );
        utils.rot_y( this.pos, this.raan );

        this.model.scene.position.set( this.parentPos.x + this.pos[0].x, 
                                this.parentPos.y + this.pos[0].y,
                                this.parentPos.z + this.pos[0].z );
    }
    
    updateTrueAnomaly() {
        this.nup = Math.sqrt( utils.MU / (this.p * utils.scale) );
        this.vx = this.nup * -Math.sin( this.v_0 );
        this.vy = this.nup * ( parseFloat(this.e) + Math.cos( this.v_0 ) );

        this.vx /= utils.scale;
        this.vy /= utils.scale;

        this.nx = this.pos_x + this.vx * (this.simSpeed / 60);
        this.ny = this.pos_y + this.vy * (this.simSpeed / 60);

        this.nr = Math.sqrt( this.nx**2 + this.ny**2 );

        if ( this.ny > 0 ) {
            this.v_0 = Math.acos( this.nx / this.nr );
        } else {
            this.v_0 = 2*Math.PI - Math.acos( this.nx / this.nr );
        }
    }

    update() {
        // this.drawOrbit();
        this.setPos();
    }

    getPosition() {
        return this.model.scene.position;
    }

    setSimSpeed( simSpeed ) {
        this.simSpeed = simSpeed;
    }

    roll( dir ) {
        this.model.scene.rotation.z += 0.1 * dir * this.simSpeed;
    }

    pitch( dir ) {
        this.model.scene.rotation.x += 0.1 * dir * this.simSpeed;
    }
    
    yaw( dir ) {
        this.model.scene.rotation.y += 0.1 * dir * this.simSpeed;
    }

}

export { Satellite };