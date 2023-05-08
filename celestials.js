import * as THREE from 'three';

import * as main from 'main';
import * as utils from 'utils';


class CelestialBody {

    constructor( data ) {
        this.T = main.getT();
        this.parent = data.parent;
        this.type = data.type;
        this.name = data.name;
        this.data = data;
        this.simSpeed = 1;
        this.tol = 1e-6;
        
        this.radius = data.radius;
        this.rotationAngle = 2 * Math.PI / data.rotationPeriod;

        this.texture = data.texture;
        this.color = data.color;

        this.option = document.createElement('option');
        this.option.text = data.name;
        this.option.value = data.name;

        if ( this.type === "Planet" || this.type === "Moon" ) {
            this.sphere = new THREE.Mesh(
                new THREE.SphereGeometry( this.radius, 64, 64 ),
                new THREE.MeshStandardMaterial({
                    map: new THREE.TextureLoader().load( this.texture ),
                })
            );
        } else {
            this.sphere = new THREE.Mesh(
                new THREE.SphereGeometry( this.radius, 64, 64 ),
                new THREE.MeshBasicMaterial({
                    map: new THREE.TextureLoader().load( this.texture ),
                })
            );
        }
        
        main.addFocus(this.option);
        main.addToScene(this.sphere);
    }

    calculateE() {
        var E = 0;
        var E = this.M - this.e * Math.sin( this.M );

        var f = E - this.e * Math.sin(E) - this.M;
        var nE = E - ( f / ( 1 - this.e * Math.cos( E ) ) );
        var dE = nE - E;
        E = nE;

        while ( Math.abs(dE) <= this.tol ) {
            f = E - this.e * Math.sin(E) - this.M;
            nE = E - ( f / ( 1 - this.e * Math.cos( E ) ) );

            dE = nE - E;
            E = nE;
        }

        this.E = E;
    }

    calculateTrueAnomaly() {
        const beta = this.e / ( 1 + Math.sqrt( 1 - this.e**2 ) );

        this.nu = this.E + 2 * Math.atan( ( beta * Math.sin(this.E) ) / ( 1 - beta * Math.cos(this.E) ) );
    }

    drawOrbit() {
        const ellipseResolution = 1000;
        this.ellipsePoints = [];

        const theta = utils.linspace( 0, 2*Math.PI, ellipseResolution );
        const p = this.a * ( 1 - Math.pow( this.e, 2 ) );

        var r = [];
        var x = [];
        var y = [];
        var z = [];

        for (var i=0; i < ellipseResolution; i++) {
            r[i] = p / ( 1 + this.e * Math.cos(theta[i]) );
            x[i] = r[i] * Math.cos( theta[i] );
            y[i] = r[i] * Math.sin( theta[i] );
            this.ellipsePoints.push( new THREE.Vector3( x[i], y[i], z[i] ) );
        }

        utils.rot_z( this.ellipsePoints, this.argperi );
        utils.rot_x( this.ellipsePoints, -(Math.PI / 2) + this.i );
        utils.rot_y( this.ellipsePoints, this.loan );

        for (let i = 0; i < this.ellipsePoints.length; i++) {
            this.ellipsePoints[i].add(this.parentPos);
        }

        this.ellipseGeometry.setFromPoints( this.ellipsePoints );
        this.ellipse.geometry.computeBoundingSphere();
    }

    setPos() {
        this.pos = [];
        this.p = this.a * ( 1-Math.pow(this.e, 2) );
        this.r = this.p / ( 1 + this.e * Math.cos( this.nu ) );

        this.x = this.r * Math.cos( this.nu );
        this.y = this.r * Math.sin( this.nu );
        this.z = 0;
        this.pos.push( new THREE.Vector3( this.x, this.y, this.z ) );

        utils.rot_z( this.pos, this.argperi );
        utils.rot_x( this.pos, -(Math.PI / 2) + this.i );
        utils.rot_y( this.pos, this.loan );

        this.sphere.position.set( this.parentPos.x + this.pos[0].x, 
                                  this.parentPos.y + this.pos[0].y, 
                                  this.parentPos.z + this.pos[0].z );
    }

