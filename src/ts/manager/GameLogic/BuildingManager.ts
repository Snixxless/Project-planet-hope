import Building from "./buildings/Building";

export default class BuildingManager{

buildings_maintenance: number;
buildings_land_occupied: number = 50;

appartments: number = 100;
food_storage: number = 0;

buildings : Building;

getLandOccupied(){
    return(this.buildings_land_occupied);
}
getAppartments(){
    return(this.appartments);
}
getFoodStorage(){
    return(this.food_storage);
}

constructor(){

}

}