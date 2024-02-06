const STORAGE_KEY = 'CTDSBG'
const CURRENT_VERSION = 'alpha'

class GameStatus extends BaseCampaignStatus{
  id = null
  title = 'Game Campaign'
  scenarios = []
  sections = []
  characters = []
  sparks = 0
  souls = 0
  encounters = []
  inventory = []

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

  loadAttributes (sourceData) {
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
