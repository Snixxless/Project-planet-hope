import { ILandTransaction } from "../../utils/interfaces";
import { errors } from "../../utils/game-text";
import { buyLandErrors } from "../../utils/enums";

export default class LandManager {
    price_per_land: number = 25;
    landtrade_done: boolean = false;

    private price_range: number = 40;
    private min_price: number = 10;

    constructor() {
        this.randomLandprice();
    }

    newYearRoutine() {
        this.randomLandprice();
        this.landtrade_done = false;
    }

    buyLand(
        amount: number,
        credits: number,
        free_land: number,
        land_avaible: number
    ): any {
        let neededCredits = amount * this.price_per_land;
        let error_message: buyLandErrors;

        if (this.landtrade_done == false) {
            if (amount !== undefined || amount !== null) {
                if (amount + free_land > 0) {
                    if (amount + free_land < land_avaible) {
                        if (credits > neededCredits) {
                            this.landtrade_done = true;
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
        } else {
            error_message = buyLandErrors.no_trade;
        }

        return {
            amount: 0,
            cost: 0,
            error: true,
            error_message: this.buyLandErrorHandler(error_message),
        };
    }

    buyLandErrorHandler(error_message: buyLandErrors): string {
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
            case buyLandErrors.no_trade:
                return errors.land_manager.buy_land.no_trade;
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
    }

    // Set Var Function

    // Get Functions

    getLandPrice(): number {
        return this.price_per_land;
    }
}
