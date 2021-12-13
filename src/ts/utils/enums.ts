enum Factions{
    faction_1,
    faction_2,
    faction_3,
}

enum BuildingType{
    expandable,
    buildable
}

enum Happiness{
    very_unhappy,
    unhappy,
    normal,
    happy,
    very_Happy,
}

enum Saturation{
    very_hungry,
    hungry,
    normal ,
    saturated,
    very_saturated
}
enum Gender{
    female,
    male
}
enum LifeStage{
    kid,
    adult,
    grandpa
}

enum seedsOnLandErrors{
    no_food,
    no_land,
    no_citizen,
    negative,
}

export {Factions, BuildingType, Happiness, Saturation, Gender, LifeStage, seedsOnLandErrors}