let menu_texts = {
    choose_faction: {
        text: `Choose your Faction you want to play!`
    },
    main_menu: {
        text:   ` we are waiting for you instructions.`
    },

}

let globals = {
    factions: {
        faction_1: `European Union`,
        faction_2: `American Trade Company`,
        faction_3: `Red Legion`
    },
    greeting:[
        `greetings sir`,        //0
        `Hello Mr. president`,      //1
        `zdrastuy comrade`     //2
    ]
}

let factions = {
    faction_1: {
        name: globals.factions.faction_1,
        description: `The European Union\n \n an alliance of European countries that promotes democracy, freedom and equality. A commendable ideology, but the path is difficult if different cultures and opinions are to find a consensus.\n \nThose who do not live here know Europe as the land of freedom, the inhabitants call it the bureaucratic hell.`,
        history: ``,
        characteristics:``,
    },
    faction_2: {
        name: globals.factions.faction_2,
        description: `The American Company (TAC)\n \n is known for its capitalist governance.\n Money is worth more than ethical values. \n \n Money equals power and the powerful set the rules.`,
        history: ``,
        characteristics:``,
    },
    faction_3: {
        name: globals.factions.faction_3,
        description: `The Red Legion\n \na religious state that has adopted the idiology of communism. \n \nAll are equal under the leadership of the state which goes hand in hand with the Catholic Church.
        `,
        history: ``,
        characteristics:``,
    }
}

let info = {
    distribut_food:{
        citizens_hungry: "your citizens seem hungry, you shoud give them more then they need"
    },
    buy_land:{
        trade_possible: "Dont forget that you can only trade land once a year.",
        trade_done: "Your purchase has been sent to the bank"
    }
}

let errors = {
    food_manager: {
        seeds_on_land: {
            no_food: "you do not have enough food.",
            no_land: "you do not have enough free land.",
            no_citizen: "you do not have enough citizens.",
            negative: "you cant go in to a negative value"
        },
        distribut_food: {
            no_food: "you do not have enough food",
            negative: "you cant go in to a negative value"
        }
    },
    land_manager: {
        buy_land:{
            no_credits: "you dont heave enough credits",
            no_land: "you cant buy more Land than the limit of the Bank allows.",
            negative: "You cant sell more land than you own.",
            no_trade: "You can trade Land only once a year"
        }
    }
}

export {menu_texts, globals, factions, errors, info};