import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import * as main from 'main';
import * as utils from 'utils';

class Satellite {
    simSpeed = 1;
    a = 10000;
    e = 0.00001;
    i = 0;
    raan = 0;
    w = 0;
    v_0 = 0;

    thrust = 1000;
    thrustLevel = 0;

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

    constructor(name, color) {
        this.name = name;
        this.color = color;
        this.option = document.createElement('option');
        this.option.text = this.name;

        // this.parent = main.getFocus();
        this.parent = 'Earth';
        this.parentPos = main.getBodyPosition( this.parent ).clone();

        this.option = document.createElement('option');
        this.option.text = this.name;
        this.option.value = this.name;

        this.radius = 12;
        this.mass = 610;

        this.posIJK = new THREE.Vector3();
        this.velIJK = new THREE.Vector3();
        this.accIJK = new THREE.Vector3();
        this.h = new THREE.Vector3();
        this.K = new THREE.Vector3( 0, 0, 1 );
        this.n = new THREE.Vector3();

        main.addFocus(this.option);
        main.updateParams( this );

        this.loadModel();

        let ellipsePoints = new Float32Array( this.resolution * 3 );
        this.ellipseGeometry = new THREE.BufferGeometry().setFromPoints( ellipsePoints );
        this.ellipseMaterial = new THREE.LineBasicMaterial( { color: color } );
        this.ellipse = new THREE.Line( this.ellipseGeometry, this.ellipseMaterial );
        this.ellipse.geometry.attributes.position.needsUpdate = true;

        this.drawOrbit();

        main.addToScene( this.ellipse );
    }

    async loadModel() {
        const loader = new GLTFLoader();

        this.model = await loader.loadAsync( 'assets/models/deep_space/deep_space.glb' );

        main.addToScene( this.model.scene );
    }

    drawOrbit() {
        let ellipsePoints = [];
        this.p = this.a * (1-Math.pow(this.e, 2));

        for (var i=0; i < this.resolution; i++) {
            this.r[i] = this.p / ( 1 + this.e * Math.cos( this.theta[i] ) );
            this.x[i] = this.r[i] * Math.cos( this.theta[i] );
            this.y[i] = this.r[i] * Math.sin( this.theta[i] );
            ellipsePoints.push( new THREE.Vector3( this.x[i], this.y[i], this.z[i] ));
        }

        utils.rot_z( ellipsePoints, this.w );
        utils.rot_x( ellipsePoints, -(Math.PI / 2) + this.i );
        utils.rot_y( ellipsePoints, this.raan );

        this.parentPos = main.getBodyPosition( this.parent ).clone();
        
        for (let i = 0; i < ellipsePoints.length; i++) {
            ellipsePoints[i].add( this.parentPos );
        }

        this.ellipseGeometry.setFromPoints( ellipsePoints );
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

        let parentPos = main.getBodyPosition( this.parent );

        this.model.scene.position.set( parentPos.x + this.pos[0].x, 
                                parentPos.y + this.pos[0].y,
                                parentPos.z + this.pos[0].z );

        this.posIJK.set( this.pos[0].x, -this.pos[0].z, this.pos[0].y);    
    }
    
    updateTrueAnomaly() {
        this.v = []
        this.nup = Math.sqrt( utils.MU / this.p );

        this.v_x = this.nup * -Math.sin( this.v_0 );
        this.v_y = this.nup * ( parseFloat(this.e) + Math.cos( this.v_0 ) );
        this.v_z = 0;

        this.nx = this.pos_x + this.v_x * (this.simSpeed / main.getFPS());
        this.ny = this.pos_y + this.v_y * (this.simSpeed / main.getFPS());

        this.nr = Math.sqrt( this.nx**2 + this.ny**2 );

        if ( this.ny > 0 ) {
            this.v_0 = Math.acos( this.nx / this.nr );
        } else {
            this.v_0 = 2*Math.PI - Math.acos( this.nx / this.nr );
        }
        
        this.v.push( new THREE.Vector3( this.v_x, this.v_y, this.v_z ) );
        
        utils.rot_z( this.v, this.w );
        utils.rot_x( this.v, -(Math.PI / 2) + this.i );
        utils.rot_y( this.v, this.raan );
        
        this.velIJK.set( this.v[0].x, -this.v[0].z, this.v[0].y);

        // console.log( "Calc vel: ", this.velIJK );
    }

    applyThrust() {
        let dir = new THREE.Vector3( 0, 1, 0 );
        dir.applyQuaternion( this.getQuaternion() );
        
        this.acc = dir.clone().multiplyScalar( ( (this.thrust * this.thrustLevel) / this.mass) / 1000 );
        this.accIJK.set( this.acc.x, -this.acc.z, this.acc.y )
        console.log( "a: ", this.accIJK );
        
        this.velIJK.add( this.accIJK.clone().divideScalar( main.getFPS() ) );
        console.log( "r: ", this.posIJK );
        console.log( "v: ", this.velIJK );
        
        this.h.crossVectors( this.posIJK.clone(), this.velIJK.clone() );
        
        this.n.crossVectors( this.K.clone(), this.h.clone() );
        
        let e = this.posIJK.clone().multiplyScalar( this.velIJK.clone().length() ** 2 - utils.MU / this.posIJK.clone().length() ).sub(
            this.velIJK.clone().multiplyScalar( this.posIJK.clone().dot( this.velIJK.clone() ) ) ).divideScalar( utils.MU );
   
        // console.log( "Last: ", this.a, this.e, utils.toDegrees(this.i), utils.toDegrees(this.raan), utils.toDegrees(this.w), utils.toDegrees(this.v_0) );
        let p = this.h.clone().length() ** 2 / ( utils.MU );
        this.a = p / ( 1 - this.e ** 2 );
        this.e = e.length();
        this.i = Math.acos( this.h.clone().z / this.h.clone().length() );
        this.raan = Math.acos( this.n.clone().x / this.n.clone().length() );
        if ( this.n.y < 0 ) {
            this.raan = 2 * Math.PI - this.raan;
        }
        this.w = Math.acos( this.n.clone().dot( e.clone() ) / ( this.n.clone().length() * this.e ) );
        if ( e.z < 0 ) {
            this.w = 2 * Math.PI - this.w;
        }
        this.v_0 = Math.acos( e.clone().dot( this.posIJK.clone() ) / ( this.e * this.posIJK.clone().length() ) );
        if ( this.posIJK.clone().dot( this.velIJK.clone() ) < 0 ) {
            this.v_0 = 2 * Math.PI - this.v_0;
        }
        // console.log( "New", this.a, this.e, utils.toDegrees(this.i), utils.toDegrees(this.raan), utils.toDegrees(this.w), utils.toDegrees(this.v_0) );
    }

    update() {
        if ( this.thrustLevel > 0 && this.simSpeed === 1 ) {
            this.applyThrust();
        }
        
        this.drawOrbit();
        this.setPos();
        main.updateParams( this );
    }

    getPosition() {
        return this.model.scene.position;
    }

    getPositionIJK() {
        return this.posIJK;
    }

    getPositionRelativeToParent() {
        return this.pos[0];
    }

    getVelocity() {
        return this.v[0];
    }

    getVelocityIJK() {
        return this.velIJK;
    }

    getQuaternion() {
        return this.model.scene.quaternion;
    }

    setThrustLevel( thrustLevel ) {
        this.thrustLevel = thrustLevel;
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