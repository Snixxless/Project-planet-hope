import { ILandTransaction } from "../../utils/interfaces";
import { errors } from "../../utils/game-text";
import { buyLandErrors } from "../../utils/enums";

export default class LandManager {
    avaible_land: number = 2000; // TODO Outsource this var to Gamemanager
    price_per_land: number = 25;

    private price_range: number = 40;
    private min_price: number = 10;

    constructor() {
        this.randomLandprice();
    }

    newYearRoutine() {
        this.randomLandprice();
    }

    buyLand(
        amount: number, 
        credits: number, 
        free_land: number
        ): any {
        let neededCredits = amount * this.price_per_land;
        let error_message: buyLandErrors;

        if (amount !== undefined || amount !== null) {
            if (amount + free_land > 0){
                if (amount + free_land <  this.avaible_land){
                    if(credits > neededCredits){
                        this.avaible_land -= amount;
                        return {
                            amount: amount,
                            cost: neededCredits,
                            error: false,
                        };
                    } else {
                        error_message = buyLandErrors.no_credits;
                    }   
                } else {
                    error_message = buyLandErrors.no_land;
                }
            } else {
                error_message = buyLandErrors.negative;
            }
        }
        return {
            amount: 0,
            cost: 0,
            error: true,
            error_message: this.buyLandErrorHandler(error_message),
        };
    }

    buyLandErrorHandler(error_message: buyLandErrors): string{
        switch (error_message) {
            case buyLandErrors.no_land:
              return errors.land_manager.buy_land.no_land;
              break;
            case buyLandErrors.no_credits:
              return errors.land_manager.buy_land.no_credits;
              break;
            case buyLandErrors.negative:
                return errors.land_manager.buy_land.negative;
                break;
            default:
              console.error("Fehlerhafte Message Range");
              return "";
              break;
          }
    }

    // randoms
    randomLandprice() {
        this.price_per_land = 0;
        this.price_per_land = Math.floor(
            Math.random() * this.price_range + this.min_price
        );
        console.table({landPrice: this.price_per_land})
    }

    // Set Var Function
    setAvaibleLand(amount: number): void {
        // TODO Set Parameters for this or its going brrrrrrrrrt
        this.avaible_land += amount;
    }

    // Get Functions

    getLandPrice(): number {
        return this.price_per_land;
    }
}
