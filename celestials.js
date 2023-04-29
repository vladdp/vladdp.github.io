import * as THREE from 'three';

// import { addToScene, setCameraPos } from 'main';
import * as main from 'main';
import * as utils from 'utils';


class CelestialBody {

    constructor(data) {
        this.T = main.getT();
        this.parent = data.parent;
        this.type = data.type;
        this.name = data.name;
        this.data = data;

        if ( this.parent != null ) {
            this.parentPos = main.getBodyPosition( this.parent );
        }
        
        if ( this.type == "Planet" ) {
            this.a = (data.a * utils.AU) / utils.scale + ( (data.da * utils.AU) / utils.scale ) * this.T;
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
        } 

        if ( this.type == "Moon" ) {
            this.a = (data.a * utils.AU) / utils.scale + ( (data.da * utils.AU) / utils.scale ) * this.T;
            this.e = data.e + data.de * this.T;
            this.i = utils.toRadians( data.i ) + utils.toRadians( data.di ) * this.T;
            this.L = ( utils.toRadians( data.L ) + utils.toRadians( data.dL ) * this.T ) % (2*Math.PI);
            this.lop = ( utils.toRadians( data.lop ) + utils.toRadians( data.dlop ) * this.T ) % (2*Math.PI);
            this.loan = utils.toRadians( data.loan ) + utils.toRadians( data.dloan ) * this.T;
            this.argperi = this.lop - this.loan;
            this.nu = 0;
        }
        
        this.radius = data.radius / utils.scale;
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

        if (this.parent != null) {
            this.drawOrbit();
            this.setPos();
        }

        main.addFocus(this.option);
        main.addToScene(this.sphere);
    }

    calculateE() {
        const tol = 10 ** -6;
        const eStar = ( 180/Math.PI ) * this.e;

        var E = this.M - eStar * Math.sin( this.M );
        var dM = this.M - ( E - eStar * Math.sin(E) );
        var dE = dM / ( 1 - this.e * Math.cos(E) );
        E += dE;

        while ( Math.abs(dE) < tol ) {
            dM = this.M - ( E - eStar * Math.sin(E) );
            dE = dM / ( 1 - this.e * Math.cos(E) );
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
        var ellipsePoints = [];

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
            ellipsePoints.push( new THREE.Vector3( x[i], y[i], z[i] ) );
        }

        utils.rot_z( ellipsePoints, this.argperi );
        utils.rot_x( ellipsePoints, -(Math.PI / 2) + this.i );
        utils.rot_y( ellipsePoints, this.loan );

        for (let i = 0; i < ellipsePoints.length; i++) {
            ellipsePoints[i].add(this.parentPos);
        }

        const ellipseGeometry = new THREE.BufferGeometry().setFromPoints(ellipsePoints);
        const ellipseMaterial = new THREE.LineBasicMaterial( { color: this.color } );
        this.ellipse = new THREE.Line( ellipseGeometry, ellipseMaterial );

        main.addToScene(this.ellipse);
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
        this.sphere.rotation.y += this.rotationAngle * 100;

        if ( this.type == "Planet" ) {
            this.T = main.getT();
            this.updateElements( this.data );
            this.setPos();
        }

        if ( this.name == "Earth" ) {
            // console.log(this.sphere.position);
        }

        if ( this.type == "Moon") {
            // this.drawOrbit();
            this.setPos();
        }
    }

    updateElements( data ) {
        this.a = (data.a * utils.AU) / utils.scale + ( (data.da * utils.AU) / utils.scale ) * this.T;
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
    }
}

export { CelestialBody };