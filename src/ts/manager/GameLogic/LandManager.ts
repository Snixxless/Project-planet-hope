import { ILandTransaction } from "../../utils/interfaces";

export default class LandManager{

    avaible_land                    : number;
    price_per_land                  : number;

    private base_avaible_land       : number = 950;
    private base_avaible_land_range : number = 50;

    private price_range             : number = 10;
    private min_price               : number = 50;

    constructor(){
        this.initValues();
    }

    initValues(): void{
        this.avaible_land = Math.floor(this.base_avaible_land + ((Math.random() * (this.base_avaible_land_range * 2)) - this.base_avaible_land_range))
        this.price_per_land = this.getLandPrice();
    }

    getLandPrice(): number{
        return Math.floor((Math.random() * this.price_range) + this.min_price)
    }

    buyLand(amount: number, credits: number): ILandTransaction{
        if(credits !== undefined || credits !== null){
            let neededCredits = amount * this.price_per_land;
            if(credits > neededCredits){
                credits -= neededCredits;
                return {
                    amount  : this.getLand(amount),
                    cost    : neededCredits,
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

    getLand(amount: number): number{
        this.avaible_land -= amount;
        return amount;
    }

    addNewLand(amount: number): void {
        this.avaible_land += amount;
    }

    addRandomLand(min: number, max: number): void{
        this.avaible_land += Math.floor((Math.random() * max) + min)
    }

}

