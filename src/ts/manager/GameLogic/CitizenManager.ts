import Citizen from "../../npc/Citizen";

export default class CitizenManager{

//    citizen_lifeStage       :number;
    population              : number = 0;
    citizen_hunger_sum      : number;
    citizen_workPower_sum   : number;

    citizen_depression_sum  : number;
    citizen_depression_ave  : number;

    citizen_happiness_sum   : number;
    citizen_happiness_ave   : number;

    citizen_age_sum         : number;
    citizen_age_ave         : number;

    citizen_dead            : number;
    citizen_dead_this_year  : number;


    createCitizen(amount: number, citizens: Citizen[]): void{
        for (let i = 0; i < amount; i++) {
            citizens.push(new Citizen);
            this.population ++;
        }
        this.refreshStats(citizens);
    }

    checkDeath(citizens: Citizen[]){
        //console.log(this.population);
        citizens.forEach( (citizen, index) => {
            if(citizen.checkDeath()){
                citizens.splice(index, 1);
                this.population --;
                this.citizen_dead ++;
                this.citizen_dead_this_year ++;
                //console.log(this.population);
            }
        })
        this.refreshStats(citizens);
    }

    refreshStats(citizens: Citizen[]): void{
        this.calAveAge(citizens);
        this.calSumHunger(citizens);
        this.calSumWorkPower(citizens);
        this.calAveDepression(citizens);
        this.calAveHappiness(citizens);
        console.table({
            population: this.population,
            //AgeSum: this.citizen_age_sum,
            Age_Ave: this.citizen_age_ave,
            WorkPower_Sum: this.citizen_workPower_sum,
            Hunger_Sum: this.citizen_hunger_sum,
            //DepressionSum: this.citizen_depression_sum,
            Depression_Ave: this.citizen_depression_ave,
            //HappinessSum: this.citizen_happiness_sum,
            Happiness_Ave: this.citizen_happiness_ave
        })
    }

    makeAllOld(citizens:Citizen[]): void{
        citizens.forEach( (citizen) =>{
            let amount = Math.floor((Math.random() * 25) + 7); // TODO change this later Niklas
            for (let i = 0; i < amount; i++){
                citizen.grow();
            }
        })
        this.refreshStats(citizens);
        //console.log(this.citizen_age_sum);
    }

    makeAllHappy(citizens: Citizen[]): void{
        citizens.forEach( (citizen) =>{
            let amount = Math.floor((Math.random() * 100));
            citizen.setHappiness(amount);
        })
        this.refreshStats(citizens);
        //console.table({happines: this.citizen_happiness});
       // console.log(this.citizen_happiness);
    }

// - - - - - - - - - - CALCULATE THE SUM OR AVERAGE - - - - - - - - - -

    // - - - - - - - - - - DEPRESSION - - - - - - - - - -
    /**
     * calculates the SUM Depression of all citizens
     * @param citizens 
     */
    calSumDepression(citizens: Citizen[]){
        this.citizen_depression_sum = 0;
        citizens.forEach((citizen)=>{
            this.citizen_depression_sum += citizen.getDepression();
        })
        //console.log(this.citizen_depression_sum);
    }
    calAveDepression(citizens: Citizen[]){
        this.citizen_depression_ave = 0;
        this.calSumDepression(citizens);
        this.citizen_depression_ave = Math.floor(this.citizen_depression_sum / this.population);
    }

    // - - - - - - - - - - HAPPINESS - - - - - - - - - -
    calSumHappiness(citizens: Citizen[]){
        this.citizen_happiness_sum = 0;
        citizens.forEach((citizen)=>{
            this.citizen_happiness_sum += citizen.getHappiness();
        })
    }
    calAveHappiness(citizens: Citizen[]){
        this.citizen_happiness_ave = 0;
        this.calSumHappiness(citizens);
        this.citizen_happiness_ave = Math.floor(this.citizen_happiness_sum / this.population);
    }

    // - - - - - - - - - - AGE - - - - - - - - - -
    /**
     * calculates the SUM Age of all citizens
     * @param citizens the citizens of this colony
     * @param population amount of citizens 
     */
    calSumAge(citizens: Citizen[]){
        this.citizen_age_sum = 0;
        citizens.forEach((citizen) => {
            this.citizen_age_sum += citizen.getAge();
        })
    }
    calAveAge(citizens: Citizen[]){
        this.citizen_age_ave = 0;
        this.calSumAge(citizens);
        this.citizen_age_ave = Math.floor(this.citizen_age_sum / this.population);
        //console.log(this.citizen_age_sum);
    }

    // - - - - - - - - - - WORK POWER - - - - - - - - - -
    calSumWorkPower(citizens: Citizen[]){
        this.citizen_workPower_sum = 0;
        citizens.forEach((citizen)=>{
            this.citizen_workPower_sum += citizen.getWorkPower();
        })
        //console.log(this.citizen_workPower);
    }

    // - - - - - - - - - - HUNGER - - - - - - - - - -
    calSumHunger(citizens: Citizen[]){
        this.citizen_hunger_sum = 0;
        citizens.forEach((citizen)=>{
            this.citizen_hunger_sum += citizen.getHunger();
        })
        //console.log(this.citizen_hunger);
    }

    // - - - - - - - - - - Send the value back - - - - - - - - - -
    getCitizenPopulation(){
        return(this.population);
    }

    getCitizenDeadThisYear(){
        return(this.citizen_dead_this_year);
    }

    
    getCitizenHungerSum(citizens: Citizen[]){
        this.calSumHunger(citizens);
        return(this.citizen_hunger_sum);
    }

    getCitizenWorkPowerSum(citizens: Citizen[]){
        this.calSumWorkPower(citizens);
        return(this.citizen_workPower_sum);
    }

    getCitizenDepressionAve(citizens: Citizen[]){
        this.calAveDepression(citizens);
        return(this.citizen_depression_ave);
    }

    getCitizensHappinessAve(citizens: Citizen[]){
        this.calAveHappiness(citizens);
        return(this.citizen_happiness_ave);
    }
    
}


