import SelectAreaHandler from "./SelectAreaHandler";
import DisplayHandler from "./DisplayHandler";
import InfobarManager from "./InfoBarManager";
import FoodManager from "./GameLogic/FoodManager";
import LandManager from "./GameLogic/LandManager";
import CitizenManager from "./GameLogic/CitizenManager";

import Citizen from "../npc/Citizen";

//import { IInfoBarObj } from "../utils/interfaces";

import { menu_texts, globals, factions } from "../utils/game-text";
import { Factions } from "../utils/enums";

import Button from "../HTML-Handler/Buttons";
import Input from "../HTML-Handler/Input";
import Row from "../HTML-Handler/Row";
import Col from "../HTML-Handler/Col";
import GreenHouse from "./GameLogic/buildings/GreenHouse";
import FinanceManager from "./GameLogic/FinanceManager";

export default class GameManager{

    // Handler
        handler         : iHandler = {
        selectAreaHandler  : null,
        displayHandler     : null,
    };

    // Globals
    player_faction: number = undefined;
    year          : number = 0;
    credits       : number;
    land_amount   : number;
    free_land     : number;
    food_amount   : number;
    citizen       : Citizen[] = [];

    // Manager
    infobar       : InfobarManager;
    foodManager   : FoodManager;
    landManager   : LandManager;
    citizenManager: CitizenManager;
    FinanceManager: FinanceManager;

    greenhouse: GreenHouse;
    

    constructor(){
        this.handler.displayHandler     = new DisplayHandler();
        this.handler.selectAreaHandler  = new SelectAreaHandler();
        this.infobar                    = new InfobarManager();
        this.foodManager                = new FoodManager();
        this.landManager                = new LandManager();
        this.citizenManager             = new CitizenManager();
        this.FinanceManager             = new FinanceManager();

        this.greenhouse                 = new GreenHouse();
        
        this.FinanceManager.calcGreenhouse(this.greenhouse);

        //this.displayChooseFaction();
        this.initGame();
    }

    initGame(){
        /* 
            Hier alle nötigen werte für das Spiel intialisieren.
        */
        this.credits = 90000;
        this.food_amount = 5000;

        this.citizenManager.createCitizen(100,this.citizen);
        console.log(this.citizen);

        this.citizenManager.makeAllOld(this.citizen, Math.floor((Math.random() * 22) +7));
        this.citizenManager.makeAllHappy(this.citizen, Math.floor((Math.random() * 100)));
        this.citizenManager.refreshStats(this.citizen);
        console.log(this.citizen);

        this.citizenManager.checkDeath(this.citizen);
        this.citizenManager.refreshStats(this.citizen);
        console.log(this.citizen);

        this.infobar.draw();
        this.infobar.setActive();
        this.displayChooseFaction();

        this.infobar.update({
            credits : this.credits,
            food    : {
                amount  : this.food_amount, 
                maximum : null},
            land    : {
                amount  : this.land_amount, 
                maximum : this.free_land},
            citizen : {
                amount  : this.citizenManager.population,
                maximum : null},
            year    : this.year,
        })
        //this.updateInfoBarAll();
        
    }

    // - - - - - - - - - - NEW YEAR - - - - - - - - - -
    newYear(): void{
        this.citizenManager.newYearRoutine(this.citizen);
        console.log(this.citizen)
        this.showReport();
        this.year++
        this.infobar.update({
            credits: this.credits,
            food:{amount: this.food_amount, maximum: null},
            land:{amount: this.land_amount, maximum: this.free_land},
            citizen:{amount: this.citizenManager.population,maximum: null},
            year: this.year,
        })

    }

    updateInfoBarAll(){
        this.infobar.setCitizens({amount: this.citizenManager.population, maximum: null});
        this.infobar.setFood({amount: null,maximum: null});
        this.infobar.setLand({amount: null,maximum: null});
        this.infobar.setCredits(this.credits);
        this.infobar.setYear(this.year);


    }

