import Citizen from "../../npc/Citizen";
export default class FoodManager{

    private profit_range                : number = 5;
    private base_profit_min             : number = 1;
    private food_profit_rate            : number;
    
    seeds_planted_on_land               : number = 0;
    planted_land_profit                 : number = 0;

    seeds_planted_greenhouse            : number = 0;
    planted_greenhouse_profit           : number = 0; // 0 for now

    food_profit_this_year               : number = 0;

    distributed_food                    : number = 0;

    constructor(){

    }

    newYearRoutine(citizens: Citizen[]){

    }


    // - - - - - - - - - - Plant Seeds - - - - - - - - - -
    getSeedsOnLand(amount: number): number{
        this.seeds_planted_on_land += amount;
        return amount;
    }
    setSeedsOnLand(amount: number, food: number): any{
        if(food !== undefined || food !== null){
            if(food > amount){
                food -= amount;
                return {
                    amount  : this.getSeedsOnLand(amount),
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

    // - - - - - - - - - - FOOD INCOME - - - - - - - - - -
    diceLandProfitRate(): void{
        this.food_profit_rate = 0;
        this.food_profit_rate = Math.floor((Math.random()* this.profit_range) + this.base_profit_min);
    
    }
    calLandProfit(): void{
        this.diceLandProfitRate();
        this.planted_land_profit = 0;
        this.planted_land_profit = this.seeds_planted_on_land * this.food_profit_rate;
    }
    harvestProfit(): number{
        this.calLandProfit();
        let profit = this.planted_land_profit + this.planted_greenhouse_profit;
        this.food_profit_this_year = profit;
        console.table({
            food_profit_rate: this.food_profit_rate,
            planted_land_profit: this.planted_land_profit,
            planted_greenhouse_profit: this.planted_greenhouse_profit,
            profit: profit
        })
        this.seeds_planted_on_land = 0;
        return profit;
    }

    // - - - - - - - - - - FOOD OUT / DISTRIBUTE - - - - - - - - - -
    getDistributedFood(amount: number): number{
        this.distributed_food += amount;
        return amount;
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
    resetDistributedFood(){
        this.distributed_food = 0;
    }





}
