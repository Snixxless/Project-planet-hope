import Citizen from "../../npc/Citizen";
import { Gender } from "../../utils/enums";

export default class CitizenManager {
  // Citizen Stats
  population: number = 0; //amount of citizens

  citizen_hunger_sum: number = 0;
  citizen_hunger_ave: number = 0;

  citizen_depression_sum: number = 0;
  citizen_depression_ave: number = 0;

  citizen_happiness_sum: number = 0;
  citizen_happiness_ave: number = 0;

  citizen_age_sum: number = 0;
  citizen_age_ave: number = 0;

  citizen_saturation_sum: number = 0;
  citizen_saturation_ave: number = 0;

  // Temporary Vars
  citizen_dead_this_year: number = 0;
  citizen_new_this_year: number = 0;

  // For highscore
  citizen_dead: number = 0;

  // Settings

  newYearRoutine(citizens: Citizen[], distributed_food: number): void {
    //console.table({sum_hunger: this.getCitizenHungerSum(citizens)});
    // reset
    this.citizen_new_this_year = 0;
    this.citizen_dead_this_year = 0;

    // citizens
    this.refreshStats(citizens);
    this.calHornyState(citizens);
    this.yearHunger(citizens);
    this.feedCitizen(citizens, distributed_food);

    this.checkDepression(citizens);
    this.calSumDepression(citizens);
    console.log(this.citizen_depression_sum);
    console.log(this.citizen_depression_ave);
    this.checkDeath(citizens);

    this.makeAllOld(citizens, 1);
    this.refreshStats(citizens);

    //this.makeAllHappy(citizens, Math.floor(Math.random() * 100)); // TODO for testing
  }

  /**
   * Creates new citizen. New citizens will  be pushed in a Array.
   * @param amount The amount of new citizens
   * @param citizens Name of the citizens array
   */
  createCitizen(amount: number, citizens: Citizen[]): void {
    for (let i = 0; i < amount; i++) {
      citizens.push(new Citizen());
      this.population++;
    }
    //this.refreshStats(citizens);
  }

  /**
   * Checks all citizens if they will die, if true they will be exterminatet... ehm i deleted.
   * @param citizens Name of the citizens array
   */
  checkDeath(citizens: Citizen[]): void {
    //console.log(this.population);
    citizens.forEach((citizen, index) => {
      if (citizen.checkDeath()) {
        citizens.splice(index, 1);
        this.population--;
        this.citizen_dead++;
        this.citizen_dead_this_year++;
        //console.log(this.population);
      }
    });
    //this.refreshStats(citizens);
  }

  checkDepression(citizens: Citizen[]): void {
    citizens.forEach((citizen) => {
      citizen.checkDepression();
    });
  }
  /**
   * gives citizens food to ++ the saturation, using the bubble sort algorithm
   * @param citizen Name of the citizens array
   * @param distributed_food The amount of food the play planed to distribute
   */
  feedCitizen(citizens: Citizen[], distributed_food: number): void {
    let numbersArray = [];

    citizens.forEach((citizen) => {
      numbersArray.push(citizen.hunger);
    });
    
    let min = Math.min(...numbersArray);

        if (distributed_food > 0) {
            let index = 0;
            citizens.sort((a, b) => a.saturation - b.saturation);
            while (distributed_food >= min) {
                if (distributed_food > min) {
                    distributed_food -= citizens[index].getHunger();
                    citizens[index].setSaturation(1);
                    index++;
                    if(index >= citizens.length){
                        index = 0;
                    }
                } else {
                    return;
                }
                
            }

            // Errors
            if(distributed_food < 0){
                console.error("citzen feed system: distributed food is negative");
                console.log(`Distributed food : ${distributed_food}`);
            }
        }
    }

  /**
   * sets the saturation of all citizens in the array -1
   * @param citizen Name of the citizens array
   */
  yearHunger(citizen: Citizen[]): void {
    citizen.forEach((citizen) => {
      citizen.setSaturation(-1);
    });
  }

