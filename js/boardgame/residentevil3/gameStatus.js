const STORAGE_KEY = 'CTRE3BG'
const CURRENT_VERSION = 'alpha'

class GameStatus {
  cityDanger = 0
  scenarios = []
  characters = []
  reserve = []
  items = []
  narrative = []
  tensionDeck = []

  load () {
    const storedData = JSON.parse(localStorage.getItem(STORAGE_KEY))
    this.#loadAttributes(storedData)
  }

  save () {
    localStorage.setItem(STORAGE_KEY, this.toJson())
  }

  clear () {
    this.cityDanger = 0
    this.scenarios = []
    this.characters = []
    this.reserve = []
    this.items = []
    this.narrative = []
    this.tensionDeck = []
    localStorage.removeItem(STORAGE_KEY)
  }

  fromJson (jsonString) {
    const parsedJson = JSON.parse(jsonString)
    this.#loadAttributes(parsedJson)
  }

  toJson () {
    return JSON.stringify({
      cityDanger: this.cityDanger,
      scenarios: this.scenarios,
      characters: this.characters,
      reserve: this.reserve,
      items: this.items,
      narrative: this.narrative,
      tensionDeck: this.tensionDeck
    })
  }

  #loadAttributes (sourceData) {
    const baseCharacters = [this.#buildBaseCharacter(), this.#buildBaseCharacter(), this.#buildBaseCharacter(), this.#buildBaseCharacter()]
    if (sourceData === null) {
      this.scenarios = [...boardGameComponents.scenarios]
      this.characters = baseCharacters
      this.reserve = this.#buildReserve()
      return
    }

    this.cityDanger = sourceData.cityDanger ? sourceData.cityDanger : 0
    this.scenarios = sourceData.scenarios.length === 0 ? [...boardGameComponents.scenarios] : sourceData.scenarios
    this.characters = sourceData.characters.length === 0 ? baseCharacters : sourceData.characters
    this.reserve = sourceData.reserve.length === 0 ? this.#buildReserve() : sourceData.reserve
    this.narrative = sourceData.narrative.length === 0 ? [] : sourceData.narrative
    this.items = sourceData.items.length === 0 ? [] : sourceData.items
    this.tensionDeck = sourceData.tensionDeck.length === 0 ? [] : sourceData.tensionDeck
  }

  #buildReserve () {
    return boardGameComponents.characters.map(element => {
      return {
        name: element,
        unlocked: false,
        dead: false,
        advanced: false,
        health: 5
      }
    })
  }

  #buildBaseCharacter () {
    return {
      name: 'Select Character',
      health: 0,
      inventory: []
    }
  }
}
