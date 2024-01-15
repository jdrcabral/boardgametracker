const STORAGE_KEY = 'CTMAMBG'
const CURRENT_VERSION = 'alpha'

class GameStatus {
  id = null
  title = 'Game Campaign'
  scenarios = []
  characters = []
  storyAchievements = []
  partyItems = []

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
    this.characters = []
    this.partyItems = []
    this.storyAchievements = []
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
      characters: this.characters,
      partyItems: this.partyItems,
      storyAchievements: this.storyAchievements,
    })
  }

  reset () {
    const baseCharacters = boardGameComponents.characters.map((element => {
      return {
        ...element,
        player: '',
        inventory: [],
        abilities: []
      }
    }))
    this.id = generateUniqueID()
    this.title = 'New Campaign'
    this.scenarios = [...boardGameComponents.scenarios.map(element => { 
      return {...element, completed: false}
    })]
    this.characters = baseCharacters
    this.partyItems = boardGameComponents.partyItems.map(element => {
      return { name: element, value: false}
    })
    this.storyAchievements = boardGameComponents.storyAchievements.map(element => {
      return { name: element, value: false}
    })
  }

  #loadAttributes (sourceData) {
    const baseCharacters = boardGameComponents.characters.map(element => {
      return {
        ...element,
        player: '',
        inventory: [],
        abilities: []
      }
    })
    const builtScenarios = [...boardGameComponents.scenarios.map(element => { 
      return {...element, completed: false}
    })]
    const builtPartyItems = boardGameComponents.partyItems.map(element => {
      return { name: element, value: false}
    })
    const builtAchievement = boardGameComponents.storyAchievements.map(element => {
      return { name: element, value: false}
    })
    if (sourceData === null) {
      this.title = 'Game Campaign'
      this.scenarios = builtScenarios
      this.characters = baseCharacters
      this.partyItems = builtPartyItems
      this.storyAchievements = builtAchievement
      this.id = generateUniqueID()
      return
    }

    this.id = sourceData.id ? sourceData.id : generateUniqueID()
    this.title = sourceData.title ? sourceData.title : 'Game Campaign'
    this.scenarios = sourceData.scenarios.length === 0 ? builtScenarios : sourceData.scenarios
    this.characters = sourceData.characters.length === 0 ? baseCharacters : sourceData.characters
    this.partyItems = sourceData.partyItems.length === 0 ? builtPartyItems : sourceData.partyItems
    this.storyAchievements = sourceData.storyAchievements.length === 0 ? builtAchievement : sourceData.storyAchievements
  }
}

function hasOldSave (gameKeys) {
  return gameKeys.filter(element => element === STORAGE_KEY).length > 0
}