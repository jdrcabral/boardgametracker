const characterContainer = document.getElementById('characterContainer')
const partyAchievements = document.getElementById('storyAchievements')
const partyItems = document.getElementById('partyItem')
const scenarioSelect = document.getElementById('scenarioSelect')
const gameStatus = new GameStatus()
let boardGameComponents

fetch('../../public/data/dark_souls.json').then(response => response.json()).then(data => {
  boardGameComponents = data
  loadCampaigns()
  builder()
})

function builder () {
  fillSelects()
  buildScenarios()
}

function fillSelects () {
  fillSelectOptions('scenarioSelect', boardGameComponents.scenarios)
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

function addScenario() {
  const select = document.getElementById('scenarioSelect')
  const option = select.querySelector(`option[value="${select.value}"]`)
  const foundElement = boardGameComponents.scenarios.find((element) => {
    if (typeof element === 'string') return toSnakeCase(element) === option.value
    return toSnakeCase(element.name) === option.value
  })
  addScenarioCard(foundElement)
}

function addScenarioCard(foundElement) {
  const container = document.getElementById('scenariosContainer')

  const cardText = typeof foundElement === 'string' ? foundElement : foundElement.name
  const quantity = typeof foundElement === 'string' ? 0 : foundElement.quantity
  const cardComponent = new CardComponent()
  const cartTitle = document.createElement('p')
  cartTitle.setAttribute('class', 'card-text')
  cartTitle.textContent = cardText
  const rowCol = ComponentCreator.createDivWithClass('col-8', [cartTitle])
  const removeButton = ComponentCreator.createIconButton('bi bi-trash', 'btn-danger', removeCard)
  const rowCol2 = ComponentCreator.createDivWithClass('col', [removeButton])
  const cardRow = ComponentCreator.createDivWithClass('row', [rowCol, rowCol2])
  cardComponent.addElementContent(cardRow)
  const sectionHeader = document.createElement('h5')
  sectionHeader.textContent = 'Section'
  cardComponent.addElementContent(sectionHeader)
  const listComponent = new ListComponent('ul', 'list-group list-group-flush')
  console.log(foundElement)
  foundElement.sections.forEach(element => {
    console.log(element)
    const text = document.createElement('p')
    text.textContent = element.name
    const sectionId = `${toSnakeCase(foundElement.name)}_${toSnakeCase(element.name)}` 
    const checkbox = ComponentCreator.createCheckbox(element.completed, `${sectionId}_completed`)
    const textCol = ComponentCreator.createDivWithClass('col', [text])
    const checkboxCol = ComponentCreator.createDivWithClass('col', [checkbox])
    listComponent.addListItem(sectionId, null, [ComponentCreator.createDivWithClass('row', [textCol, checkboxCol])])
  })
  cardComponent.addElementContent(listComponent.list)
  const cardElement = cardComponent.generate()

  const colDiv = ComponentCreator.createDivWithClass('col-xs-12 col-md-3 mb-3', [cardElement])
  container.appendChild(colDiv)
  gameStatus.scenarios.push(foundElement)
  gameStatus.save()
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

function buildScenarios () {
  gameStatus.scenarios.forEach(element => {
    addScenarioCard(element)
  })
}

function handleCheckBoxChange (event) {
  const targetId = event.target.id
  if (targetId.includes('party_item')) {
    const changedIndex = gameStatus.partyItems.findIndex(element => {
      return toSnakeCase(element.name) === targetId.replace('_party_item', '')
    })
    gameStatus.partyItems[changedIndex].value = event.target.value
  } else if (targetId.includes('party_achievement')) {
    const changedIndex = gameStatus.storyAchievements.findIndex(element => {
      return toSnakeCase(element.name) === targetId.replace('_party_achievement', '')
    })
    gameStatus.storyAchievements[changedIndex].value = event.target.value
  } else {
    const scenarioIndex = gameStatus.scenarios.findIndex(element => {
      return targetId.startsWith(toSnakeCase(element.name))
    })
    const sectionIndex = gameStatus.scenarios[scenarioIndex].sections.findIndex(element => {
      return targetId == `${toSnakeCase(gameStatus.scenarios[scenarioIndex].name)}_${toSnakeCase(element.name)}`
    })
    console.log(event.target.checked, event.target.value)
    gameStatus.scenarios[scenarioIndex].sections[sectionIndex].completed = event.target.checked
  }
  gameStatus.save()
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
  builder()
  gameStatus.save()
}

function clearAll () {
  ChildRemover.clearAll('storyAchievements')
  ChildRemover.clearAll('partyItem')
  ChildRemover.clearAll('characterContainer')
  ChildRemover.clearTableBody('scenariosTable')
}

function handleCampaignChange (event) {
  const gameId = event.target.value
  gameStatus.loadById(gameId)
  campaignTitle.value = gameStatus.title
  clearAll()
  builder()
}

function exportGameData () {
  return exportData(`dark_souls_${gameStatus.id}`)
}

function handlePlayerNameChange (event) {
  const targetId = event.target.id
  const charIndex = gameStatus.characters.findIndex((element) => {
    return `${toSnakeCase(element.name)}_player` === targetId
  })
  gameStatus.characters[charIndex].player = event.target.value
  gameStatus.save()
}


function addItemAbilities (character, destination) {
  const characterIndex = gameStatus.characters.findIndex(element => element.name == character)
  const container = document.getElementById(destination)
  if (destination.includes('Inventory')) {
    const select = document.getElementById(`select_inventory_${toSnakeCase(character)}`)
    const selectedValue = select.value
    const option = select.querySelector(`option[value="${selectedValue}"]`)
    gameStatus.characters[characterIndex].inventory.push(option.textContent)
    createElement(container, option.textContent)
  } else {
    const select = document.getElementById(`select_abilities_${toSnakeCase(character)}`)
    const selectedValue = select.value
    const option = select.querySelector(`option[value="${selectedValue}"]`)
    gameStatus.characters[characterIndex].abilities.push(option.textContent)
    createElement(container, option.textContent)
  }
  gameStatus.save()
}

function createElement (container, item) {
  const listItem = document.createElement('li')
  listItem.setAttribute('class', 'list-group-item')
  const itemName = document.createElement('p')
  itemName.textContent = item
  const removeButton = ComponentCreator.createIconButton('bi bi-trash', 'btn-danger', removeCharacterInventoryItem)
  const buttonColumn = ComponentCreator.createDivWithClass('col-2', [removeButton])
  const nameColumn = ComponentCreator.createDivWithClass('col-9', [itemName])
  const row = ComponentCreator.createDivWithClass('row', [nameColumn, buttonColumn])

  listItem.appendChild(row)
  container.appendChild(listItem)
}

function removeCharacterInventoryItem (event) {
  const listItem = event.target.closest('li')
  const listContainer = listItem.parentNode
  const index = Array.prototype.indexOf.call(listContainer.children, listItem)
  if (listContainer.id.includes('Inventory')) {
    const characterIndex = gameStatus.characters.findIndex(element => {
      return element.name === listContainer.id.replace('InventoryList', '')
    })
    gameStatus.characters[characterIndex].inventory.splice(index, 1)
  } else {
    const characterIndex = gameStatus.characters.findIndex(element => {
      return element.name === listContainer.id.replace('AbilitiesList', '')
    })
    gameStatus.characters[characterIndex].abilities.splice(index, 1)
  }
  gameStatus.save()
  listItem.remove()
}
