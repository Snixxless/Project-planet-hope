import GreenHouse from "./buildings/GreenHouse";
import CitizenManager from "./CitizenManager";

export default class FinanceManager {


    building_tax_sum: number;

    credits_income  : number;
    citizen_tax     : number = 0.1; // 0-100 (%)
    credits_expenses: number;
    credits_balance : number;

    constructor(){

    }

    calIncome(citizen_amount:number){
        this.credits_income = 0;
        this.credits_income = (this.citizen_tax * citizen_amount)
    }

    calExpenses(){
    this.credits_expenses = 0; // TODO: change later
    }

    calBalance(citizen_amount:number){ // 
        this.calIncome(citizen_amount);
        this.calExpenses();
        this.credits_balance = 0;
        this.credits_balance = this.credits_income - this.credits_expenses;
    }

    calcGreenhouse(greenhouse: GreenHouse){
        let tax_price = greenhouse.maintenance * 1;
        //console.log(tax_price);
    }


    calBuildingTaxSum(){
        
    }
}