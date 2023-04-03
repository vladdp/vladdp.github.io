import * as utils from 'utils';
import { Satellite } from 'sat';

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
    period = document.createElement('div');

    inputSemiMajor = document.createElement('input')
    inputEccentricity = document.createElement('input')
    inputInclination = document.createElement('input')
    inputRaan = document.createElement('input')
    inputArgPer = document.createElement('input')
    inputPeriod = document.createElement('input')

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

        this.semiMajor.innerText = "Semi-major axis";
        this.semiMajor.id = "semiMajor";
        document.body.appendChild(this.semiMajor);

        this.eccentricity.innerText = "Eccentricity";
        this.eccentricity.id = "eccentricity";
        document.body.appendChild(this.eccentricity);

        this.inclination.innerText = "Inclination";
        this.inclination.id = "inclination";
        document.body.appendChild(this.inclination);

        this.raan.innerText = "RAAN";
        this.raan.id = "raan";
        document.body.appendChild(this.raan);

        this.argPer.innerText = "Arg of Perigee";
        this.argPer.id = "argPer";
        document.body.appendChild(this.argPer);

        this.period.innerText = "Period";
        this.period.id = "period";
        document.body.appendChild(this.period);

        this.inputSemiMajor.setAttribute("type", "number");
        this.inputSemiMajor.id = "inputSemiMajor";
        this.inputSemiMajor.addEventListener( "change", () => this.setSemiMajor() );
        document.body.appendChild(this.inputSemiMajor);

        this.inputEccentricity.setAttribute("type", "number");
        this.inputEccentricity.id = "inputEccentricity";
        this.inputEccentricity.addEventListener( "change", () => this.setEccentricity() );
        document.body.appendChild(this.inputEccentricity);

        this.inputInclination.setAttribute("type", "number");
        this.inputInclination.id = "inputInclination";
        this.inputInclination.addEventListener( "change", () => this.setInclination() );
        document.body.appendChild(this.inputInclination);

        this.inputRaan.setAttribute("type", "number");
        this.inputRaan.id = "inputRaan";
        this.inputRaan.addEventListener( "change", () => this.setRaan() );
        document.body.appendChild(this.inputRaan);

        this.inputArgPer.setAttribute("type", "number");
        this.inputArgPer.id = "inputArgPer";
        this.inputArgPer.addEventListener( "change", () => this.setArgPer() );
        document.body.appendChild(this.inputArgPer);

        this.inputPeriod.setAttribute("type", "number");
        this.inputPeriod.id = "inputPeriod";
        this.inputPeriod.addEventListener( "change", () => this.setPeriod() );
        document.body.appendChild(this.inputPeriod);
    }
    
    addSat() {
        let name = "Sat #" + (this.sats.length+1).toString();
        this.sats.push( new Satellite(name) );
        this.satList.add(this.sats[this.sats.length-1].option);

        this.currentSat = this.satList.length - 1;
        this.satList.selectedIndex = this.currentSat;
        
        this.update();
    }

    changeSat() {
        this.currentSat = this.satList.selectedIndex;

        this.update();
    }

    update() {
        this.inputSemiMajor.value = this.sats[this.currentSat].a;
        this.inputEccentricity.value = this.sats[this.currentSat].e;
        this.inputInclination.value = this.sats[this.currentSat].i;
        this.inputRaan.value = this.sats[this.currentSat].raan;
        this.inputArgPer.value = this.sats[this.currentSat].w;
        this.inputPeriod.value = this.sats[this.currentSat].T;
    }

    setSemiMajor() {
        this.sats[this.currentSat].a = this.inputSemiMajor.value;
    }

    setEccentricity() {
        this.sats[this.currentSat].e = this.inputEccentricity.value;
    }

    setInclination() {
        this.sats[this.currentSat].i = this.inputInclination.value;
    }

    setRaan() {
        this.sats[this.currentSat].raan = this.inputRaan.value;
    }

    setArgPer() {
        this.sats[this.currentSat].w = this.inputArgPer.value;
    }

    setPeriod() {
        this.sats[this.currentSat].T = this.inputPeriod.value;
    }

    getRotSpeed() {
        return this.rotSpeed;
    }
}

export { UI };