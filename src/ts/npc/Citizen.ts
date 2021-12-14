import { Happiness, Saturation } from "../utils/enums";
import { Gender } from "../utils/enums";
import { LifeStage } from "../utils/enums";

export default class Citizen{
    
    gender          : Gender = Math.floor(Math.random() * 2); // 0 female 1 male, yes this game only have to genders, im sorry its about having babys not about feelings. 
    age             : number = 0;   // the age
    mature_time     : number = 12;  // Being an adult is cool, you can do all the adult stuff, alcohol, taxes, overtime, existential anxiety, alcohol
    grandpa_time    : number = 60;  // from this time we see him/her as a pensionier, have fun feeding the pigeons.
    life_stage      : LifeStage = 0;   // 0-2 | 0 = kid, 1 = adult, 2 = grandpa

    depression      : number = 0;   // 0-100
    happiness       : Happiness = 0;   // 0-100;  // 0-100 | 0-19 = verry unhappy , 20-39 = unhappy , 40-59 normal , 60-79 = happy , 80-100 verry happy
    happiness_state : number = 0;   // 0 verry unhappy, 1 unhappy, 2 normal, 3 happy, 4 verry happy
    isHorny         : boolean = false; // if true, they can have bunga time and make new Workpower, ehmmm i mean citizens.


    hunger          : number = 15;  // 5-25 how much the citizen will eat
    saturation      : Saturation = 2;   // 0 verry hungry, 1 hungry, 2 normal ,3 saturated, 4 verry saturated

    
    mortality_rate  : number = 0.05;// it is what it says, verry brutal. RICE RICE RICE
    


    constructor(){

    }
    
    /**
     * checks if the citizen will die, nice
     * @returns 
     */
    checkDeath(): boolean{
    //    if (this.lifeStage > 0){                                                  // checks if person is Mature enough to die
            let death_probability = (this.mortality_rate * this.age) + (this.depression / 5);   // calculate the min value for the deathdice
            let rate = Math.floor(Math.random() * 150);                             // calculate the death rate
            //console.log(deathProbability)
            if(rate < death_probability){ // if the rate is lower than the "deathProbility" then the function is true
                return true;
            }
    //    }
        return false;
    }
    /**
     * let the Citizen grow and change the lifestate
     */
    grow(): void{
        this.age++;
        switch(this.age){
            case this.mature_time:
                this.life_stage = LifeStage.adult;  
                this.setHunger(5);              // makes him a big boy, girl, LGTV+ Ultra HD+
                //this.hunger += 5;                   // sets the hunger to 20
                this.mortality_rate = 0.4;          // sets the mortality_rate to 0.5 because adult life is more dangerous
                this.setDepression(5);              // because nobody know how to handle the hornyness
                break;
            case(this.grandpa_time):
                this.life_stage = LifeStage.grandpa;                 // you did it you are now a oldtimer
                this.setHunger(-2);
                //this.hunger += -2;                   // sets the hunger to 20 | yeah less work less hunger
                this.mortality_rate = 0.8;           // being old have some benefits, but getting more sick isnt one of them.
                break;
        }
    }
    
    
// CHECKS
    checkHorny(): void{
        if(this.life_stage > 0 && this.happiness_state > 0 && this.saturation > 0 && this.depression < 80){
            this.isHorny = true;
        //    console.table({is_horny: this.isHorny})
        } else {
            this.isHorny = false;
        }

    }
    checkDepression():void{
        switch (this.saturation){
            case 0:
                if(this.life_stage > 0){
                    this.setDepression(10);
                    break;   
                } else {
                    this.setDepression(25);
                    break;   
                } 
            case 1:
                this.setDepression(5);
                break;
            case 2:
                this.setDepression(-1);
                break;
            case 3:
                this.setDepression(-5);
                break;
            case 4:
                this.setDepression(-10);
                break;        
        }
    }
// - - - - - - - - - - Set values - - - - - - - - - -
    setDepression(num: number): void{
        if(0 < num || num < 100){       // 
            this.depression += num;     // adds depression from given "num"
            if(this.depression > 100){
                this.depression = 100;
            } else if(this.depression < 0){
                this.depression = 0;
            }
        }
    }

    setHunger(num: number): void{
        if(5 < num || num < 25){       // 
            this.hunger += num;        // adds hunger from given "num"
            if(this.hunger > 25){
                this.hunger = 25;
            } else if(this.hunger < 5){
                this.hunger = 5;
            }
        }
    }
    
    setSaturation(num: number){
        if(0 < num || num < 4){
            this.saturation += num;
            if(this.saturation >= 4){
                this.saturation = 4;
            } else if(this.saturation < 0){
                this.saturation = 0;
            }
        }
    }

    setHappiness(num: number): void{
        if(0 < num || num < 100){       // 
            this.happiness += num;      // adds happiness from given "num"
            if(this.happiness > 100){
                this.happiness = 100;
            } else if(this.happiness < 0){
                this.happiness = 0;
            }
            this.setHappinessState();
        }
        //console.log(this.happiness_state)
    }

    setHappinessState(): void{
        if (this.happiness > 0 && this.happiness < 15 ){
            this.happiness_state = Happiness.very_unhappy;
        } else if (this.happiness > 15 && this.happiness < 39){
            this.happiness_state = Happiness.unhappy;
        } else if (this.happiness > 40 && this.happiness < 59){
            this.happiness_state = Happiness.normal;
        } else if (this.happiness > 60 && this.happiness < 79){
            this.happiness_state = Happiness.happy;
        } else if (this.happiness > 80){
            this.happiness_state= Happiness.very_Happy;
        }
    }

// - - - - - - - - - - Send the value back - - - - - - - - - -
    getDepression(): number{
        return(this.depression);
    }
    getAge(): number{
        return(this.age);
    }
    getHunger(): number{
        return(this.hunger);
        console.log(this.hunger);
    }
    getHappiness(): number{
        return(this.happiness);
    }
    getHorny(): boolean{
        return(this.isHorny);
    }
    getGender(): number{
        return(this.gender);
    }
}