    // - - - - - - - - - - CHOOSE FACTION MENU - - - - - - - - - -
    /**
     * Shows the CHOOSE FACTION MENU
     */
    async displayChooseFaction(): Promise<void>{
        this.clearView();
        await this.handler.displayHandler.displayText(menu_texts.choose_faction.text);
    
        let button_faction1: Button = new Button(globals.factions.faction_1, ['btn', 'btn-primary', 'w-100'],() => this.confirmFaction(globals.factions.faction_1));
        let button_faction2: Button = new Button(globals.factions.faction_2, ['btn', 'btn-primary', 'w-100'],() => this.confirmFaction(globals.factions.faction_2));
        let button_faction3: Button = new Button(globals.factions.faction_3, ['btn', 'btn-primary', 'w-100'],() => this.confirmFaction(globals.factions.faction_3));

        let col_1: Col = new Col([],[button_faction1]);
        let col_2: Col = new Col([],[button_faction2]);
        let col_3: Col = new Col([],[button_faction3]);
    
        let row_1: Row = new Row([],[col_1,col_2,col_3]);
        this.setView([row_1])
    }

    async confirmFaction(faction_name: string): Promise<void>{
        this.clearView();
        switch (faction_name) {
            case globals.factions.faction_1:
                await this.handler.displayHandler.displayText(factions.faction_1.description);
                this.player_faction = Factions.faction_1;
                break;

            case globals.factions.faction_2:
                await this.handler.displayHandler.displayText(factions.faction_2.description);
                this.player_faction = Factions.faction_2;
                break;

            case globals.factions.faction_3:
                await this.handler.displayHandler.displayText(factions.faction_3.description);
                this.player_faction = Factions.faction_3;
                break;
        
            default:
                break;           
        }
        let button_start: Button = new Button('start', ['btn', 'btn-primary', 'w-100'],() => this.mainMenu());
        let button_back: Button = new Button('back', ['btn', 'btn-primary', 'w-100'],() => this.displayChooseFaction());
    
        let col_1: Col = new Col([],[button_start]);
        let col_2: Col = new Col([],[button_back]);

        let row_1: Row = new Row([],[col_1]);
        let row_2: Row = new Row([],[col_2]);

        this.setView([row_1, row_2]);
    }



    // - - - - - - - - - - MAIN MENU - - - - - - - - - -
    /**
     * shows MAIN MENU
     */
    async mainMenu(){
        this.handler.selectAreaHandler.clearView();
        await this.handler.displayHandler.displayText(menu_texts.main_menu.text);

        let button_trade: Button = new Button('trade',['btn', 'btn-primary', 'w-100'], () => this.tradeMenu());
        let button_manage_food: Button = new Button('Manage food',['btn', 'btn-primary', 'w-100'],() => this.manageFoodMenu());
        let button_build: Button = new Button('build',['btn', 'btn-primary', 'w-100'],() => {}, true);
        let button_technology: Button = new Button('technology',['btn', 'btn-primary', 'w-100'],() => {}, true);
        let button_next_round: Button = new Button('next Year', ['btn', 'btn-primary', 'w-100'],() => this.newYear());

       
        let col_1: Col = new Col([],[button_trade]);
        let col_2: Col = new Col([],[button_manage_food]);
        let col_3: Col = new Col([],[button_build]);
        let col_4: Col = new Col([],[button_technology]);
        let col_next_year: Col = new Col([],[button_next_round]);

        let row_1: Row = new Row([], [col_1,col_2,col_3,col_4]);
        let row_next_year: Row = new Row ([],[col_next_year]);

        this.handler.selectAreaHandler.setView([row_1, row_next_year]);
    }

    // - - - - - - - - - - TRADE MENU - - - - - - - - - -
    /**
     * Shows the TRADE MENU
     */
    async tradeMenu(): Promise<void>{
        this.handler.selectAreaHandler.clearView();
        await this.handler.displayHandler.displayText('Trade Menu');

        let button_land: Button = new Button('trade land',['btn', 'btn-primary', 'w-100'],() => this.landTradeMenu());
        let button_food: Button = new Button('trade food',['btn', 'btn-primary', 'w-100'],() => this.foodTradeMenu());
        let button_back: Button = new Button('back',['btn', 'btn-primary', 'w-100'],() => this.mainMenu());

        let col_1: Col = new Col([],[button_land]);
        let col_2: Col = new Col([],[button_food]);
        let col_back: Col = new Col([],[button_back]);

        let row_1: Row = new Row([],[col_1,col_2]);
        let row_back: Row = new Row([],[col_back]);
        this.handler.selectAreaHandler.setView([row_1, row_back]);
    }

