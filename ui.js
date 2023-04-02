import * as utils from 'utils';
import { Satellite } from 'sat';

class UI {
    title = document.createElement('div');
    addSatButt = document.createElement('button');
    satList = document.createElement('select');
    orbitalParams = document.createElement('div');

    currentSat;

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
        this.satList.innerText = 'Select Satellite';
        this.satList.addEventListener( "change", () => this.changeSat() );
        document.body.appendChild(this.satList);

        this.orbitalParams.innerText = "Orbital Parameters";
        this.orbitalParams.id = "orbParams";
        document.body.appendChild(this.orbitalParams);
    }
    
    addSat(name="") {
        this.sats.push( new Satellite(name) );
        this.satList.add(this.sats[this.sats.length-1].option);
        
        console.log(this.sats[this.sats.length-1].name)
        console.log(this.sats.length);
    }

    changeSat() {
        this.currentSat = this.satList.selectedIndex;
        console.log("Satellite changed to:", this.currentSat);
    }

    getRotSpeed() {
        return this.rotSpeed;
    }
}

export { UI };