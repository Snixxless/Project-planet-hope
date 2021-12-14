import Citizen from "../../npc/Citizen";
import GreenHouse from "./buildings/GreenHouse";
import CitizenManager from "./CitizenManager";

export default class FinanceManager {

    citizen_tax_rate    : number = 0.5; // 0-10 (%)
    land_tax_rate       : number = 0.2;

    citizen_income      : number = 0;

    land_expanses       : number = 0;

    credits_income      : number;
    credits_expenses    : number;
    credits_balance     : number;

    constructor(){

    }

    newYearRoutine(citizens: Citizen[],land_amount: number) {
        let profit :    number = 0;
        
        this.calBalance(citizens,land_amount);

        profit += this.credits_balance;
        return profit;
    }
    
    calCitizensToNum(citizens: Citizen[]): number{
        let citizen_amount: number = 0;
        citizens.forEach((citizen) => {
            if (citizen.life_stage > 0){
                citizen_amount ++;
            }
        });
        return citizen_amount;
    }

    calCitizenIncome(citizens:Citizen[]): void{
        this.citizen_income = 0;
        this.citizen_income += Math.floor(this.calCitizensToNum(citizens) * this.citizen_tax_rate)
    }

    calIncome(citizens:Citizen[]): void{
        this.calCitizenIncome(citizens);
        this.credits_income = 0;
        this.credits_income += this.citizen_income; 

    }

    calLandExpanses(land_amount:number): void{
        this.land_expanses = 0;
        this.land_expanses += land_amount * this.land_tax_rate;
    }

    calExpenses(land_amount: number){
        this.calLandExpanses(land_amount)
        this.credits_expenses = 0; // TODO: change later
        this.credits_expenses += this.land_expanses;
    }

    calBalance(citizens: Citizen[],land_amount: number){ // 
        this.calIncome(citizens);
        this.calExpenses(land_amount);
        this.credits_balance = 0;
        this.credits_balance = this.credits_income - this.credits_expenses;
    }

}