    // - - - - - - - - - - LAND TRADE MENU - - - - - - - - - -
    /**
     * Shows the LAND TRADING MENU
     */
     async landTradeMenu(): Promise<void>{

        let input_land: Input = new Input(['w-100'],'land-trade-amount');

        let button_buy: Button = new Button('buy land',['btn', 'btn-primary', 'w-100'],async () => this.buyLand(input_land.element));
        let button_sell: Button = new Button('sell land',['btn', 'btn-primary', 'w-100'],() => {});
        let button_back: Button = new Button('back',['btn', 'btn-primary', 'w-100'],() => this.tradeMenu());

        let col_1: Col = new Col([],[input_land]);
        let col_2: Col = new Col([],[button_buy]);
        let col_3: Col = new Col([],[button_sell]);
        let col_back: Col = new Col([],[button_back]);

        let row_1: Row = new Row([],[col_1]);
        let row_2: Row = new Row([],[col_2,col_3]);
        let row_back: Row = new Row([],[col_back]);
        this.handler.selectAreaHandler.setView([row_1,row_2, row_back]);
    }

    async buyLand(input: HTMLInputElement){
        let result = this.landManager.buyLand(parseInt(input.value), this.credits);
        if(result.error){
            await this.handler.displayHandler.displayText(`I'm sorry commander, but you don't have enough credits to buy that.`);

        } else {
            this.land_amount += result.amount;
            this.credits -= result.cost;

            this.infobar.update({
                credits : this.credits,
                land    : {
                    amount  : this.land_amount,
                    maximum : this.land_amount
                }
            })

            this.mainMenu();
        }
    }

    // - - - - - - - - - - FOOD TRADE MENU - - - - - - - - - -
    /**
     * Shows the FOOD TRADE MENU
     */
     async foodTradeMenu(): Promise<void>{
        let input_food: Input = new Input(['w-100'],'food-trade-amount');

        let button_buy: Button = new Button('buy land',['btn', 'btn-primary', 'w-100'],() => {});
        let button_sell: Button = new Button('sell land',['btn', 'btn-primary', 'w-100'],() => {});
        let button_back: Button = new Button('back',['btn', 'btn-primary', 'w-100'],() => this.tradeMenu());

        let col_1: Col = new Col([],[input_food]);
        let col_2: Col = new Col([],[button_buy]);
        let col_3: Col = new Col([],[button_sell])
        let col_back: Col = new Col([],[button_back]);

        let row_1: Row = new Row([],[col_1]);
        let row_2: Row = new Row([],[col_2,col_3]);
        let row_back: Row = new Row([],[col_back]);
        this.handler.selectAreaHandler.setView([row_1,row_2, row_back]);
    }

    // - - - - - - - - - - MANAGE FOOD MENU - - - - - - - - - -
    /**
     * Shows the MANAGE FOOD MENU
     */
     async manageFoodMenu(): Promise<void>{
        this.handler.selectAreaHandler.clearView();
        await this.handler.displayHandler.displayText('Manage food Menu');

        let button_plant: Button = new Button('plant Seeds',['btn', 'btn-primary', 'w-100'],() => this.plantSeedsMenu());
        let button_distribute: Button = new Button('Distribute food',['btn', 'btn-primary', 'w-100'],() => this.distributeFoodMenu());
        let button_back: Button = new Button('back',['btn', 'btn-primary', 'w-100'],() => this.mainMenu());

        let col_1: Col = new Col([],[button_plant]);
        let col_2: Col = new Col([],[button_distribute]);
        let col_back: Col = new Col([],[button_back]);

        let row_1: Row = new Row([],[col_1,col_2]);
        let row_back: Row = new Row([],[col_back]);
        this.handler.selectAreaHandler.setView([row_1, row_back]);
    }

