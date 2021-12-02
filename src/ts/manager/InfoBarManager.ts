import { IResource, IInfoBarObj } from "../utils/interfaces";

import Col from "../HTML-Handler/Col";
import Row from "../HTML-Handler/Row";

export default class InfobarManager{

    element     : HTMLDivElement    = null;
    citizens    : IResource         = {amount: null, maximum: null};
    food        : IResource         = {amount: null, maximum: null};
    land        : IResource         = {amount: null, maximum: null};
    credits     : number            = null;
    year        : number            = null;

    constructor(){
        this.element = <HTMLDivElement>document.getElementById('status-bar');
        this.setInactive();
    };

    setCitizens(citizens: IResource){
        this.citizens = citizens;
        this.draw();
    }

    setFood(food: IResource){
        this.food = food;
        this.draw();
    }

    setLand(land: IResource){
        this.land = land;
        this.draw();
    }

    setCredits(credits: number){
        this.credits = credits;
        this.draw();
    }


    setYear(year: number){
        this.year = year;
        this.draw();
    }

    update(object: IInfoBarObj){
        this.credits    = object.credits    || this.credits;
        this.food       = object.food       || this.food;
        this.land       = object.land       || this.land;
        this.citizens   = object.citizen    || this.citizens;
        this.year       = object.year       || this.year;
        this.draw();
    }

    draw(){
        this.setActive();
        this.element.innerHTML = "";

        let creditDisplay = new Col();
        creditDisplay.element.innerHTML = `<div><img src="./src/img/icons/ed_icon_B.png" class="icon me-4" alt="picture">€/\$ ${this.credits}</div>`;

        let foodDisplay = new Col();
        foodDisplay.element.innerHTML = `<div><img src="./src/img/icons/food_icon.png" class="icon me-4" alt="picture">FOOD ${this.food.amount}/${this.food.maximum}</div>`;

        let landDisplay = new Col();
        landDisplay.element.innerHTML = `<div><img src="./src/img/icons/land_icon.png" class="icon me-4" alt="picture">LAND ${this.land.amount}/${this.land.maximum}</div>`

        let citizenDisplay = new Col();
        citizenDisplay.element.innerHTML = `<div><img src="./src/img/icons/citizens_icon.png" class="icon me-4" alt="picture">CITIZEN ${this.citizens.amount}/${this.citizens.maximum}</div>`;

        let yearDisplay = new Col();
        yearDisplay.element.innerHTML = `<div><div><img src="./src/img/icons/year_icon.png" class="icon me-4" alt="picture">YEAR ${this.year}</div>`;

        let displayRow = new Row(['g-0'], [creditDisplay, foodDisplay, landDisplay, citizenDisplay, yearDisplay]);
        this.element.append(displayRow.element);
    }

    setInactive(){
        this.element.classList.add('inactive-top');
    }

    setActive(){
        this.element.classList.remove('inactive-top');
    }

}