  bornNewCitizen(citizens: Citizen[]): void {
    let citizen_W: number = 0;
    let citizen_M: number = 0;
    let pair: number = 0;
    let babys: number = 0;

    /**This checks if the Citizens are horny, if yes they get seperated by gender */
    citizens.forEach((citizen) => {
      if (citizen.getHorny()) {
        if (citizen.gender === Gender.female) {
          citizen_W++;
        } else if (citizen.gender === Gender.male) {
          citizen_M++;
        } else {
          console.error("Citizen Gender not found");
        }
      }
    });

    /**make pairs out of 2 gender groups */
    while (citizen_M > 0 && citizen_W > 0) {
      pair++;
      citizen_W--;
      citizen_M--;
    }

    /**Checks how many kids a couple gets. but there is a 40% chance that she didnt got prego*/
    for (let i = pair; i > 0; i--) {
      let rate = Math.floor(Math.random() * 100);
      if (rate > 0 && rate < 40) {
        //no pregnancy/kids
        //console.log('no kid')
      } else if (rate > 40 && rate <= 80) {
        //one kid
        babys++;
        //console.log('1 kid')
      } else if (rate > 80 && rate <= 95) {
        //two kids
        babys += 2;
        //console.log('2 kid')
      } else if (rate > 95 && rate <= 100) {
        babys += 3;
        //console.log('3 kid')
      }
    }
    /** DEBUG
        console.table({
            pairs: pair,
            babys: babys,
            cit_w: citizen_W,
            cit_m: citizen_M,   
        }) */
    this.citizen_new_this_year += babys;
    this.createCitizen(babys, citizens);
  }

  /**
   * refres the Stats of the Citizen Manager
   * @param citizens Name of the citizens array
   */
  refreshStats(citizens: Citizen[]): void {
    this.calAveAge(citizens);
    this.calSumHunger(citizens);
    this.calAveDepression(citizens);
    this.calAveHappiness(citizens);
    /** DEBUG
        console.table({
            population: this.population,
            //AgeSum: this.citizen_age_sum,
            Age_Ave: this.citizen_age_ave,
            Hunger_Sum: this.citizen_hunger_sum,
            //DepressionSum: this.citizen_depression_sum,
            Depression_Ave: this.citizen_depression_ave,
            //HappinessSum: this.citizen_happiness_sum,
            Happiness_Ave: this.citizen_happiness_ave
        })*/
  }

  /**
   * Makes all Citizens of a array old
   * @param citizens Name of the citizens array
   * @param years The amount of years the citizens will grow
   */
  makeAllOld(citizens: Citizen[], years: number): void {
    citizens.forEach((citizen) => {
      let amount = years;
      for (let i = 0; i < amount; i++) {
        citizen.grow();
      }
    });
    //this.refreshStats(citizens);
    //console.log(this.citizen_age_sum);
  }

  /**
   * Makes all citizens of a array old, the amount is a number between min and max
   * @param citizens Name of the citizens array
   * @param min Minimum years
   * @param max Maximum years
   */
  makeAllOldRandom(citizens: Citizen[], min: number, max: number): void {
    citizens.forEach((citizen) => {
      let amount = Math.floor(Math.random() * max + min);
      for (let i = 0; i < amount; i++) {
        citizen.grow();
      }
    });
    //this.refreshStats(citizens);
    //console.log(this.citizen_age_sum);
  }

  /**
   * Sets the happines of all citizens in a array
   * @param citizens Name of the citizens array
   * @param sertonin Value of happiness
   */
  makeAllHappy(citizens: Citizen[], sertonin: number): void {
    citizens.forEach((citizen) => {
      let amount = sertonin;
      citizen.setHappiness(amount);
    });
    //this.refreshStats(citizens);
    //console.table({happines: this.citizen_happiness});
    // console.log(this.citizen_happiness);
  }

  // - - - - - - - - - - CALCULATE THE SUM OR AVERAGE - - - - - - - - - -

