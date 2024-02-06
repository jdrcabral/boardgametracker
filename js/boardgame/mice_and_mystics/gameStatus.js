const STORAGE_KEY = 'CTMAMBG'
const CURRENT_VERSION = 'alpha'

class GameStatus {
  id = null
  title = 'Game Campaign'
  scenarios = []
  characters = []
  storyAchievements = []
  partyItems = []

  clear () {
    this.id = null
    this.title = 'Game Campaign'
    this.scenarios = []
    this.characters = []
    this.partyItems = []
    this.storyAchievements = []
  }

  toJson () {
    return JSON.stringify({
      id: this.id,
      title: this.title,
      scenarios: this.scenarios,
      characters: this.characters,
      partyItems: this.partyItems,
      storyAchievements: this.storyAchievements
    })
  }

  reset () {
    const baseCharacters = boardGameComponents.characters.map(element => {
      return {
        ...element,
        player: '',
        inventory: [],
        abilities: []
      }
    })
    this.id = generateUniqueID()
    this.title = 'New Campaign'
    this.scenarios = [...boardGameComponents.scenarios.map(element => {
      return { ...element, completed: false }
    })]
    this.characters = baseCharacters
    this.partyItems = boardGameComponents.partyItems.map(element => {
      return { name: element, value: false }
    })
    this.storyAchievements = boardGameComponents.storyAchievements.map(element => {
      return { name: element, value: false }
    })
  }

  loadAttributes (sourceData) {
    const baseCharacters = boardGameComponents.characters.map(element => {
      return {
        ...element,
        player: '',
        inventory: [],
        abilities: []
      }
    })
    const builtScenarios = [...boardGameComponents.scenarios.map(element => {
      return { ...element, completed: false }
    })]
    const builtPartyItems = boardGameComponents.partyItems.map(element => {
      return { name: element, value: false }
    })
    const builtAchievement = boardGameComponents.storyAchievements.map(element => {
      return { name: element, value: false }
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
