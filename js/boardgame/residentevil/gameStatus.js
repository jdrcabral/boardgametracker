const STORAGE_KEY = 'CTREBG'
const CURRENT_VERSION = 'alpha'

class GameStatus {
  threatLevel = 0
  id = null
  title = 'Game Campaign'
  scenarios = []
  characters = []
  reserve = []
  items = []
  itemA = []
  narrative = []
  addedNarrative = []
  mission = []
  tensionDeck = []
  removedTensionDeck = []
  encounterDeck = []
  notes = ''

  load () {
    const storageKeys = Object.keys(localStorage)
    const gameKeys = storageKeys.filter(element => element.startsWith(STORAGE_KEY))
    if (gameKeys.length === 0) {
      return this.#loadAttributes(null)
    }
    if (hasOldSave(gameKeys)) {
      const storedData = JSON.parse(localStorage.getItem(STORAGE_KEY))
      this.#loadAttributes(storedData)
      this.save()
      localStorage.removeItem(STORAGE_KEY)
      return
    }
    const storedData = JSON.parse(localStorage.getItem(gameKeys[0]))
    this.#loadAttributes(storedData)
  }

  loadById (gameId) {
    const storedData = JSON.parse(localStorage.getItem(`${STORAGE_KEY}-${gameId}`))
    this.#loadAttributes(storedData)
  }

  save () {
    if (this.id) {
      localStorage.setItem(`${STORAGE_KEY}-${this.id}`, this.toJson())
    } else {
      localStorage.setItem(STORAGE_KEY, this.toJson())
    }
  }

  retrieveSavedCampaigns () {
    const storageKeys = Object.keys(localStorage)
    const gameKeys = storageKeys.filter(element => element.startsWith(STORAGE_KEY))
    return gameKeys.map(element => {
      const loadedData = JSON.parse(localStorage.getItem(element))
      return {
        id: loadedData.id,
        title: loadedData.title
      }
    })
  }

  clear () {
    this.id = null
    this.title = 'Game Campaign'
    this.threatLevel = 0
    this.scenarios = []
    this.characters = []
    this.reserve = []
    this.items = []
    this.itemA = []
    this.narrative = []
    this.addedNarrative = []
    this.mission = []
    this.tensionDeck = []
    this.encounterDeck = []
    this.removedTensionDeck = []
    this.notes = ''
  }

  deleteData () {
    localStorage.removeItem(`${STORAGE_KEY}-${this.id}`)
  }

  fromJson (jsonString) {
    const parsedJson = JSON.parse(jsonString)
    this.#loadAttributes(parsedJson)
  }

  toJson () {
    return JSON.stringify({
      id: this.id,
      title: this.title,
      threatLevel: this.threatLevel,
      scenarios: this.scenarios,
      characters: this.characters,
      reserve: this.reserve,
      items: this.items,
      itemA: this.itemA,
      narrative: this.narrative,
      addedNarrative: this.addedNarrative,
      mission: this.mission,
      tensionDeck: this.tensionDeck,
      removedTensionDeck: this.removedTensionDeck,
      encounterDeck: this.encounterDeck,
      notes: this.notes,
    })
  }

  reset () {
    const baseCharacters = [this.#buildBaseCharacter(), this.#buildBaseCharacter(), this.#buildBaseCharacter(), this.#buildBaseCharacter()]
    this.id = generateUniqueID()
    this.title = 'New Campaign'
    this.scenarios = [...boardGameComponents.scenarios]
    this.characters = baseCharacters
    this.reserve = this.#buildReserve()
    this.narrative = []
    this.addedNarrative = []
    this.mission = []
    this.items = []
    this.itemA = []
    this.tensionDeck = []
    this.removedTensionDeck = []
    this.threatLevel = 0
    this.encounterDeck = []
    this.notes = ''
  }

  #loadAttributes (sourceData) {
    const baseCharacters = [this.#buildBaseCharacter(), this.#buildBaseCharacter(), this.#buildBaseCharacter(), this.#buildBaseCharacter()]
    if (sourceData === null) {
      this.title = 'Game Campaign'
      this.scenarios = [...boardGameComponents.scenarios]
      this.characters = baseCharacters
      this.reserve = this.#buildReserve()
      this.id = generateUniqueID()
      return
    }
    this.id = sourceData.id ? sourceData.id : generateUniqueID()
    this.title = sourceData.title ? sourceData.title : 'Game Campaign'
    this.threatLevel = sourceData.threatLevel ? sourceData.threatLevel : 0
    this.scenarios = sourceData.scenarios.length === 0 ? [...boardGameComponents.scenarios] : sourceData.scenarios
    this.characters = sourceData.characters.length === 0 ? baseCharacters : sourceData.characters
    this.reserve = sourceData.reserve.length === 0 ? this.#buildReserve() : sourceData.reserve
    this.narrative = sourceData.narrative.length === 0 ? [] : sourceData.narrative
    this.addedNarrative = sourceData.addedNarrative ? sourceData.addedNarrative : []
    this.mission = sourceData.mission.length === 0 ? [] : sourceData.mission
    this.items = sourceData.items.length === 0 ? [] : sourceData.items
    this.itemA = sourceData.itemA ? sourceData.itemA : []
    this.tensionDeck = sourceData.tensionDeck.length === 0 ? [] : sourceData.tensionDeck
    this.removedTensionDeck = sourceData.removedTensionDeck ? sourceData.removedTensionDeck : []
    this.encounterDeck = sourceData.encounterDeck ? sourceData.encounterDeck : []
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
      kerosene: 0,
      inventory: []
    }
  }
}

function hasOldSave (gameKeys) {
  return gameKeys.filter(element => element === STORAGE_KEY).length > 0
}
