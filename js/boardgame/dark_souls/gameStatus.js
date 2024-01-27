const STORAGE_KEY = 'CTDSBG'
const CURRENT_VERSION = 'alpha'

class GameStatus {
  threatLevel = 0
  id = null
  title = 'Game Campaign'
  scenarios = []
  sections = []
  characters = []
  sparks = 0
  souls = 0
  encounters = []
  inventory = []

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
    this.scenarios = []
    this.sections = []
    this.characters = []
    this.sparks = 0
    this.souls = 0
    this.encounters = []
    this.inventory = []
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
      scenarios: this.scenarios,
      sections: this.sections,
      characters: this.characters,
      sparks: this.sparks,
      souls: this.souls,
      encounters: this.encounters,
      inventory: this.inventory
    })
  }

  reset () {
    const baseCharacters = [this.#buildBaseCharacter(), this.#buildBaseCharacter(), this.#buildBaseCharacter(), this.#buildBaseCharacter()]
    this.id = generateUniqueID()
    this.title = 'New Campaign'
    this.scenarios = []
    this.sections = []
    this.characters = [baseCharacters]
    this.sparks = 0
    this.souls = 0
    this.encounters = []
    this.inventory = []
  }

  #loadAttributes (sourceData) {
    const baseCharacters = [this.#buildBaseCharacter(), this.#buildBaseCharacter(), this.#buildBaseCharacter(), this.#buildBaseCharacter()]
    if (sourceData === null) {
      this.title = 'Game Campaign'
      this.scenarios = []
      this.characters = baseCharacters
      this.id = generateUniqueID()
      return
    }
    this.scenarios = sourceData.scenarios ? sourceData.scenarios : []
    this.sections = sourceData.sections ? sourceData.sections : []
    this.characters = sourceData.characters ? sourceData.characters : [baseCharacters]
    this.sparks = sourceData.sparks ? sourceData.sparks : 0
    this.souls = sourceData.souls ? sourceData.souls : 0
    this.encounters = sourceData.encounters ? sourceData.encounters : []
    this.inventory = sourceData.inventory ? sourceData.inventory : []
    this.id = sourceData.id ? sourceData.id : generateUniqueID()
    this.title = sourceData.title ? sourceData.title : 'Game Campaign'
  }

  #buildBaseCharacter () {
    return {
      name: 'Select Class',
      playerName: '',
      emberToken: false,
      estusReady: false,
      heroicAction: false,
      luckReady: false,
      equipment: {
        armor: {
          item: '',
          notes: ''
        },
        leftHand: {
          item: '',
          notes: ''
        },
        rightHand: {
          item: '',
          notes: ''
        },
        belt: {
          item: '',
          notes: ''
        }
      },
      attributes: {
        strength: 0,
        dexterity: 0,
        intelligence: 0,
        faith: 0
      }
    }
  }
}

function hasOldSave (gameKeys) {
  return gameKeys.filter(element => element === STORAGE_KEY).length > 0
}
