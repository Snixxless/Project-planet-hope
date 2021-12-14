import Citizen from "../../npc/Citizen";
import { seedsOnLandErrors } from "../../utils/enums";
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

  constructor() {}

  newYearRoutine(citizens: Citizen[]) {}

  // - - - - - - - - - -    Plant Seeds - - - - - - - - - -
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
        if (land_free >= amount) {
          let neededFood = amount * this.need_seeds_for_land;
          if (food * this.need_seeds_for_land >= neededFood) {
            if (
              citizens_amount * this.needed_citizens_for_land >=
              amount * this.needed_citizens_for_land
            ) {
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

  // - - - - - - - - - - FOOD INCOME - - - - - - - - - -
  diceLandProfitRate(): void {
    this.food_profit_rate = 0;
    this.food_profit_rate = Math.floor(
      Math.random() * this.profit_range + this.base_profit_min
    );
  }
  calLandProfit(): void {
    this.cultivated_land_profit = 0;
    this.cultivated_land_profit = this.cultivated_land * this.food_profit_rate;
  }

  harvestProfit(): number {
    this.diceLandProfitRate();
    this.calLandProfit();
    let profit =
      this.cultivated_land_profit + this.cultivated_greenhouse_profit;
    this.food_profit_this_year = profit;
    console.table({
      food_profit_rate: this.food_profit_rate,
      planted_land_profit: this.cultivated_land_profit,
      planted_greenhouse_profit: this.cultivated_greenhouse_profit,
      profit: profit,
    });
    this.cultivated_land = 0;
    this.cultivated_greenhouse = 0;
    return profit;
  }

  // - - - - - - - - - - FOOD DISTRIBUTE - - - - - - - - - -
  getDistributedFood(amount: number): number {
    this.distributed_food += amount;
    return amount;
  }
  setDistributedFood(amount: number, food: number): any {
    if (food !== undefined || food !== null) {
      if (food > amount) {
        food -= amount;
        return {
          amount: this.getDistributedFood(amount),
          cost: food,
          error: false,
        };
      }
    }
    return {
      amount: 0,
      cost: 0,
      error: true,
    };
  }
  resetDistributedFood() {
    this.distributed_food = 0;
  }

  // get stuff

  getCultivatedLand() {
    return this.cultivated_land;
  }
}
