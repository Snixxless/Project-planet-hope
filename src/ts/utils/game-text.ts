let menu_texts = {
    choose_faction: {
        text: `Choose your Faction you want to play!`
    },
    main_menu: {
        text:   ` we are waiting for you orders.`
    },

}

let globals = {
    factions: {
        faction_1: `European Union`,
        faction_2: `American Trade Company`,
        faction_3: `Red Legion`
    },
    greeting:[
        `greetings sir`, //0
        `Hello cocksucker`,   //1
        `greetings comrade` //2
    ],
    flag_color:[
        `#054db2`,
        `#f2b124`,
        `#8c0505`

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

export {menu_texts, globals, factions};