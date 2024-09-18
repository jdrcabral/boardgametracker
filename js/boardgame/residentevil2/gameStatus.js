const STORAGE_KEY = 'CTREBG'
const CURRENT_VERSION = 'alpha'

class GameStatus extends BaseCampaignStatus {
  threatLevel = 0
  id = null
  title = 'Game Campaign'
  scenarios = []
  characters = []
  reserve = []
  notes = ''

  clear () {
    this.id = null
    this.title = 'Game Campaign'
    this.scenarios = []
    this.characters = []
    this.reserve = []
    this.notes = ''
  }

  toJson () {
    return JSON.stringify({
      id: this.id,
      title: this.title,
      scenarios: this.scenarios,
      characters: this.characters,
      reserve: this.reserve,
      notes: this.notes
    })
  }

  reset () {
    const baseCharacters = [this.#buildBaseCharacter(), this.#buildBaseCharacter(), this.#buildBaseCharacter(), this.#buildBaseCharacter()]
    this.id = generateUniqueID()
    this.title = 'New Campaign'
    this.scenarios = structuredClone(boardGameComponents.scenarios)
    this.characters = baseCharacters
    this.reserve = this.#buildReserve()
    this.notes = ''
  }

  loadAttributes (sourceData) {
    const baseCharacters = [this.#buildBaseCharacter(), this.#buildBaseCharacter(), this.#buildBaseCharacter(), this.#buildBaseCharacter()]
    if (sourceData === null) {
      this.title = 'Game Campaign'
      this.scenarios = structuredClone(boardGameComponents.scenarios)
      this.characters = baseCharacters
      this.reserve = this.#buildReserve()
      this.id = generateUniqueID()
      return
    }
    this.id = sourceData.id ? sourceData.id : generateUniqueID()
    this.title = sourceData.title ? sourceData.title : 'Game Campaign'
    this.threatLevel = sourceData.threatLevel ? sourceData.threatLevel : 0
    this.scenarios = sourceData.scenarios.length === 0 ? structuredClone(boardGameComponents.scenarios) : sourceData.scenarios
    this.characters = sourceData.characters.length === 0 ? baseCharacters : sourceData.characters
    this.reserve = sourceData.reserve.length === 0 ? this.#buildReserve() : sourceData.reserve
    this.notes = sourceData.notes ? sourceData.notes : ''
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

function hasOldSave (gameKeys) {
  return gameKeys.filter(element => element === STORAGE_KEY).length > 0
}
