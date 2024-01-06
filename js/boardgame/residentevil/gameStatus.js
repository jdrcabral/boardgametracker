const STORAGE_KEY = 'CTREBG';
const CURRENT_VERSION = 'alpha';

class GameStatus {

    version = 'alpha';
    threatLevel = 0;
    scenarios = [];
    characters = [];
    reserve = [];
    items = [];
    narrative = [];
    mission = [];
    tensionDeck = [];

    load() {
        const storedData = JSON.parse(localStorage.getItem(STORAGE_KEY));
        const baseCharacters = [this.#buildBaseCharacter(), this.#buildBaseCharacter(), this.#buildBaseCharacter(), this.#buildBaseCharacter()];
        if (storedData === null) {
            this.scenarios = [...boardGameComponents.scenarios];
            this.characters = baseCharacters;
            this.reserve = this.#buildReserve();
            return;
        }
        
        const storedVersion = storedData.version;
        if (storedVersion != CURRENT_VERSION) {
            // TODO function to migrate version
            this.version = CURRENT_VERSION;
        }
        this.scenarios = storedData.scenarios.length === 0 ? [...boardGameComponents.scenarios] : storedData.scenarios;
        this.characters = storedData.characters.length === 0 ? baseCharacters : storedData.characters;
        this.reserve = storedData.reserve.length === 0 ? this.#buildReserve() : storedData.reserve; 
        this.narrative = storedData.narrative.length === 0 ? [] : storedData.narrative;
        this.mission = storedData.mission.length === 0 ? [] : storedData.mission;
        this.items = storedData.items.length === 0 ? [] : storedData.items;
        this.tensionDeck = storedData.tensionDeck.length === 0 ? [] : storedData.tensionDeck;
    }

    save() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
            version: this.version,
            threatLevel: this.threatLevel,
            scenarios: this.scenarios,
            characters: this.characters,
            reserve: this.reserve,
            items: this.items,
            narrative: this.narrative,
            mission: this.mission,
            tensionDeck: this.tensionDeck,
        }));
    }

    #buildReserve() {
        return boardGameComponents.characters.map(element => {
            return {
                name: element,
                unlocked: false,
                dead: false,
                advanced: false,
                health: 5,
            }
        });
    }

    #buildBaseCharacter() {
        return {
            name: 'Select Character',
            health: 0,
            kerosene: 0,
            inventory: [],
        }
    }
}