    update() {
        this.sphere.rotation.y += this.rotationAngle * (this.simSpeed / 60);
    }

    updateElements( data ) {
        this.a = (data.a * utils.AU) + (data.da * utils.AU) * this.T;
        this.e = data.e + data.de * this.T;
        this.i = utils.toRadians( data.i ) + utils.toRadians( data.di ) * this.T;
        this.L = ( utils.toRadians( data.L ) + utils.toRadians( data.dL ) * this.T ) % (2*Math.PI);
        this.lop = ( utils.toRadians( data.lop ) + utils.toRadians( data.dlop ) * this.T ) % (2*Math.PI);
        this.loan = utils.toRadians( data.loan ) + utils.toRadians( data.dloan ) * this.T;
        this.argperi = this.lop - this.loan;
        this.M = this.L - this.lop;
        // if ( this.M > Math.PI ) this.M -= 2*Math.PI;
        // if ( this.M < -Math.PI ) this.M += 2*Math.PI;

        this.calculateE();
        this.calculateTrueAnomaly();
    }

    getPosition() {
        return this.sphere.position;
    }

    getMass() {
        return this.data.mass;
    }

    getSOIRadius() {
        return this.a * ( this.data.mass / main.getBodyMass( this.parent ) ) ** ( 2 / 5 );
    }

    setSimSpeed( simSpeed ) {
        this.simSpeed = simSpeed;
    }

    setFPS( fps ) {
        this.fps = fps;
    }
}

class Planet extends CelestialBody {

    constructor( data ) {
        super( data );

        this.parentPos = main.getBodyPosition( this.parent );
        this.updateElements( this.data );

        this.ellipsePoints = [];
        this.ellipseGeometry = new THREE.BufferGeometry().setFromPoints(this.ellipsePoints);
        this.ellipse = new THREE.Line(
            this.ellipseGeometry,
            new THREE.LineBasicMaterial( { 
                color: this.color,
                transparent: true,
                opacity: 0.5,
            } )
        );
        // this.ellipse.frustumCulled = false;
        this.ellipse.geometry.attributes.position.needsUpdate = true;

        this.SOIRadius = this.getSOIRadius();
        this.SOISphere = new THREE.Mesh(
            new THREE.SphereGeometry( this.SOIRadius, 64, 64 ),
            new THREE.MeshBasicMaterial({
                wireframe: true,
                color: this.color,
                transparent: true,
                opacity: 0.05,
            })
        );

        if ( this.name === "Saturn" ) {
            this.ring = new THREE.Mesh(
                new THREE.RingGeometry( 1.11*this.radius, 2.987*this.radius, 64),
                new THREE.MeshBasicMaterial( { 
                    color: this.color,
                    transparent: true, 
                    opacity: 0.9,
                    // map: this.data.ringTexture,
                } )
            )

            // main.addToScene( this.ring );
            // this.ring.rotation.x += Math.PI / 2;
        }
        main.addToScene( this.SOISphere );
        
        this.drawOrbit();
        this.setPos();

        // main.addToScene(this.ellipse);
    }

    setPos() {
        this.pos = [];
        this.p = this.a * ( 1-Math.pow(this.e, 2) );
        this.r = this.p / ( 1 + this.e * Math.cos( this.nu ) );

        this.x = this.r * Math.cos( this.nu );
        this.y = this.r * Math.sin( this.nu );
        this.z = 0;
        this.pos.push( new THREE.Vector3( this.x, this.y, this.z ) );

        utils.rot_z( this.pos, this.argperi );
        utils.rot_x( this.pos, -(Math.PI / 2) + this.i );
        utils.rot_y( this.pos, this.loan );

        this.sphere.position.set( this.parentPos.x + this.pos[0].x, 
                                  this.parentPos.y + this.pos[0].y, 
                                  this.parentPos.z + this.pos[0].z );

        this.SOISphere.position.set( this.parentPos.x + this.pos[0].x, 
                                  this.parentPos.y + this.pos[0].y, 
                                  this.parentPos.z + this.pos[0].z );

        if ( this.name === "Saturn" ) {
            this.ring.position.set( this.parentPos.x + this.pos[0].x, 
                this.parentPos.y + this.pos[0].y, 
                this.parentPos.z + this.pos[0].z );
        }
    }

