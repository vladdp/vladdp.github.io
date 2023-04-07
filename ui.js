import * as utils from 'utils';
import { Satellite } from 'sat';
import { addToScene } from 'main';

class UI {
    title = document.createElement('div');
    addSatButt = document.createElement('button');
    satList = document.createElement('select');
    orbitalParams = document.createElement('div');
    semiMajor = document.createElement('div');
    eccentricity = document.createElement('div');
    inclination = document.createElement('div');
    raan = document.createElement('div');
    argPer = document.createElement('div');
    trueAnomaly = document.createElement('div');

    inputSemiMajor = document.createElement('input')
    inputEccentricity = document.createElement('input')
    inputInclination = document.createElement('input')
    inputRaan = document.createElement('input')
    inputArgPer = document.createElement('input')
    inputTrueAnomaly = document.createElement('input')

    currentSat=0;

    sats = [];
    rotSpeed = utils.rotSpeed;
    
    constructor() {
        this.title.innerText = "ThreeJSat";
        this.title.id = 'title';
        document.body.appendChild(this.title);
        
        this.addSatButt.innerText = "Add Satellite";
        this.addSatButt.id = 'addSatButt';
        this.addSatButt.addEventListener( 'click', () => this.addSat() );
        document.body.appendChild(this.addSatButt);

        this.satList.id = 'satList';
        this.satList.addEventListener( "change", () => this.changeSat() );
        document.body.appendChild(this.satList);

        this.orbitalParams.innerText = "Orbital Parameters";
        this.orbitalParams.id = "orbParams";
        document.body.appendChild(this.orbitalParams);

        this.semiMajor.innerText = "Semi-major axis (km)";
        this.semiMajor.id = "semiMajor";
        document.body.appendChild(this.semiMajor);

        this.eccentricity.innerText = "Eccentricity";
        this.eccentricity.id = "eccentricity";
        document.body.appendChild(this.eccentricity);

        this.inclination.innerText = "Inclination (deg)";
        this.inclination.id = "inclination";
        document.body.appendChild(this.inclination);

        this.raan.innerText = "RAAN (deg)";
        this.raan.id = "raan";
        document.body.appendChild(this.raan);

        this.argPer.innerText = "Arg of Perigee (deg)";
        this.argPer.id = "argPer";
        document.body.appendChild(this.argPer);

        this.trueAnomaly.innerText = "True Anomaly (deg)";
        this.trueAnomaly.id = "trueAnomaly";
        document.body.appendChild(this.trueAnomaly);

        this.inputSemiMajor.setAttribute("type", "number");
        this.inputSemiMajor.id = "inputSemiMajor";
        this.inputSemiMajor.step = 100;
        this.inputSemiMajor.addEventListener( "input", () => this.setSemiMajor() );
        document.body.appendChild(this.inputSemiMajor);

        this.inputEccentricity.setAttribute("type", "number");
        this.inputEccentricity.id = "inputEccentricity";
        this.inputEccentricity.step = 0.02;
        this.inputEccentricity.addEventListener( "input", () => this.setEccentricity() );
        document.body.appendChild(this.inputEccentricity);

        this.inputInclination.setAttribute("type", "number");
        this.inputInclination.id = "inputInclination";
        this.inputInclination.addEventListener( "input", () => this.setInclination() );
        document.body.appendChild(this.inputInclination);

        this.inputRaan.setAttribute("type", "number");
        this.inputRaan.id = "inputRaan";
        this.inputRaan.addEventListener( "input", () => this.setRaan() );
        document.body.appendChild(this.inputRaan);

        this.inputArgPer.setAttribute("type", "number");
        this.inputArgPer.id = "inputArgPer";
        this.inputArgPer.addEventListener( "input", () => this.setArgPer() );
        document.body.appendChild(this.inputArgPer);

        this.inputTrueAnomaly.setAttribute("type", "number");
        this.inputTrueAnomaly.id = "inputTrueAnomaly";
        this.inputTrueAnomaly.addEventListener( "input", () => this.setTrueAnomaly() );
        document.body.appendChild(this.inputTrueAnomaly);
    }
    
    addSat() {
        let name = "Sat #" + (this.sats.length+1).toString();
        this.sats.push( new Satellite(name, utils.colors[this.sats.length % 20]) );
        this.satList.add(this.sats[this.sats.length-1].option);

        this.currentSat = this.satList.length - 1;
        this.satList.selectedIndex = this.currentSat;
        
        this.update();
        this.sats[this.currentSat].setEllipse();
        addToScene( this.sats[this.currentSat].cube );
        addToScene( this.sats[this.currentSat].ellipse );
    }

    changeSat() {
        this.currentSat = this.satList.selectedIndex;

        this.update();
    }

    update() {
        this.inputSemiMajor.value = this.sats[this.currentSat].a * utils.scale;
        this.inputEccentricity.value = this.sats[this.currentSat].e;
        this.inputInclination.value = utils.toDegrees(this.sats[this.currentSat].i);
        this.inputRaan.value = utils.toDegrees(this.sats[this.currentSat].raan);
        this.inputArgPer.value = utils.toDegrees(this.sats[this.currentSat].w);
        this.inputTrueAnomaly.value = utils.toDegrees(this.sats[this.currentSat].v_0);
    }

    setSemiMajor() {
        this.sats[this.currentSat].a = this.inputSemiMajor.value / utils.scale;
        this.sats[this.currentSat].setEllipse();
    }

    setEccentricity() {
        this.sats[this.currentSat].e = this.inputEccentricity.value;
        this.sats[this.currentSat].setEllipse();
    }

    setInclination() {
        this.sats[this.currentSat].i = utils.toRadians(this.inputInclination.value);
        this.sats[this.currentSat].setEllipse();
    }

    setRaan() {
        this.sats[this.currentSat].raan = utils.toRadians(this.inputRaan.value);
        this.sats[this.currentSat].setEllipse();
    }

    setArgPer() {
        this.sats[this.currentSat].w = utils.toRadians(this.inputArgPer.value);
        this.sats[this.currentSat].setEllipse();
    }

    setTrueAnomaly() {
        this.sats[this.currentSat].v_0 = utils.toRadians(this.inputTrueAnomaly.value);
        this.sats[this.currentSat].setEllipse();
    }

    getRotSpeed() {
        return this.rotSpeed;
    }
}

export { UI };