    // - - - - - - - - - - PLANT SEEDS MENU - - - - - - - - - -
    /**
     * Shows the PLANT SEEDS MENU
     */
    plantSeedsMenu(): void {
        let input_food: Input = new Input(['w-100'],'plant-seed-amount');

        let button_field_add: Button = new Button('add planned seeding',['btn', 'btn-primary', 'w-100'],() => {});
        let button_field_reduce: Button = new Button('reduce planned seeding',['btn', 'btn-primary', 'w-100'],() => {});
        let button_back: Button = new Button('back',['btn', 'btn-primary', 'w-100'],() => this.manageFoodMenu());

        let col_1: Col = new Col([],[input_food]);
        let col_2: Col = new Col([],[button_field_add]);
        let col_3: Col = new Col([],[button_field_reduce]);
        let col_back: Col = new Col([],[button_back]);

        let row_1: Row = new Row([],[col_1]);
        let row_2: Row = new Row([],[col_2,col_3]);
        let row_back: Row = new Row([],[col_back]);
        this.handler.selectAreaHandler.setView([row_1,row_2, row_back]);
    }

    // - - - - - - - - - - DISTRIBUTE FOOD MENU - - - - - - - - - -
    /**
     * Shows the DISTRIBUTE FOOD MENU
     */
    async distributeFoodMenu(): Promise<void>{
        await this.handler.displayHandler.displayText('You have '+ this.foodManager.distributed_food+' Food planed for this Year');

        let input_food: Input = new Input(['w-100'],'distribute-food-amount');

        let button_distribute_add: Button = new Button('add food planned for distribute',['btn', 'btn-primary', 'w-100'],async () => this.distributFood(input_food.element));
        //let button_distribute_reduce: Button = new Button('reduce food planned for distribute',['btn', 'btn-primary', 'w-100'],async() => this.distributFood(input_food.element));
        let button_back: Button = new Button('back',['btn', 'btn-primary', 'w-100'],() => this.manageFoodMenu());

        let col_1: Col = new Col([],[input_food]);
        let col_2: Col = new Col([],[button_distribute_add]);
        //let col_3: Col = new Col([],[button_distribute_reduce]);
        let col_back: Col = new Col([],[button_back]);

        let row_1: Row = new Row([],[col_1]);
        let row_2: Row = new Row([],[col_2,/*col_3*/]);
        let row_back: Row = new Row([],[col_back]);
        this.handler.selectAreaHandler.setView([row_1,row_2, row_back]);
    }

    async distributFood(input: HTMLInputElement){
        let result = this.foodManager.setDistributedFood(parseInt(input.value), this.food_amount); // TODO Deniz fragen was er bei buyLand() gemacht hat
        if(result.error){
            await this.handler.displayHandler.displayText(`I'm sorry commander, but you don't have enough Food to distribiute.`);
        } else {
            this.food_amount -= result.amount;

            this.infobar.update({
                food:{
                    amount: this.food_amount,
                    maximum: null} //TODO change maximum later

            })

            this.distributeFoodMenu();
        }
    }

    // - - - - - - - - - - REPORT MENU - - - - - - - - - -
    async showReport(): Promise<void>{
        this.handler.selectAreaHandler.clearView();
        await this.handler.displayHandler.displayText('This is the Report for Year ' + (this.year)+'<br>'+(this.citizenManager.citizen_dead_this_year)+' died last year');

        let button_land: Button = new Button('Understood',['btn', 'btn-primary', 'w-100'],() => this.mainMenu());
        let button_food: Button = new Button('Help me',['btn', 'btn-primary', 'w-100'],() => this.mainMenu());

        let col_1: Col = new Col([],[button_land]);
        let col_2: Col = new Col([],[button_food]);

        let row_1: Row = new Row([],[col_1]);
        let row_2: Row = new Row([],[col_2]);
        this.handler.selectAreaHandler.setView([row_1,row_2]);
    }

    // - - - - - - - - - - GAME OVER MENU - - - - - - - - - -
    async showGameOver(): Promise<void>{
        this.handler.selectAreaHandler.clearView();
        await this.handler.displayHandler.displayText('#');

    }

    // - - - - - - - - - - HIGHSCORE MENU - - - - - - - - - -
    async showHighScore(): Promise<void>{
        this.handler.selectAreaHandler.clearView();
        await this.handler.displayHandler.displayText('#');
    }

    clearView(){
        this.handler.selectAreaHandler.setInactive();        
    }

    setView(rows: Row[]){
        this.handler.selectAreaHandler.setView(rows);
        this.handler.selectAreaHandler.setActive();
    }
}

interface iHandler{
    selectAreaHandler  : SelectAreaHandler,
    displayHandler     : DisplayHandler
}