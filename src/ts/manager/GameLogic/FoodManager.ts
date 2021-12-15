import Citizen from "../../npc/Citizen";
import { DistributeFoodError, seedsOnLandErrors } from "../../utils/enums";
import { errors } from "../../utils/game-text";
export default class FoodManager {
  private profit_range: number = 50;
  private base_profit_min: number = 25;
  private food_profit_rate: number;

  cultivated_land: number = 0;
  cultivated_land_profit: number = 0;
  needed_citizens_for_land: number = 1;
  need_seeds_for_land: number = 3;

  cultivated_greenhouse: number = 0;
  cultivated_greenhouse_profit: number = 0; // 2-4 later 2-5
  needed_citizens_for_greenhouse: number = 3;
  need_seeds_for_greenhouse: number = 1;

  food_profit_this_year: number = 0;

  distributed_food: number = 0;

  constructor() { 
    this.randomLandProfitRate();
  }
  
  newYearRoutine():number {
    let profit: number = 0;
    profit += this.harvestProfit();
    this.randomLandProfitRate();
    this.distributed_food = 0;
    return profit;
   }
  
  // - - - - - - - - - -    Plant Seeds - - - - - - - - - -
  /**
   * 
   * @param amount the input value
   * @param land_free how much free land the player have
   * @param food how much food the play have
   * @param citizens array of citizens
   * @returns give a amount and cost back OR a error message
   */
  setCultivatedLand(
    amount: number,
    land_free: number,
    food: number,
    citizens: Citizen[]
  ): any {
    let citizens_amount = citizens.length;
    let error_message: seedsOnLandErrors;

    if (amount !== undefined || amount !== null) {
      if (this.cultivated_land + amount > 0) {
        if (land_free + this.cultivated_land >= amount) {
          let neededFood = amount * this.need_seeds_for_land;
          if (food * this.need_seeds_for_land >= neededFood) {
            if ((citizens_amount - this.cultivated_land * this.needed_citizens_for_land) * this.needed_citizens_for_land >= amount * this.needed_citizens_for_land) {
              food -= amount;
              this.cultivated_land += amount;
              return {
                amount: amount,
                cost: neededFood,
                error: false,
              };
            } else {
              error_message = seedsOnLandErrors.no_citizen;
            }
          } else {
            error_message = seedsOnLandErrors.no_food;
          }
        } else {
          error_message = seedsOnLandErrors.no_land;
        }
      } else {
        error_message = seedsOnLandErrors.negative;
      }
    }
    return {
      amount: 0,
      cost: 0,
      error: true,
      error_message: this.seedsOnLandErrorHandler(error_message),
    };
  }

  /**
   * changes the error message based on the input
   * is connected to the "setCultivatedLand" function
   * @param error_message value of what error message should return
   * @returns gives the error message back
   */
  seedsOnLandErrorHandler(error_message: seedsOnLandErrors): string {
    switch (error_message) {
      case seedsOnLandErrors.no_food:
        return errors.food_manager.seeds_on_land.no_food;
        break;
      case seedsOnLandErrors.no_citizen:
        return errors.food_manager.seeds_on_land.no_citizen;
        break;
      case seedsOnLandErrors.no_land:
        return errors.food_manager.seeds_on_land.no_land;
        break;
      case seedsOnLandErrors.negative:
        return errors.food_manager.seeds_on_land.negative;
      default:
        console.error("Fehlerhafte Message Range");
        return "";
        break;
    }
  }

  // - - - - - - - - - - FOOD DISTRIBUTE - - - - - - - - - -
  /**
   *  changes the amout of foot the play wat to distribute
   * @param amount the input value
   * @param food how much food the play have
   * @returns give a amount and cost back OR a error message
   */
  setDistributFood(amount: number, food: number): any {
    let error_message: DistributeFoodError;

    if (amount !== undefined || amount !== null) {
      if (amount + this.distributed_food > 0) {
        if (food > amount) {
          this.distributed_food += amount;
          return {
            amount: amount,
            cost: food,
            error: false,
          };
        } else {
          error_message = DistributeFoodError.no_food;
        }
      } else {
        error_message = DistributeFoodError.negative;
      }
    }
    return {
      amount: 0,
      cost: 0,
      error: true,
      error_message: this.distributFoodErrorHandler(error_message),
    };
  }

  /**
   * changes the error message based on the input
   * is connected to the "setDistributFood" function
   * @param error_message value of what error message should return
   * @returns gives the error message back
   */
  distributFoodErrorHandler(error_message: DistributeFoodError): string {
    switch (error_message) {
      case DistributeFoodError.no_food:
        return errors.food_manager.distribut_food.no_food;
        break;
      case DistributeFoodError.negative:
        return errors.food_manager.distribut_food.negative;
        break;
      default:
        console.error("Fehlerhafte Message Range");
        return "";
        break;
    }
  }

  // - - - - - - - - - - FOOD INCOME - - - - - - - - - -
  /**
   * calculate all var and then calculate the food income
   * @returns how much food the player made
   */
  harvestProfit(): number {
    this.calLandProfit();
    let profit =
      this.cultivated_land_profit + this.cultivated_greenhouse_profit;
    this.food_profit_this_year = profit;
    /*console.table({
      food_profit_rate: this.food_profit_rate,
      planted_land_profit: this.cultivated_land_profit,
      planted_greenhouse_profit: this.cultivated_greenhouse_profit,
      profit: profit,
    }); */
    this.cultivated_land = 0;
    this.cultivated_greenhouse = 0;
    return profit;
  }


  // - - - - - - - - - - RANDOM FUNCTIONS - - - - - - - - - -  
  randomLandProfitRate(): void {
    this.food_profit_rate = 0;
    this.food_profit_rate = Math.floor(
      Math.random() * this.profit_range + this.base_profit_min
    );
  }
    // - - - - - - - - - - CALCULATE FUNCTIONS - - - - - - - - - -  
  calLandProfit(): void {
    this.cultivated_land_profit = 0;
    this.cultivated_land_profit = this.getCultivatedLand() * this.food_profit_rate;
  }

  // - - - - - - - - - - GET | SEND THE VALUE BACK - - - - - - - - - -  
  getCultivatedLand(): number {
    return this.cultivated_land;
  }
  
  // - - - - - - - - - - RESET FUNCTIONS - - - - - - - - - -  
  resetDistributedFood() {
    this.distributed_food = 0;
  }
}