  // - - - - - - - - - - DEPRESSION - - - - - - - - - -
  /**
   * calculates the SUM Depression of all citizens
   * @param citizens Name of the citizens array
   */
  calSumDepression(citizens: Citizen[]): void {
    this.citizen_depression_sum = 0;
    citizens.forEach((citizen) => {
      this.citizen_depression_sum += citizen.getDepression();
    });
    //console.log(this.citizen_depression_sum);
  }
  /**
   * calculates the AVE Depression of all citizens
   * @param citizens Name of the citizens array
   */
  calAveDepression(citizens: Citizen[]): void {
    this.citizen_depression_ave = 0;
    this.calSumDepression(citizens);
    this.citizen_depression_ave = Math.floor(
      this.citizen_depression_sum / this.population
    );
  }

  // - - - - - - - - - - HAPPINESS - - - - - - - - - -
  /**
   * calculates the SUM Happines of all citizens
   * @param citizens Name of the citizens array
   */
  calSumHappiness(citizens: Citizen[]): void {
    this.citizen_happiness_sum = 0;
    citizens.forEach((citizen) => {
      this.citizen_happiness_sum += citizen.getHappiness();
    });
  }
  /**
   * calculates the AVE Happines of all citizens
   * @param citizens Name of the citizens array
   */
  calAveHappiness(citizens: Citizen[]): void {
    this.citizen_happiness_ave = 0;
    this.calSumHappiness(citizens);
    this.citizen_happiness_ave = Math.floor(
      this.citizen_happiness_sum / this.population
    );
  }

  // - - - - - - - - - - AGE - - - - - - - - - -
  /**
   * calculates the SUM Age of all citizens
   * @param citizens the citizens of this colony
   * @param population amount of citizens
   */
  calSumAge(citizens: Citizen[]): void {
    this.citizen_age_sum = 0;
    citizens.forEach((citizen) => {
      this.citizen_age_sum += citizen.getAge();
    });
  }
  calAveAge(citizens: Citizen[]): void {
    this.citizen_age_ave = 0;
    this.calSumAge(citizens);
    this.citizen_age_ave = Math.floor(this.citizen_age_sum / this.population);
    //console.log(this.citizen_age_sum);
  }

  // - - - - - - - - - - HUNGER - - - - - - - - - -
  calSumHunger(citizens: Citizen[]): void {
    this.citizen_hunger_sum = 0;
    citizens.forEach((citizen) => {
      this.citizen_hunger_sum += citizen.getHunger();
    });
    //console.log(this.citizen_hunger_sum);
  }
  calAveHunger(citizens: Citizen[]): void {
    this.citizen_hunger_ave = 0;
    this.calSumHunger(citizens);
    this.citizen_hunger_ave += Math.floor(
      this.citizen_hunger_sum / this.population
    );
  }

  // - - - - - - - - - - SATURATION - - - - - - - - - - 
  calSumSaturation(citizens: Citizen[]): void{
    this.citizen_saturation_sum = 0;
    citizens.forEach((citizen) => {
      this.citizen_saturation_sum += citizen.getSaturation();
    });
  }

  calAveSaturation(citizens: Citizen[]): void{
    this.citizen_saturation_ave = 0;
    this.calSumSaturation(citizens);
    this.citizen_saturation_ave += (this.citizen_saturation_sum / this.population)
    console.log(this.citizen_saturation_ave)
  }





  calHornyState(citizens: Citizen[]): void {
    citizens.forEach((citizen) => {
      citizen.checkHorny();
    });
  }

  // - - - - - - - - - - Send the value back - - - - - - - - - -
  getCitizenPopulation(): number {
    return this.population;
  }

  getCitizenDeadThisYear(): number {
    return this.citizen_dead_this_year;
  }

  getCitizenHungerSum(citizens: Citizen[]): number {
    this.calSumHunger(citizens);
    return this.citizen_hunger_sum;
  }

  getCitizenDepressionAve(citizens: Citizen[]): number {
    this.calAveDepression(citizens);
    return this.citizen_depression_ave;
  }

  getCitizensHappinessAve(citizens: Citizen[]): number {
    this.calAveHappiness(citizens);
    return this.citizen_happiness_ave;
  }
  getCitizensSaturationAve(citizens: Citizen[]): number{
    this.calAveSaturation(citizens);
    return this.citizen_saturation_ave;
  }
}
