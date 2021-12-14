import SelectAreaHandler from "./SelectAreaHandler";
import DisplayHandler from "./DisplayHandler";
import InfobarManager from "./InfoBarManager";
import FoodManager from "./GameLogic/FoodManager";
import LandManager from "./GameLogic/LandManager";
import CitizenManager from "./GameLogic/CitizenManager";
import BuildingManager from "./GameLogic/BuildingManager";

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
import VersionDisplay from "../HTML-Handler/VersionDisplay";

export default class GameManager{

    // Handler
        handler         : iHandler = {
        selectAreaHandler  : null,
        displayHandler     : null,
    };

    // Globals
    player_faction: Factions = undefined;
    year          : number = 0;
    credits       : number = 0;
    land_free     : number = 0;
    land_occupied : number = 0;
    land_amount   : number = 0;
    food_amount   : number = 0;
    food_storage  : number = 0;
    citizen       : Citizen[] = [];
    appartments   : number = 0;

    // Manager
    infobar       : InfobarManager;
    foodManager   : FoodManager;
    landManager   : LandManager;
    citizenManager: CitizenManager;
    FinanceManager: FinanceManager;
    BuildingManager: BuildingManager;

    greenhouse: GreenHouse;

    versionDisplay  : VersionDisplay;
    

    constructor(){
        this.handler.displayHandler     = new DisplayHandler();
        this.handler.selectAreaHandler  = new SelectAreaHandler();
        this.infobar                    = new InfobarManager();
        this.foodManager                = new FoodManager();
        this.landManager                = new LandManager();
        this.citizenManager             = new CitizenManager();
        this.FinanceManager             = new FinanceManager();
        this.BuildingManager            = new BuildingManager()

        this.greenhouse                 = new GreenHouse();
        
        this.FinanceManager.calcGreenhouse(this.greenhouse);

        this.versionDisplay             = new VersionDisplay("0.1.3")

        //this.displayChooseFaction();
        this.displayChooseFaction();
    }

    /* 
    Hier alle nötigen werte für das Spiel intialisieren.
    */
    async initGame(player_faction: Factions){
        this.year = 1;
        this.infobar.setFaction(this.player_faction);
        switch (player_faction) {
            //EU
            case 0:
                this.credits = 2500;
                this.food_amount = 5000;
                this.land_free = 450;

                this.citizenManager.createCitizen(50,this.citizen);
                this.citizenManager.makeAllOldRandom(this.citizen, 18, 30); //TODO for testing
                this.citizenManager.makeAllHappy(this.citizen, Math.floor((Math.random() * 80) +20)); //TODO for testing
                break;
            //ATC
            case 1:
                this.credits = 3500;
                this.food_amount = 5000;
                this.land_free = 450;

                this.citizenManager.createCitizen(50,this.citizen);
                this.citizenManager.makeAllOldRandom(this.citizen, 18, 65); //TODO for testing
                this.citizenManager.makeAllHappy(this.citizen, Math.floor((Math.random() * 80) +20)); //TODO for testing
                break;
            //RL
            case 2:
                this.credits = 2000;
                this.food_amount = 5000;
                this.land_free = 450;

                this.citizenManager.createCitizen(100,this.citizen);
                this.citizenManager.makeAllOldRandom(this.citizen, 18, 40); //TODO for testing
                this.citizenManager.makeAllHappy(this.citizen, Math.floor((Math.random() * 80) +20)); //TODO for testing
                break;
            default:
                break;
        }
        //.this.citizenManager.refreshStats(this.citizen);
        //console.log(this.citizen);

        this.citizenManager.checkDeath(this.citizen); // check if some citizens died during the journey 
        this.citizenManager.refreshStats(this.citizen);

        this.infobar.draw();
        this.infobar.setActive();
        this.mainMenu();
        this.updateInfoBarAll();
        console.log(this.citizen);

        
    }

    resetGameData(): void{
        this.year = 0;
        this.credits = 0;
        this.food_amount = 0;
        this.land_free= 0;
        this.citizen = [];
    }

    // - - - - - - - - - - NEW YEAR - - - - - - - - - -
    newYear(): void{
        console.log(this.citizen)
        this.citizenManager.newYearRoutine(this.citizen,this.foodManager.distributed_food);
        this.citizenManager.bornNewCitizen(this.citizen);
        this.landManager.newYearRoutine();
        this.food_amount += this.foodManager.harvestProfit();
        this.land_free += this.foodManager.getCultivatedLand(); 

        if(this.checkGameOver()){
            this.showGameOver();
            return
        } else {
            this.showReport();
            this.year++
            this.updateInfoBarAll();
            
        }


    }

    checkGameOver(): boolean{
        if(this.citizen.length < 1 || this.credits < -500){
            return(true);
        } else return false;
    }

    updateInfoBarAll(): void{
        this.getFoodStorage();
        this.getAppartments();
        this.calLandAmount();
        this.infobar.update({
            credits: this.credits,
            food:{amount: this.food_amount, maximum: this.food_storage},
            land:{amount: this.land_free, maximum: this.land_amount},
            citizen:{amount: this.citizenManager.population,maximum: this.appartments},
            year: this.year,
        })
    }
    getFoodStorage(): void{
        this.food_storage = this.BuildingManager.getFoodStorage();
    }
    getAppartments(){
        this.appartments = this.BuildingManager.getAppartments();
    }
    getOccupiedLand(): void{
        this.land_occupied = this.BuildingManager.getLandOccupied();
    }
    calLandAmount(): void{
        this.getOccupiedLand();
        this.land_amount = this.land_free + this.land_occupied;
    }

