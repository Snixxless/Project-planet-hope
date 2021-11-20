import Building from "./Building";
import { BuildingType } from "../../../utils/enums";


export default class HQ extends Building{

    constructor(){
        super();
        this.buildCost = 5000;
        this.level = 1;
        this.type = BuildingType.expandable;
        this.maintenance = 0;
    }

}