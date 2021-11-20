import CitizenManager from "./CitizenManager";

export default class FoodManager{

    private profit_range    : number;
    private base_profit_min : number;
    private food_profit_rate: number;
    
    seeds_planted_on_land   : number;
    planted_land_profit     : number;

    constructor(){

    }



    // - - - - - - - - - - FOOD INCOME - - - - - - - - - -
    calLandProfitRate(): void{
        this.food_profit_rate = Math.floor((Math.random()* this.profit_range) + this.base_profit_min);
    
    }
    calLandProfit(): void{
        this.calLandProfitRate()
        this.planted_land_profit = this.seeds_planted_on_land * this.food_profit_rate;
    }


}
