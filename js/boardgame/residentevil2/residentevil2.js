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

function builder () {
  loadCharacters()
  updateReserve()
  buildScenarios()
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

function buildScenarios () {
  const reserveCharTable = document.getElementById('scenariosTable')
  const tableBody = reserveCharTable.getElementsByTagName('tbody')[0]
  gameStatus.scenarios.forEach(element => {
    const elementId = toSnakeCase(element.name)
    const tableRow = document.createElement('tr')
    tableRow.setAttribute('id', elementId)
    tableRow.appendChild(ReserveCharacterTable.characterNameColumn(element.name))
    tableRow.appendChild(ComponentCreator.createTableDataCheckbox(!element.locked, `scenario_${elementId}_locked`, handleCheckboxChange))
    tableRow.appendChild(ComponentCreator.createTableDataCheckbox(element.completed, `scenario_${elementId}_completed`, handleCheckboxChange))
    const lockedBy = element.lockedBy ? element.lockedBy.join(', ') : ''
    tableRow.appendChild(ReserveCharacterTable.characterNameColumn(lockedBy))
    tableBody.append(tableRow)
  })
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
  return exportData(`resident_evil2_${gameStatus.id}`)
}

function handleNotesChanges (event) {
  gameStatus.notes = event.target.value
  gameStatus.save()
}
