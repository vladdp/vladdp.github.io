import * as THREE from 'three';

// import { addToScene, setCameraPos } from 'main';
import * as main from 'main';
import * as utils from 'utils';


class CelestialBody {

    constructor(data) {
        this.radius = data.radius / utils.scale;
        this.a = data.a / utils.scale;
        this.e = data.e;
        this.i = utils.toRadians( data.i );
        this.loan = utils.toRadians( data.loan );
        this.argperi = utils.toRadians( data.argperi );

        this.parent = data.parent;
        this.texture = data.texture;
        this.color = data.color;

        this.option = document.createElement('option');
        this.option.text = data.name;
        this.option.value = data.name;

        this.shape = new THREE.Mesh(
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
        main.addToScene(this.shape);
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
            ellipsePoints.push( new THREE.Vector3( x[i], y[i], z[i] ));
        }

        utils.rot_z( ellipsePoints, this.argperi );
        utils.rot_x( ellipsePoints, -(Math.PI / 2) + this.i );
        utils.rot_y( ellipsePoints, this.loan );

        const ellipseGeometry = new THREE.BufferGeometry().setFromPoints(ellipsePoints);
        const ellipseMaterial = new THREE.LineBasicMaterial( { color: this.color } );
        const ellipse = new THREE.Line( ellipseGeometry, ellipseMaterial );

        main.addToScene(ellipse);
    }

    setPos() {
        this.pos = [];
        this.p = this.a * ( 1-Math.pow(this.e, 2) );
        this.r = this.p / ( 1 + this.e * Math.cos( 0 ) );

        this.x = this.r * Math.cos( 0 );
        this.y = this.r * Math.sin( 0 );
        this.z = 0;
        this.pos.push( new THREE.Vector3(this.x, this.y, this.z) );

        utils.rot_z( this.pos, this.argperi );
        utils.rot_x( this.pos, -(Math.PI / 2) + this.i );
        utils.rot_y( this.pos, this.loan );

        this.shape.position.set( this.pos[0].x, this.pos[0].y, this.pos[0].z );

        // main.setFocus( this.shape );
    }

    update() {

    }
}

export { CelestialBody };