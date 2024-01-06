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

let boardGameComponents
const gameStatus = new GameStatus()
const popUpTrigger = false
let lastMapElement = null

fetch('../../public/data/residentevil.json').then(response => response.json()).then(data => {
  boardGameComponents = data
  gameStatus.load()
  builder()
})

function builder () {
  threatLevel.addEventListener('change', handleThreatLevelChange)
  buildReserveCharacter()
  fillCharacterSelect()
  buildStartingMap()
  for (let i = 1; i < 5; i++) {
    fillSelectOptions(`character${i}ItemSelect`, boardGameComponents.items) // Fill options for item deck cards
  }
  fillSelectOptions('itemSelect', boardGameComponents.items) // Fill options for item deck cards
  fillSelectOptions('missionCardSelect', boardGameComponents.mission) // Fill options for missions
  fillSelectOptions('narrativeCardSelect', boardGameComponents.narrative) // Fill options for narrative cards
  fillSelectOptions('tensionCardSelect', boardGameComponents.tensionCards, true) // Fill options for narrative cards
  scaleSVGImage(svgElement)
  loadCharacters()
  loadCards()
  threatLevel.value = gameStatus.threatLevel
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

function loadInventory (character, index) {
  character.inventory.forEach(item => {
    createElement(index + 1, item)
  })
}

function loadCards () {
  gameStatus.narrative.forEach(element => loadCard('narrativeDeck', element))
  gameStatus.mission.forEach(element => loadCard('missionDeck', element))
  gameStatus.items.forEach(element => loadCard('itemBox', element))
  gameStatus.tensionDeck.forEach(element => loadCard('tensionDeck', element.name, TENSION_CARD_COLORS[element.value]))
}

function loadCard (containerId, element, backgroundColor = null) {
  const container = document.getElementById(containerId)
  const colDiv = ComponentCreator.createDivWithClass('col-xs-12 col-md-3 mb-3')
  const cardElement = buildCard(element)
  if (backgroundColor) {
    cardElement.style.backgroundColor = backgroundColor
  }
  colDiv.appendChild(cardElement)
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

function scaleSVGImage (svgElement) {
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  const svgWidth = svgElement.getBoundingClientRect().width
  const svgHeight = svgElement.getBoundingClientRect().height
  const scaleFactor = Math.min(svgWidth / viewportWidth, viewportHeight / svgHeight)
  svgElement.style.transform = `scale(${scaleFactor}, ${scaleFactor})`
}

function fillSelectOptions (elementId, list, usePrefix = false) {
  const selectElement = document.getElementById(elementId)
  list.forEach(element => {
    const optionElement = document.createElement('option')
    const name = typeof element === 'string' ? element : element.name
    optionElement.setAttribute('value', toSnakeCase(name))
    optionElement.textContent = usePrefix ? `${TENSION_CARD_SYMBOLS[element.value]} ${name}` : name
    selectElement.appendChild(optionElement)
  })
}

function addItemCardButton () {
  addCard('itemBox', 'itemSelect', boardGameComponents.items, gameStatus.items)
}

function addNarrativeCardButton () {
  addCard('narrativeDeck', 'narrativeCardSelect', boardGameComponents.narrative, gameStatus.narrative)
}

function addMissionCardButton () {
  addCard('missionDeck', 'missionCardSelect', boardGameComponents.mission, gameStatus.mission)
}

function addTensionCardButton () {
  addCard('tensionDeck', 'tensionCardSelect', boardGameComponents.tensionCards, gameStatus.tensionDeck, true)
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

function addCard (containerId, selectId, list, storeLocation, useBackgroundColor = null) {
  const container = document.getElementById(containerId)
  const select = document.getElementById(selectId)
  const option = select.querySelector(`option[value="${select.value}"]`)
  const foundElement = list.find((element) => {
    if (typeof element === 'string') return toSnakeCase(element) === option.value
    return toSnakeCase(element.name) === option.value
  })
  const colDiv = ComponentCreator.createDivWithClass('col-xs-12 col-md-3 mb-3')
  const cardText = typeof foundElement === 'string' ? foundElement : foundElement.name
  const cardElement = buildCard(cardText)
  if (useBackgroundColor) {
    cardElement.style.backgroundColor = TENSION_CARD_COLORS[foundElement.value]
  }
  colDiv.appendChild(cardElement)
  container.appendChild(colDiv)
  storeLocation.push(foundElement)
  gameStatus.save()
}

function buildCard (cardText) {
  const cardComponent = new CardComponent()
  const cardRow = ComponentCreator.createDivWithClass('row')
  const rowCol = ComponentCreator.createDivWithClass('col-8')
  const cartTitle = document.createElement('p')
  cartTitle.setAttribute('class', 'card-text')
  cartTitle.textContent = cardText
  rowCol.appendChild(cartTitle)

  const rowCol2 = ComponentCreator.createDivWithClass('col')
  const removeButton = ComponentCreator.createIconButton('bi bi-trash', 'btn-danger')
  removeButton.addEventListener('click', removeCard)
  rowCol2.appendChild(removeButton)
  cardRow.appendChild(rowCol)
  cardRow.appendChild(rowCol2)
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
  } else if (containerId.includes('mission')) {
    gameStatus.mission.splice(index, 1)
  } else if (containerId.includes('item')) {
    gameStatus.items.splice(index, 1)
  }
  gameStatus.save()
  removeElement.remove()
}

function buildInventoryItem (characterIndex, item) {
  createElement(characterIndex, item)

  gameStatus.characters[characterIndex - 1].inventory.push({
    name: item,
    value: 0
  })
  gameStatus.save()
}

function createElement (characterIndex, item) {
  console.log(item)
  const inventoryContainer = document.getElementById(`character${characterIndex}InventoryList`)
  const listItem = document.createElement('li')
  listItem.setAttribute('class', 'list-group-item')

  const row = document.createElement('div')
  row.setAttribute('class', 'row')

  const nameColumn = document.createElement('div')
  nameColumn.setAttribute('class', 'col-9')
  const itemName = document.createElement('p')
  itemName.textContent = typeof item === 'string' ? item : item.name
  const input = document.createElement('input')
  input.setAttribute('class', 'form-control')
  input.setAttribute('placeholder', 'Ammo/Quantity')
  input.setAttribute('min', '0')
  input.setAttribute('type', 'number')
  if (typeof item !== 'string') {
    input.value = item.value
  }
  input.addEventListener('change', handleItemValueChange)
  const buttonColumn = document.createElement('div')
  buttonColumn.setAttribute('class', 'col-2')
  const removeButton = ComponentCreator.createIconButton('bi bi-trash', 'btn-danger')
  removeButton.addEventListener('click', removeCharacterInventoryItem)
  nameColumn.appendChild(itemName)
  nameColumn.appendChild(input)
  buttonColumn.appendChild(removeButton)
  row.appendChild(nameColumn)
  row.appendChild(buttonColumn)
  listItem.appendChild(row)
  inventoryContainer.appendChild(listItem)
}

function removeCharacterInventoryItem (event) {
  const listItem = event.target.closest('li')
  const listContainer = listItem.parentNode
  const index = Array.prototype.indexOf.call(listContainer.children, listItem)
  const containerId = listContainer.id
  const regex = /\d+/ // Matches one or more digits
  const match = containerId.match(regex)
  const characterIndex = parseInt(match[0])
  gameStatus.characters[characterIndex - 1].inventory.splice(index, 1)
  gameStatus.save()
  listItem.remove()
}

function handleItemValueChange (event) {
  const listItem = event.target.closest('li')
  const listContainer = listItem.parentNode
  const index = Array.prototype.indexOf.call(listContainer.children, listItem)
  const containerId = listContainer.id
  const regex = /\d+/ // Matches one or more digits
  const match = containerId.match(regex)
  const characterIndex = parseInt(match[0])
  gameStatus.characters[characterIndex - 1].inventory[index].value = event.target.value
  gameStatus.save()
}
