let menu_texts = {
    choose_faction: {
        text: `Choose your Faction you want to play!`
    },
    main_menu: {
        text:   `Main-Menu Text Placeholder`
    }
}

let globals = {
    factions: {
        faction_1: `European Union`,
        faction_2: `American Trade Coperation`,
        faction_3: `Red Legion`
    }
}

let factions = {
    faction_1: {
        name: globals.factions.faction_1,
        description: `The European Union is a collection of small states`,
        history: ``,
        characteristics:``,
    },
    faction_2: {
        name: globals.factions.faction_2,
        description: `American Trade Federation they trade, wooop wooop`,
        history: ``,
        characteristics:``,
    },
    faction_3: {
        name: globals.factions.faction_3,
        description: `Greetings comrade here applies the iron fist of comunism`,
        history: ``,
        characteristics:``,
    }
}

export {menu_texts, globals, factions};