    update() {
        this.sphere.rotation.y += this.rotationAngle * (this.simSpeed / 60);

        this.T = main.getT();
        this.updateElements( this.data );
        // this.drawOrbit();
        this.setPos();
    }
    
}

class Moon extends CelestialBody {

    constructor( data ) {
        super( data );
        this.fps = 60;

        this.parentPos = main.getBodyPosition( this.parent );

        this.a = data.a * utils.AU + (data.da * utils.AU) * this.T;
        this.e = data.e + data.de * this.T;
        this.i = utils.toRadians( data.i ) + utils.toRadians( data.di ) * this.T;
        this.L = ( utils.toRadians( data.L ) + utils.toRadians( data.dL ) * this.T ) % (2*Math.PI);
        this.lop = ( utils.toRadians( data.lop ) + utils.toRadians( data.dlop ) * this.T ) % (2*Math.PI);
        this.loan = utils.toRadians( data.loan ) + utils.toRadians( data.dloan ) * this.T;
        this.argperi = this.lop - this.loan;
        this.nu = Math.random() * ( 2 * Math.PI );

        this.ellipsePoints = [];
        this.ellipseGeometry = new THREE.BufferGeometry().setFromPoints(this.ellipsePoints);
        this.ellipse = new THREE.Line(
            this.ellipseGeometry,
            new THREE.LineBasicMaterial( { 
                color: this.color,
                transparent: true,
                opacity: 0.5,
            } )
        );
        // this.ellipse.frustumCulled = false;
        this.ellipse.geometry.attributes.position.needsUpdate = true;

        this.SOIRadius = this.getSOIRadius();
        this.SOISphere = new THREE.Mesh(
            new THREE.SphereGeometry( this.SOIRadius, 64, 64 ),
            new THREE.MeshBasicMaterial({
                wireframe: true,
                color: this.color,
                transparent: true,
                opacity: 0.05,
            })
        );

        this.drawOrbit();

        main.addToScene(this.ellipse);
        main.addToScene( this.SOISphere );
    }

    setPos() {
        this.pos = [];
        this.p = this.a * ( 1 - Math.pow( this.e, 2 ) );
        this.r = this.p / ( 1 + this.e * Math.cos( this.nu ) );

        this.x = this.r * Math.cos( this.nu );
        this.y = this.r * Math.sin( this.nu );
        this.z = 0;
        this.pos.push( new THREE.Vector3( this.x, this.y, this.z ) );

        utils.rot_z( this.pos, this.argperi );
        utils.rot_x( this.pos, -(Math.PI / 2) + this.i );
        utils.rot_y( this.pos, this.loan );

        this.updateTrueAnomaly();

        this.sphere.position.set( this.parentPos.x + this.pos[0].x, 
                                  this.parentPos.y + this.pos[0].y, 
                                  this.parentPos.z + this.pos[0].z );

        this.SOISphere.position.set( this.parentPos.x + this.pos[0].x, 
                                  this.parentPos.y + this.pos[0].y, 
                                  this.parentPos.z + this.pos[0].z );
    }

    updateTrueAnomaly() {
        this.v = []
        this.nup = Math.sqrt( utils.MU / this.p );

        this.v_x = this.nup * -Math.sin( this.nu );
        this.v_y = this.nup * ( this.e + Math.cos( this.nu ) );

        this.nx = this.x + this.v_x * ( this.simSpeed / this.fps );
        this.ny = this.y + this.v_y * ( this.simSpeed / this.fps );

        this.nr = Math.sqrt( this.nx**2 + this.ny**2 );

        if ( this.ny > 0 ) {
            this.nu = Math.acos( this.nx / this.nr );
        } else {
            this.nu = 2 * Math.PI - Math.acos( this.nx / this.nr );
        }        
        
    }

    update() {
        this.sphere.rotation.y += this.rotationAngle * ( this.simSpeed / this.fps );

        this.drawOrbit();
        this.setPos();
    }
}

export { CelestialBody, Planet, Moon };