    // - - - - - - - - - - CHOOSE FACTION MENU - - - - - - - - - -
    /**
     * Shows the CHOOSE FACTION MENU
     */
    async displayChooseFaction(): Promise<void>{
        this.resetGameData();
        this.clearView();
        await this.handler.displayHandler.displayText(menu_texts.choose_faction.text);
    
        let button_faction1: Button = new Button(globals.factions.faction_1, ['btn', 'btn-primary', 'w-100'],() => this.confirmFaction(globals.factions.faction_1));
        let button_faction2: Button = new Button(globals.factions.faction_2, ['btn', 'btn-primary', 'w-100'],() => this.confirmFaction(globals.factions.faction_2));
        let button_faction3: Button = new Button(globals.factions.faction_3, ['btn', 'btn-primary', 'w-100'],() => this.confirmFaction(globals.factions.faction_3));

        let col_1: Col = new Col([],[button_faction1]);
        let col_2: Col = new Col([],[button_faction2]);
        let col_3: Col = new Col([],[button_faction3]);
    
        let row_1: Row = new Row([],[col_1,col_2,col_3]);
        this.setView([row_1]);
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

        let button_start: Button = new Button('start', ['btn', 'btn-primary', 'w-100'], () => this.initGame(this.player_faction));
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
        
        this.citizenManager.calSumHunger(this.citizen);
        await this.handler.displayHandler.displayText(`${globals.greeting[this.player_faction]}${menu_texts.main_menu.text}`);

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
        await this.handler.displayHandler.displayText('The Price for 1 claim of Land cost '+this.landManager.price_per_land+` credits \n for now the bank have ${this.landManager.avaible_land} claims to Sell`);
        let input_land: Input = new Input(['w-100'],'land-trade-amount');

        let button_buy: Button = new Button('buy land',['btn', 'btn-primary', 'w-100'],async () => this.buyLand(input_land.element));
        let button_back: Button = new Button('back',['btn', 'btn-primary', 'w-100'],() => this.tradeMenu());

        let col_1: Col = new Col([],[input_land]);
        let col_2: Col = new Col([],[button_buy]);
        let col_back: Col = new Col([],[button_back]);

        let row_1: Row = new Row([],[col_1]);
        let row_2: Row = new Row([],[col_2]);
        let row_back: Row = new Row([],[col_back]);
        this.handler.selectAreaHandler.setView([row_1,row_2, row_back]);
    }

    async buyLand(input: HTMLInputElement){
        let result = this.landManager.buyLand(parseInt(input.value), this.credits,this.land_free);
        if(result.error){
            await this.handler.displayHandler.displayText(`I'm sorry commander, but ${result.error_message}`);

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

            this.landTradeMenu();
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
    async plantSeedsMenu(): Promise<void> {
        await this.handler.displayHandler.displayText(`To cultivate one Field you need ${this.foodManager.needed_citizens_for_land} Citizen and ${this.foodManager.need_seeds_for_land} food \n \nYou have `+ this.foodManager.cultivated_land +` seeds planed for this Year`);

        let input_seeds: Input = new Input(['w-100'],'plant-seed-amount');

        let button_field_add: Button = new Button('add planned seeding',['btn', 'btn-primary', 'w-100'],() => this.plantSeedsLand(input_seeds.element));
        let button_back: Button = new Button('back',['btn', 'btn-primary', 'w-100'],() => this.manageFoodMenu());

        let col_1: Col = new Col([],[input_seeds]);
        let col_2: Col = new Col([],[button_field_add]);
        let col_back: Col = new Col([],[button_back]);

        let row_1: Row = new Row([],[col_1]);
        let row_2: Row = new Row([],[col_2]);
        let row_back: Row = new Row([],[col_back]);
        this.handler.selectAreaHandler.setView([row_1,row_2, row_back]);
    }

    // Setshow many Fields you want to cultivated
    async plantSeedsLand(input: HTMLInputElement){
        let result = this.foodManager.setCultivatedLand(parseInt(input.value), this.land_free, this.food_amount, this.citizen);
        if(result.error){
            await this.handler.displayHandler.displayText(`I'm sorry commander, but ${result.error_message}`);
        } else {
            this.food_amount -= result.cost;
            this.land_free -=  result.amount;

            this.infobar.update({
                food:{
                    amount: this.food_amount,
                    maximum: null} //TODO change maximum later

            })

            this.plantSeedsMenu();
        }
    }

    // - - - - - - - - - - DISTRIBUTE FOOD MENU - - - - - - - - - -
    /**
     * Shows the DISTRIBUTE FOOD MENU
     */
    async distributeFoodMenu(): Promise<void>{
        console.table({sum_hunger: this.citizenManager.getCitizenHungerSum(this.citizen)});
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
        let result = this.foodManager.setDistributedFood(parseInt(input.value), this.food_amount);
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
        await this.handler.displayHandler.displayText('This is the Report for Year ' + (this.year)+'\n'+(this.citizenManager.citizen_dead_this_year)+' died last year, and ' + (this.citizenManager.citizen_new_this_year) + ' citizens have been born' + '\n' + ' you made ' + (this.foodManager.food_profit_this_year) + ' Food');

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
        await this.handler.displayHandler.displayText('Seems your Colony is lost Commander, it have been ' + (this.year)+' wonderfull years with you as our leader');

        let button_highscore: Button = new Button('View Highscore',['btn', 'btn-primary', 'w-100'],() => this.showHighScore());
        let button_newGame: Button = new Button('New Game',['btn', 'btn-primary', 'w-100'],() => this.displayChooseFaction());

        let col_1: Col = new Col([],[button_highscore]);
        let col_2: Col = new Col([],[button_newGame]);

        let row_1: Row = new Row([],[col_1]);
        let row_2: Row = new Row([],[col_2]);
        this.handler.selectAreaHandler.setView([row_1,row_2]);
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