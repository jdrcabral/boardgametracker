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

const svgElement = document.getElementById('map')
const mapPaths = svgElement.getElementById('Paths')
const popupMenu = document.getElementById('popupMenu')
const modalTitle = document.getElementById('modalTitle')
const modalExtraInfo = document.getElementById('modalExtraInfo')
const unlockButton = document.getElementById('unlockButton')
const threatLevel = document.getElementById('threatLevel')
const campaignSelect = document.getElementById('campaignSelect')
const campaignTitle = document.getElementById('campaignTitle')
const notesInput = document.getElementById('gameNotes')

let boardGameComponents
const gameStatus = new GameStatus()
let lastMapElement = null

const tabElement = document.getElementById('myTab')
tabElement.addEventListener('shown.bs.tab', (event) => {
  if (event.target.id === 'map-tab') {
    scaleSVGImage()
  }
})

fetch('../../data/residentevil.json').then(response => response.json()).then(data => {
  boardGameComponents = data
  loadCampaigns()
  threatLevel.addEventListener('change', handleThreatLevelChange)
  fillSelects()
  buildReserveCharacter('Resident Evil')
  builder()
})

function fillSelects () {
  fillCharacterSelect()
  for (let i = 1; i < 5; i++) {
    fillSelectOptions(`character${i}ItemSelect`, boardGameComponents.items) // Fill options for item deck cards
  }
  fillSelectOptions('itemSelect', boardGameComponents.items) // Fill options for item deck cards
  fillSelectOptions('itemASelect', boardGameComponents.items) // Fill options for item deck cards
  fillSelectOptions('missionCardSelect', boardGameComponents.mission) // Fill options for missions
  fillSelectOptions('narrativeCardSelect', boardGameComponents.narrative) // Fill options for narrative cards
  fillSelectOptions('addedNarrativeCardSelect', boardGameComponents.narrative) // Fill options for narrative cards
  fillSelectOptions('tensionCardSelect', boardGameComponents.tensionCards, true) // Fill options for tension cards
  fillSelectOptions('removedTensionCardSelect', boardGameComponents.tensionCards, true) // Fill options for removed cards
  fillEncounter()
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
  buildStartingMap()
  loadCharacters()
  updateReserve()
  loadCards()
  threatLevel.value = gameStatus.threatLevel
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

      const characterKerosene = document.getElementById(`characterKerosene${index + 1}`)
      characterKerosene.value = element.kerosene ? element.kerosene : 0

      loadInventory(element, index)
    }
  })
}

function loadCards () {
  gameStatus.narrative.forEach(element => loadCard('narrativeDeck', element, null, false))
  gameStatus.addedNarrative.forEach(element => loadCard('addedNarrativeDeck', element, null, false))
  gameStatus.mission.forEach(element => loadCard('missionDeck', element, null, false))
  gameStatus.items.forEach(element => loadCard('itemBox', element.name, null, true, element.quantity, inputType = 'text'))
  gameStatus.tensionDeck.forEach(element => loadCard('tensionDeck', element.name, TENSION_CARD_COLORS[element.value], true, element.quantity, inputType = 'number'))
  gameStatus.removedTensionDeck.forEach(element => loadCard('removedTensionDeck', element.name, TENSION_CARD_COLORS[element.value], true, element.quantity, inputType = 'number'))
  gameStatus.itemA.forEach(element => loadCard('itemADeck', element.name, null, true, element.quantity, inputType = 'text'))
  gameStatus.encounterDeck.forEach(element => loadEncounterCard('encounterDeck', element, null, true, element.quantity))
}

function loadEncounterCard (containerId, element, backgroundColor = null, includeQuantity = false, quantity = 1, inputType = 'number') {
  const container = document.getElementById(containerId)
  const cardElement = buildEncounterCard(element.name, includeQuantity, quantity, inputType, element)
  const colDiv = ComponentCreator.createDivWithClass('col-xs-12 col-md-3 mb-3', [cardElement])
  container.appendChild(colDiv)
}

function loadCard (containerId, element, backgroundColor = null, includeQuantity = false, quantity = 1, inputType = 'number') {
  const container = document.getElementById(containerId)
  const cardElement = buildCard(element, includeQuantity, quantity, inputType)
  if (backgroundColor) {
    cardElement.style.backgroundColor = backgroundColor
  }
  const colDiv = ComponentCreator.createDivWithClass('col-xs-12 col-md-3 mb-3', [cardElement])
  container.appendChild(colDiv)
}

function handleThreatLevelChange (event) {
  gameStatus.threatLevel = event.target.value
  gameStatus.save()
}

function openModal (event) {
  const targetElement = event.target.closest('g')
  modalTitle.textContent = targetElement.id.replaceAll('_', ' ')
  lastMapElement = targetElement
  const scenarioIndex = gameStatus.scenarios.findIndex(element => {
    return element.name.replaceAll(' ', '_') === lastMapElement.id
  })
  if (gameStatus.scenarios[scenarioIndex].lockedBy) {
    modalExtraInfo.textContent = 'Locked By: ' + gameStatus.scenarios[scenarioIndex].lockedBy
    unlockButton.removeAttribute('hidden')
  } else {
    modalExtraInfo.textContent = ''
    unlockButton.setAttribute('hidden', true)
  }
}

function scaleSVGImage () {
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  const svgWidth = svgElement.getBoundingClientRect().width
  const svgHeight = svgElement.getBoundingClientRect().height
  const scaleFactor = Math.min(svgWidth / viewportWidth, viewportHeight / svgHeight)
  svgElement.style.transform = `scale(${scaleFactor}, ${scaleFactor})`
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
  threatLevel.value = gameStatus.threatLevel
  gameStatus.save()
}

function clearAll () {
  ChildRemover.clearAll('missionDeck')
  ChildRemover.clearAll('narrativeDeck')
  ChildRemover.clearAll('tensionDeck')
  ChildRemover.clearAll('removedTensionDeck')
  ChildRemover.clearAll('addedNarrativeDeck')
  ChildRemover.clearAll('itemBox')
  ChildRemover.clearAll('itemADeck')
  ChildRemover.clearAll('encounterDeck')
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
  threatLevel.value = gameStatus.threatLevel
  notesInput.value = gameStatus.value
}

function exportGameData () {
  return exportData(`resident_evil_${gameStatus.id}`)
}

function handleNotesChanges(event) {
  gameStatus.notes = event.target.value
  gameStatus.save()
}