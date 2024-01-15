const STORAGE_KEY = 'CTRE3BG'
const CURRENT_VERSION = 'alpha'

class GameStatus {
  id = null
  title = 'Game Campaign'
  cityDanger = 0
  scenarios = []
  characters = []
  reserve = []
  items = []
  narrative = []
  tensionDeck = []

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
    console.log(gameKeys)
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
    this.cityDanger = 0
    this.scenarios = []
    this.characters = []
    this.reserve = []
    this.items = []
    this.narrative = []
    this.tensionDeck = []
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
      cityDanger: this.cityDanger,
      scenarios: this.scenarios,
      characters: this.characters,
      reserve: this.reserve,
      items: this.items,
      narrative: this.narrative,
      tensionDeck: this.tensionDeck
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
    this.mission = []
    this.items = []
    this.tensionDeck = []
    this.cityDanger = 0
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

function hasOldSave (gameKeys) {
  console.log(gameKeys)
  console.log(gameKeys.filter(element => element === STORAGE_KEY))
  return gameKeys.filter(element => element === STORAGE_KEY).length > 0
}
