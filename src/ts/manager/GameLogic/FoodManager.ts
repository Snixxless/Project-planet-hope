import GameManager from "../GameManager";
import CitizenManager from "./CitizenManager";

export default class FoodManager{

    private profit_range    : number;
    private base_profit_min : number;
    private food_profit_rate: number;
    
    seeds_planted_on_land   : number;
    planted_land_profit     : number;

    distributed_food :number = 0;

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

    setDistributedFood(amount: number, food: number): any{
        if(food !== undefined || food !== null){
            if(food > amount){
                food -= amount;
                return {
                    amount  : this.getDistributedFood(amount),
                    cost    : food,
                    error   : false
                };
            }
        }
        return {
            amount  : 0,
            cost    : 0,
            error   : true
        };

    }

    getDistributedFood(amount: number): number{
        this.distributed_food += amount;
        return amount;
    }

}
