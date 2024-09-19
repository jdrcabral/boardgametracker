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
const gameStatus = new GameStatus()

const cityDanger = document.getElementById('cityDanger')
const notesInput = document.getElementById('gameNotes')

let boardGameComponents = null

fetch('../../data/residentevil3.json').then(response => response.json()).then(data => {
  boardGameComponents = data
  loadCampaigns()
  cityDanger.addEventListener('change', handleCityDangerChange)
  fillSelects()
  buildReserveCharacter('Resident Evil 3')
  builder()
})

function fillSelects () {
  fillCharacterSelect()
  for (let i = 1; i < 5; i++) {
    fillSelectOptions(`character${i}ItemSelect`, boardGameComponents.items) // Fill options for item deck cards
  }
  fillSelectOptions('narrativeCardSelect', boardGameComponents.narrative)
  fillSelectOptions('tensionCardSelect', boardGameComponents.tensionCards, true)
  fillSelectOptions('itemSelect', boardGameComponents.items)
  fillSelectOptions('itemASelect', boardGameComponents.items)
}

function builder () {
  loadCharacters()
  loadCards()
  buildScenarios()
  cityDanger.value = gameStatus.cityDanger
  notesInput.value = gameStatus.notes
}

function handleCityDangerChange (event) {
  gameStatus.cityDanger = event.target.value
  gameStatus.save()
}

function loadCards () {
  gameStatus.narrative.forEach(element => loadCard('narrativeDeck', element, null, false))
  gameStatus.items.forEach(element => loadCard('itemBox', element.name, null, true, element.quantity, 'text'))
  gameStatus.itemA.forEach(element => loadCard('itemADeck', element.name, null, true, element.quantity, 'text'))
  gameStatus.tensionDeck.forEach(element => loadCard('tensionDeck', element.name, TENSION_CARD_COLORS[element.value], true, element.quantity, 'number'))
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

function buildScenarios () {
  const reserveCharTable = document.getElementById('scenariosTable')
  const tableBody = reserveCharTable.getElementsByTagName('tbody')[0]
  gameStatus.scenarios.forEach(element => {
    const elementId = toSnakeCase(element.name)
    const tableRow = document.createElement('tr')
    tableRow.setAttribute('id', elementId)
    tableRow.appendChild(ReserveCharacterTable.characterNameColumn(element.name))
    tableRow.appendChild(ComponentCreator.createTableDataCheckbox(element.discovered, `scenario_${elementId}_discovered`, handleCheckboxChange))
    tableRow.appendChild(ComponentCreator.createTableDataCheckbox(!element.locked, `scenario_${elementId}_locked`, handleCheckboxChange))
    tableRow.appendChild(ComponentCreator.createTableDataCheckbox(element.completed, `scenario_${elementId}_completed`, handleCheckboxChange))
    tableRow.appendChild(ComponentCreator.createTableDataCheckbox(element.itemC, `scenario_${elementId}_itemC`, handleCheckboxChange))
    const lockedBy = element.lockedBy ? element.lockedBy.join(', ') : ''
    tableRow.appendChild(ReserveCharacterTable.characterNameColumn(lockedBy))
    tableBody.append(tableRow)
  })
}

function updateReserve () {
  gameStatus.reserve.forEach(element => ReserveCharacterTable.reloadRows(element, 'Resident Evil 3'))
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
  cityDanger.value = gameStatus.cityDanger
  gameStatus.save()
}

function clearAll () {
  ChildRemover.clearAll('narrativeDeck')
  ChildRemover.clearAll('tensionDeck')
  ChildRemover.clearAll('itemBox')
  ChildRemover.clearAll('itemADeck')
  ChildRemover.clearTableBody('scenariosTable')
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
  cityDanger.value = gameStatus.cityDanger
  notesInput.value = gameStatus.notes
}

function exportGameData () {
  return exportData(`resident_evil3_${gameStatus.id}`)
}

function handleNotesChanges (event) {
  gameStatus.notes = event.target.value
  gameStatus.save()
}
