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

let boardGameComponents

fetch('../../public/data/residentevil3.json').then(response => response.json()).then(data => {
  boardGameComponents = data
  gameStatus.load()
  builder()
})

function builder () {
  cityDanger.addEventListener('change', handleCityDangerChange)
  buildReserveCharacter('Resident Evil 3')
  fillCharacterSelect()
  for (let i = 1; i < 5; i++) {
    fillSelectOptions(`character${i}ItemSelect`, boardGameComponents.items) // Fill options for item deck cards
  }
  fillSelectOptions('narrativeCardSelect', boardGameComponents.narrative)
  fillSelectOptions('tensionCardSelect', boardGameComponents.tensionCards, true)
  fillSelectOptions('itemSelect', boardGameComponents.items)

  loadCharacters()
  loadCards()
  buildScenarios()
  cityDanger.value = gameStatus.cityDanger
}

function handleCityDangerChange (event) {
  gameStatus.cityDanger = event.target.value
  gameStatus.save()
}

function loadCards () {
  gameStatus.narrative.forEach(element => loadCard('narrativeDeck', element, null, false))
  gameStatus.items.forEach(element => loadCard('itemBox', element.name, null, true, element.quantity, inputType = 'text'))
  gameStatus.tensionDeck.forEach(element => loadCard('tensionDeck', element.name, TENSION_CARD_COLORS[element.value], true, element.quantity, inputType = 'number'))
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

function loadCharacters() {
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

function loadInventory (character, index) {
  character.inventory.forEach(item => {
    createElement(index + 1, item)
  })
}

function buildInventoryItem (characterIndex, item) {
  createElement(characterIndex, item)

  gameStatus.characters[characterIndex - 1].inventory.push({
    name: item,
    value: 0
  })
  gameStatus.save()
}

function buildScenarios() {
  const reserveCharTable = document.getElementById('scenariosTable')
  const tableBody = reserveCharTable.getElementsByTagName('tbody')[0]
  gameStatus.scenarios.forEach(element => {
    const elementId = toSnakeCase(element.name)
    const tableRow = document.createElement('tr')
    tableRow.setAttribute('id', elementId)
    tableRow.appendChild(ReserveCharacterTable.characterNameColumn(element.name))
    tableRow.appendChild(ComponentCreator.createTableDataCheckbox(element.discovered, `scenario_${elementId}_discovered`, handleCheckboxChange))
    tableRow.appendChild(ComponentCreator.createTableDataCheckbox(element.locked, `scenario_${elementId}_discovered`, handleCheckboxChange))
    tableRow.appendChild(ComponentCreator.createTableDataCheckbox(element.completed, `scenario_${elementId}_discovered`, handleCheckboxChange))
    tableRow.appendChild(ComponentCreator.createTableDataCheckbox(element.itemC, `scenario_${elementId}_discovered`, handleCheckboxChange))
    const lockedBy = element.lockedBy ? element.lockedBy.join(', ') : ''
    tableRow.appendChild(ReserveCharacterTable.characterNameColumn(lockedBy))
    tableBody.append(tableRow)
  })
}
