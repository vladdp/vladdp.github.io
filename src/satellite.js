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
    nu = 0;

    thrust = 1000;
    thrustLevel = 0;

    resolution = 5000;

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
        this.fps = 60;
        this.timeElapsed = 0;

        // this.parent = main.getFocus();
        this.parent = 'Earth';
        this.parentPos = main.getBodyPosition( this.parent );

        this.option = document.createElement('option');
        this.option.text = this.name;
        this.option.value = this.name;

        this.radius = 12;
        this.mass = 610;

        this.posIJK = new THREE.Vector3();
        this.velIJK = new THREE.Vector3();
        this.accIJK = new THREE.Vector3();
        this.angVel = new THREE.Vector3( 0, 0, 0 );
        this.h = new THREE.Vector3();
        this.K = new THREE.Vector3( 0, 0, 1 );
        this.n = new THREE.Vector3();

        main.addSatFocus(this.option);
        main.updateParams( this );

        this.loadModel();

        this.ellipseGeometry = new THREE.BufferGeometry();
        this.ellipseMaterial = new THREE.LineBasicMaterial( { color: color } );
        this.ellipse = new THREE.Line( this.ellipseGeometry, this.ellipseMaterial );
        this.drawOrbit();

        this.ellipse.position.set(
            this.parentPos.x,
            this.parentPos.y,
            this.parentPos.z,
        )

        this.ellipse.computeB

        main.addToScene( this.ellipse );

        this.period = 2 * Math.PI * Math.sqrt( this.a ** 3 / utils.MU );

    }

    async loadModel() {
        const loader = new GLTFLoader();

        this.model = await loader.loadAsync( 'assets/models/deep_space/deep_space.glb' );

        main.addToScene( this.model.scene );
    }

    drawOrbit() {
        let ellipsePoints = [];
        this.p = this.a * ( 1 - Math.pow( this.e, 2 ));

        for (var i=0; i < this.resolution; i++) {
            this.r[i] = this.p / ( 1 + this.e * Math.cos( this.theta[i] ) );
            this.x[i] = this.r[i] * Math.cos( this.theta[i] );
            this.y[i] = this.r[i] * Math.sin( this.theta[i] );
            ellipsePoints.push( new THREE.Vector3( this.x[i], this.y[i], this.z[i] ));
        }

        utils.rot_z( ellipsePoints, this.w );
        utils.rot_x( ellipsePoints, -(Math.PI / 2) + this.i );
        utils.rot_y( ellipsePoints, this.raan );

        let cPoints = [];
        
        for ( let i=0; i < this.resolution; i++ ) {
            cPoints.push( ellipsePoints[i].x );
            cPoints.push( ellipsePoints[i].y );
            cPoints.push( ellipsePoints[i].z );
        }

        let points = new Float32Array( cPoints );

        this.ellipseGeometry.setAttribute( 'position',
            new THREE.BufferAttribute( points, 3 )
        );

        this.ellipse.geometry.computeBoundingSphere();
    }

    setPos() {
        this.pos = [];
        this.p = this.a * ( 1 - this.e ** 2 );
        this.pos_r = this.p / ( 1 + this.e * Math.cos( this.nu ) );
        this.pos_x = this.pos_r * Math.cos( this.nu );
        this.pos_y = this.pos_r * Math.sin( this.nu );
        this.pos_z = 0;
        
        this.pos.push( new THREE.Vector3( this.pos_x, this.pos_y, this.pos_z ) );
        
        utils.rot_z( this.pos, this.w );
        utils.rot_x( this.pos, -(Math.PI / 2) + this.i );
        utils.rot_y( this.pos, this.raan );
        
        this.posIJK.set( this.pos[0].x, -this.pos[0].z, this.pos[0].y);

        this.calcVel();
        this.updateTrueAnomaly();

        let parentPos = main.getBodyPosition( this.parent );

        this.model.scene.position.set( parentPos.x + this.pos[0].x, 
                                parentPos.y + this.pos[0].y,
                                parentPos.z + this.pos[0].z );
    }

    calcVel() {

        this.v = []
        this.nup = Math.sqrt( utils.MU / this.p );

        this.v_x = this.nup * -Math.sin( this.nu );
        this.v_y = this.nup * ( this.e + Math.cos( this.nu ) );
        this.v_z = 0;

        this.v.push( new THREE.Vector3( this.v_x, this.v_y, this.v_z ) );
        
        utils.rot_z( this.v, this.w );
        utils.rot_x( this.v, -(Math.PI / 2) + this.i );
        utils.rot_y( this.v, this.raan );
        
        this.velIJK.set( this.v[0].x, -this.v[0].z, this.v[0].y);

    }

    updateTrueAnomaly() {

        let n = Math.sqrt( utils.MU / this.a ** 3 );
        let M = n * ( this.timeElapsed % this.period );
        
        var E = M - this.e * Math.sin( M );
        
        var f = E - this.e * Math.sin( E ) - M;
        var nE = E - ( f / ( 1 - this.e * Math.cos( E ) ) );
        var dE = nE - E;
        E = nE;
        
        while ( Math.abs(dE) >= 1e-6 ) {
            f = E - this.e * Math.sin(E) - M;
            nE = E - ( f / ( 1 - this.e * Math.cos( E ) ) );
            
            dE = nE - E;
            E = nE;
        }

        let beta = this.e / ( 1 + Math.sqrt( 1 - this.e**2 ) ); 
        console.log(  );

        this.nu = E + 2 * Math.atan( ( beta * Math.sin( E ) ) / ( 1 - beta * Math.cos( E ) ) );
        
    }

    applyThrust() {

        let dir = new THREE.Vector3( 0, 1, 0 );
        dir.applyQuaternion( this.getQuaternion() );
        
        this.acc = dir.clone().multiplyScalar( ( ( this.thrust * this.thrustLevel ) / this.mass ) / 1000 );
        this.accIJK.set( this.acc.x, -this.acc.z, this.acc.y )

        this.velIJK.add( this.accIJK.clone().divideScalar( this.fps ) );

        this.h.crossVectors( this.posIJK.clone(), this.velIJK.clone() );
        this.n.crossVectors( this.K.clone(), this.h.clone() );
        
        let e = this.posIJK.clone().multiplyScalar( this.velIJK.length() ** 2 - utils.MU / this.posIJK.length() ).sub(
            this.velIJK.clone().multiplyScalar( this.posIJK.clone().dot( this.velIJK.clone() ) ) ).divideScalar( utils.MU );
   
        this.p = (this.h.length() ** 2) / ( utils.MU );
        this.e = e.length();
        this.a = this.p / ( 1 - this.e ** 2 );
        this.i = Math.acos( this.h.z / this.h.length() );
        this.raan = Math.acos( this.n.x / this.n.length() );
        if ( this.n.y < 0 ) {
            this.raan = 2 * Math.PI - this.raan;
        }
        this.w = Math.acos( this.n.clone().dot( e.clone() ) / ( this.n.length() * this.e ) );
        if ( e.z < 0 ) {
            this.w = 2 * Math.PI - this.w;
        }
        this.nu = Math.acos( e.clone().dot( this.posIJK.clone() ) / ( this.e * this.posIJK.length() ) )
                    + 1e-5;
        if ( this.posIJK.clone().dot( this.velIJK.clone() ) < 0 ) {
            this.nu = 2 * Math.PI - this.nu;
        }

        this.period = 2 * Math.PI * Math.sqrt( this.a ** 3 / utils.MU );

        let parentPos = main.getBodyPosition( this.parent );

        this.posIJK.addScaledVector( this.velIJK, 1 / this.fps );

        this.model.scene.position.set( parentPos.x + this.posIJK.x, 
                                parentPos.y + this.posIJK.z,
                                parentPos.z - this.posIJK.y );

    }

    update( timeElapsed ) {

        this.timeElapsed += timeElapsed / 1000;
        console.log( this.timeElapsed );

        this.model.scene.rotateX( this.angVel.x );
        this.model.scene.rotateY( this.angVel.y );
        this.model.scene.rotateZ( this.angVel.z );

        if ( this.thrustLevel > 0 && this.simSpeed === 1 ) {
            this.applyThrust();
            this.drawOrbit();
        } else {
            this.setPos();
        }
        
        this.ellipse.position.set(
            this.parentPos.x,
            this.parentPos.y,
            this.parentPos.z,
        )

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

    getEuler() {

        var q_0 = new THREE.Quaternion( 0, 0, 1, -1 ).normalize().multiply( new THREE.Quaternion( 0, 1, 0, -1 ).normalize().invert() )
        var q_dir = q_0.multiply( this.model.scene.quaternion.clone().invert() );

        return new THREE.Euler().setFromQuaternion( q_dir, 'XYZ' );

    }

    setThrustLevel( thrustLevel ) {
        this.thrustLevel = thrustLevel;
    }

    setSimSpeed( simSpeed ) {
        this.simSpeed = simSpeed;
    }

    setFPS( fps ) {
        this.fps = fps;
    }

    roll( dir ) {
        this.angVel.z += 0.001 * dir
    }

    pitch( dir ) {
        this.angVel.x += 0.001 * dir
    }
    
    yaw( dir ) {
        this.angVel.y += 0.001 * dir
    }

}

export { Satellite };