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
  buildReserveCharacter()
  fillCharacterSelect()
  for (let i = 1; i < 5; i++) {
    fillSelectOptions(`character${i}ItemSelect`, boardGameComponents.items) // Fill options for item deck cards
  }
  fillSelectOptions('narrativeSelect', boardGameComponents.narrative)
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

function handleThreatLevelChange (event) {
  gameStatus.threatLevel = event.target.value
  gameStatus.save()
}

function fillSelectOptions (elementId, list, usePrefix = false) {
  const selectElement = document.getElementById(elementId)
  list.forEach(element => {
    const optionElement = document.createElement('option')
    const name = typeof element === 'string' ? element : element.name
    optionElement.setAttribute('value', toSnakeCase(name))
    optionElement.textContent = usePrefix ? `${TENSION_CARD_SYMBOLS[element.value]}(${element.value}) ${name}` : name
    selectElement.appendChild(optionElement)
  })
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

function addItemCardButton () {
  addCard('itemBox', 'itemSelect', boardGameComponents.items, gameStatus.items, false, true, 'text')
}

function addNarrativeCardButton () {
  addCard('narrativeDeck', 'narrativeSelect', boardGameComponents.narrative, gameStatus.narrative)
}

function addTensionCardButton () {
  addCard('tensionDeck', 'tensionCardSelect', boardGameComponents.tensionCards, gameStatus.tensionDeck, true, true)
}

function addCharacterItem (characterIndex) {
  const characterItemSelect = document.getElementById(`character${characterIndex + 1}ItemSelect`)
  const option = characterItemSelect.querySelector(`option[value="${characterItemSelect.value}"]`)
  const itemFound = boardGameComponents.items.find((element) => {
    if (typeof element === 'string') return toSnakeCase(element) === option.value
    return toSnakeCase(element.name) === option.value
  })
  buildInventoryItem(characterIndex + 1, itemFound)
}

function addCard (containerId, selectId, list, storeLocation, useBackgroundColor = null, includeQuantity = false, inputType = 'number') {
  const container = document.getElementById(containerId)
  const select = document.getElementById(selectId)
  const option = select.querySelector(`option[value="${select.value}"]`)
  const foundElement = list.find((element) => {
    if (typeof element === 'string') return toSnakeCase(element) === option.value
    return toSnakeCase(element.name) === option.value
  })
  const cardText = typeof foundElement === 'string' ? foundElement : foundElement.name
  const quantity = typeof foundElement === 'string' ? 0 : foundElement.quantity
  const cardElement = buildCard(cardText, includeQuantity, quantity, inputType)
  if (useBackgroundColor) {
    cardElement.style.backgroundColor = TENSION_CARD_COLORS[foundElement.value]
  }
  const colDiv = ComponentCreator.createDivWithClass('col-xs-12 col-md-3 mb-3', [cardElement])
  container.appendChild(colDiv)
  if (typeof foundElement === 'string' && includeQuantity) {
    storeLocation.push({
      name: foundElement,
      quantity: 1
    })
  } else if (typeof foundElement !== 'string' && includeQuantity) {
    storeLocation.push({
      ...foundElement,
      quantity: 1
    })
  } else {
    storeLocation.push(foundElement)
  }
  gameStatus.save()
}

function buildCard (cardText, includeQuantity = false, quantityValue = 1, inputType = 'number') {
  const cardComponent = new CardComponent()
  const cartTitle = document.createElement('p')
  cartTitle.setAttribute('class', 'card-text')
  cartTitle.textContent = cardText
  const rowCol = ComponentCreator.createDivWithClass('col-8', [cartTitle])
  if (includeQuantity) {
    let input
    if (inputType === 'text') {
      input = ComponentCreator.createTextInput(quantityValue, null, 'Quantity', handleCardValueChange)
    } else {
      input = ComponentCreator.createNumberInput(quantityValue, 0, 100, null, 'Quantity', handleCardValueChange)
    }
    rowCol.appendChild(input)
  }
  const removeButton = ComponentCreator.createIconButton('bi bi-trash', 'btn-danger', removeCard)
  const rowCol2 = ComponentCreator.createDivWithClass('col', [removeButton])
  const cardRow = ComponentCreator.createDivWithClass('row', [rowCol, rowCol2])
  cardComponent.addElementContent(cardRow)
  return cardComponent.generate()
}

function removeCard (event) {
  const cardElement = event.target.closest('.card')
  const removeElement = cardElement.parentNode
  const container = removeElement.parentNode
  const containerId = container.id
  const index = Array.prototype.indexOf.call(container.children, removeElement)
  if (containerId.includes('narrative')) {
    gameStatus.narrative.splice(index, 1)
  } else if (containerId.includes('tension')) {
    gameStatus.tensionDeck.splice(index, 1)
  } else if (containerId.includes('item')) {
    gameStatus.items.splice(index, 1)
  }
  gameStatus.save()
  removeElement.remove()
}

function createElement (characterIndex, item) {
  const inventoryContainer = document.getElementById(`character${characterIndex}InventoryList`)
  const listItem = document.createElement('li')
  listItem.setAttribute('class', 'list-group-item')
  const itemName = document.createElement('p')
  itemName.textContent = typeof item === 'string' ? item : item.name
  const input = ComponentCreator.createTextInput(null, null, 'Ammo/Quantity', handleItemValueChange)
  if (typeof item !== 'string') {
    input.value = item.value
  }
  const removeButton = ComponentCreator.createIconButton('bi bi-trash', 'btn-danger', removeCharacterInventoryItem)
  const buttonColumn = ComponentCreator.createDivWithClass('col-2', [removeButton])
  const nameColumn = ComponentCreator.createDivWithClass('col-9', [itemName])
  const row = ComponentCreator.createDivWithClass('row', [nameColumn, buttonColumn])
  const inputColumn = ComponentCreator.createDivWithClass('col', [input])
  const row2 = ComponentCreator.createDivWithClass(
    'row',
    [inputColumn]
  )
  listItem.appendChild(row)
  listItem.appendChild(row2)
  inventoryContainer.appendChild(listItem)
}

function removeCharacterInventoryItem (event) {
  const listItem = event.target.closest('li')
  const listContainer = listItem.parentNode
  const index = Array.prototype.indexOf.call(listContainer.children, listItem)
  const characterIndex = extractIntFromString(listContainer.id)
  gameStatus.characters[characterIndex - 1].inventory.splice(index, 1)
  gameStatus.save()
  listItem.remove()
}

function handleItemValueChange (event) {
  const listItem = event.target.closest('li')
  const listContainer = listItem.parentNode
  const index = Array.prototype.indexOf.call(listContainer.children, listItem)
  const characterIndex = extractIntFromString(listContainer.id)
  gameStatus.characters[characterIndex - 1].inventory[index].value = event.target.value
  gameStatus.save()
}

function handleCardValueChange (event) {
  console.log('Card value change')
  const cardItem = event.target.closest('.card')
  const cardContainer = cardItem.parentNode
  const rowContainer = cardContainer.closest('.row')
  const index = Array.prototype.indexOf.call(rowContainer.children, cardContainer)
  if (rowContainer.id === 'tensionDeck') {
    gameStatus.tensionDeck[index].quantity = event.target.value
  } else if (rowContainer.id === 'itemBox') {
    gameStatus.items[index].quantity = event.target.value
  }
  gameStatus.save()
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
    tableRow.appendChild(ComponentCreator.createTableDataCheckbox(element.locked, `scenario_${elementId}_discovered`, handleCheckboxChange))
    tableRow.appendChild(ComponentCreator.createTableDataCheckbox(element.completed, `scenario_${elementId}_discovered`, handleCheckboxChange))
    tableRow.appendChild(ComponentCreator.createTableDataCheckbox(element.itemC, `scenario_${elementId}_discovered`, handleCheckboxChange))
    const lockedBy = element.lockedBy ? element.lockedBy.join(', ') : ''
    tableRow.appendChild(ReserveCharacterTable.characterNameColumn(lockedBy))
    tableBody.append(tableRow)
  })
}
