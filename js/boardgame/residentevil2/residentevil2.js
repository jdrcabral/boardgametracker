const LEVEL_COLORS = {
  COMPLETED: '#2dcf43',
  UNCOMPLETED: '#ffffff'
}
const TENSION_CARD_COLORS = {
  Green: '#a1fa9d',
  Amber: '#ffe28c',
  Red: '#fc8888'
}
const TENSION_CARD_SYMBOLS = {
  Green: '🟢',
  Amber: '🟡',
  Red: '🔴'
}

const popupMenu = document.getElementById('popupMenu')
const unlockButton = document.getElementById('unlockButton')
const campaignSelect = document.getElementById('campaignSelect')
const campaignTitle = document.getElementById('campaignTitle')
const notesInput = document.getElementById('gameNotes')

let boardGameComponents = null
const gameStatus = new GameStatus()
let lastMapElement = null

fetch('../../data/residentevil2.json').then(response => response.json()).then(data => {
  boardGameComponents = data
  loadCampaigns()
  fillSelects()
  buildReserveCharacter('Resident Evil')
  builder()
})

function fillSelects () {
  fillCharacterSelect()
  for (let i = 1; i < 5; i++) {
    fillSelectOptions(`character${i}ItemSelect`, boardGameComponents.items) // Fill options for item deck cards
  }
}

function fillEncounter () {
  const selectElement = document.getElementById('encounterCardSelect')
  boardGameComponents.encounters.forEach((element, index) => {
    const optionElement = document.createElement('option')
    const name = typeof element === 'string' ? element : element.name
    optionElement.setAttribute('value', index)
    const symbol = element.symbol ? element.symbol : 'Base'
    optionElement.textContent = `${symbol} - [${element.effect.join(',')}] ${element.name}`
    selectElement.appendChild(optionElement)
  })
}

function builder () {
  loadCharacters()
  updateReserve()
  loadCards()
  notesInput.value = gameStatus.notes
}

function updateReserve () {
  gameStatus.reserve.forEach(element => ReserveCharacterTable.reloadRows(element, 'Resident Evil'))
}

function loadCharacters () {
  gameStatus.characters.forEach((element, index) => {
    if ('name' in element) {
      const selectElement = document.getElementById(`characterSelect${index + 1}`)
      selectElement.value = element.name

      const characterHealth = document.getElementById(`characterHealth${index + 1}`)
      characterHealth.value = element.health
      loadInventory(element, index)
    }
  })
}

function loadCards () {
  gameStatus.narrative.forEach(element => loadCard('narrativeDeck', element, null, false))
  gameStatus.addedNarrative.forEach(element => loadCard('addedNarrativeDeck', element, null, false))
  gameStatus.mission.forEach(element => loadCard('missionDeck', element, null, false))
  gameStatus.addedMission.forEach(element => loadCard('addedMissionDeck', element, null, false))
  gameStatus.items.forEach(element => loadCard('itemBox', element.name, null, true, element.quantity, 'text'))
  gameStatus.tensionDeck.forEach(element => loadCard('tensionDeck', element.name, TENSION_CARD_COLORS[element.value], true, element.quantity, 'number'))
  gameStatus.removedTensionDeck.forEach(element => loadCard('removedTensionDeck', element.name, TENSION_CARD_COLORS[element.value], true, element.quantity, 'number'))
  gameStatus.itemA.forEach(element => loadCard('itemADeck', element.name, null, true, element.quantity, 'text'))
  gameStatus.encounterDeck.forEach(element => loadEncounterCard('encounterDeck', element, true, element.quantity))
}

function loadEncounterCard (containerId, element, includeQuantity = false, quantity = 1, inputType = 'number') {
  const container = document.getElementById(containerId)
  const cardElement = buildEncounterCard(element.name, includeQuantity, quantity, inputType, element)
  const colDiv = ComponentCreator.createDivWithClass('col-xs-12 col-md-3 mb-3', [cardElement.build()])
  container.appendChild(colDiv)
}

function loadCard (containerId, element, backgroundColor = null, includeQuantity = false, quantity = 1, inputType = 'number') {
  const container = document.getElementById(containerId)
  const cardElement = buildCard(element, includeQuantity, quantity, inputType)
  if (backgroundColor) {
    cardElement.setBackgroundColor(backgroundColor)
  }
  const colDiv = ComponentCreator.createDivWithClass('col-xs-12 col-md-3 mb-3', [cardElement.build()])
  container.appendChild(colDiv)
}

function createNewCampaign () {
  gameStatus.reset()
  const optionElement = document.createElement('option')
  optionElement.setAttribute('value', gameStatus.id)
  optionElement.textContent = gameStatus.title
  campaignSelect.appendChild(optionElement)
  campaignSelect.value = gameStatus.id
  campaignTitle.value = gameStatus.title
  clearAll()
  updateReserve()
  builder()
  gameStatus.save()
}

function clearAll () {
  ChildRemover.clearAll('itemBox')
  ChildRemover.clearAll('itemADeck')
  for (let i = 1; i < 5; i++) {
    const characterSelect = document.getElementById(`characterSelect${i}`)
    characterSelect.value = 'Select Character'
    ChildRemover.clearAll(`character${i}InventoryList`)
  }
}

function handleCampaignChange (event) {
  const gameId = event.target.value
  gameStatus.loadById(gameId)
  campaignTitle.value = gameStatus.title
  clearAll()
  builder()
  updateReserve()
  notesInput.value = gameStatus.notes
}

function exportGameData () {
  return exportData(`resident_evil_${gameStatus.id}`)
}

function handleNotesChanges (event) {
  gameStatus.notes = event.target.value
  gameStatus.save()
}
