import * as THREE from 'three';

// import { addToScene, setCameraPos } from 'main';
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
        
        this.radius = data.radius;
        this.rotationAngle = 2 * Math.PI / data.rotationPeriod;

        this.texture = data.texture;
        this.color = data.color;

        this.option = document.createElement('option');
        this.option.text = data.name;
        this.option.value = data.name;

        this.sphere = new THREE.Mesh(
            new THREE.SphereGeometry( this.radius, 64, 64 ),
            new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load( this.texture ),
            })
        );

        main.addFocus(this.option);
        main.addToScene(this.sphere);
    }

    calculateE() {
        const tol = 10 ** -6;
        // const eStar = ( 180 / Math.PI ) * this.e;

        var E = this.M - this.e * Math.sin( this.M );

        var dM = E - this.e * Math.sin(E) - this.M;
        var dE = E - ( dM / ( 1 - this.e * Math.cos(E) ) );
        E += dE;

        while ( Math.abs(dE) <= tol ) {
            dM = E - this.e * Math.sin(E) - this.M;
            dE = E - ( dM / ( 1 - this.e * Math.cos(E) ) );
            E += dE;
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
        this.pos.push( new THREE.Vector3(this.x, this.y, this.z) );

        utils.rot_z( this.pos, this.argperi );
        utils.rot_x( this.pos, -(Math.PI / 2) + this.i );
        utils.rot_y( this.pos, this.loan );

        this.sphere.position.set( this.parentPos.x + this.pos[0].x, 
                                  this.parentPos.y + this.pos[0].y, 
                                  this.parentPos.z + this.pos[0].z );
    }

    update() {
        this.sphere.rotation.y += this.rotationAngle * (this.simSpeed / 60);

        if ( this.type == "Planet" ) {
            this.T = main.getT();
            this.updateElements( this.data );
            // this.drawOrbit();
            this.setPos();
        }

        if ( this.type == "Moon") {
            this.drawOrbit();
            this.setPos();
        }
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
        if ( this.M > Math.PI ) this.M -= 2*Math.PI;
        if ( this.M < -Math.PI ) this.M += 2*Math.PI;

        this.calculateE();
        this.calculateTrueAnomaly();

        // if ( this.name == "Mercury" ) {
        //     console.log( "M: ", this.M );
        //     console.log( "E: ", this.E );
        //     console.log( "nu: ", this.nu );
        // }
    }

    getPosition() {
        return this.sphere.position;
    }

    setSimSpeed( simSpeed ) {
        this.simSpeed = simSpeed;
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
            new THREE.LineBasicMaterial( { color: this.color } )
        );
        // this.ellipse.frustumCulled = false;
        this.ellipse.geometry.attributes.position.needsUpdate = true;

        this.drawOrbit();
        this.setPos();

        // main.addToScene(this.ellipse);
    }
    
}

class Moon extends CelestialBody {

    constructor( data ) {
        super( data );

        this.parentPos = main.getBodyPosition( this.parent );

        this.a = data.a * utils.AU + (data.da * utils.AU) * this.T;
        this.e = data.e + data.de * this.T;
        this.i = utils.toRadians( data.i ) + utils.toRadians( data.di ) * this.T;
        this.L = ( utils.toRadians( data.L ) + utils.toRadians( data.dL ) * this.T ) % (2*Math.PI);
        this.lop = ( utils.toRadians( data.lop ) + utils.toRadians( data.dlop ) * this.T ) % (2*Math.PI);
        this.loan = utils.toRadians( data.loan ) + utils.toRadians( data.dloan ) * this.T;
        this.argperi = this.lop - this.loan;
        this.nu = 0;

        this.ellipsePoints = [];
        this.ellipseGeometry = new THREE.BufferGeometry().setFromPoints(this.ellipsePoints);
        this.ellipse = new THREE.Line(
            this.ellipseGeometry,
            new THREE.LineBasicMaterial( { color: this.color } )
        );
        // this.ellipse.frustumCulled = false;
        this.ellipse.geometry.attributes.position.needsUpdate = true;

        this.drawOrbit();
        this.setPos();

        main.addToScene(this.ellipse);
    }
}

export { CelestialBody, Planet, Moon };