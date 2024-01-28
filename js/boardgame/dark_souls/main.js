const characterContainer = document.getElementById('characterContainer')
const itemContainer = document.getElementById('itemsContainer')
const itemSelect = document.getElementById('itemSelect')
const scenarioSelect = document.getElementById('scenarioSelect')
const soulsInput = document.getElementById('souls')
const sparksInput = document.getElementById('sparks')
const gameStatus = new GameStatus()
let boardGameComponents

fetch('../../public/data/dark_souls.json').then(response => response.json()).then(data => {
  boardGameComponents = data
  loadCampaigns()
  builder()
})

function builder () {
  loadSoulsSparks()
  fillSelects()
  loadCharacters()
  buildScenarios()
  loadInventory()
}

function loadSoulsSparks () {
  soulsInput.value = gameStatus.souls
  sparksInput.value = gameStatus.sparks
}

function fillSelects () {
  fillSelectOptions('scenarioSelect', boardGameComponents.scenarios)
  fillSelectOptions('itemSelect', ItemsHandler.retrieveAllItems())
  for (let i = 1; i < 5; i++) {
    fillSelectOptions(`characterSelect${i}`, boardGameComponents.characters) // Fill options for character class
    fillSelectOptions(`character${i}ArmorSelect`, boardGameComponents.armor) // Fill options for character class
    fillSelectOptions(`character${i}LeftHandSelect`, boardGameComponents.weapon) // Fill options for character class
    fillSelectOptions(`character${i}RightHandSelect`, boardGameComponents.weapon) // Fill options for character class
    fillSelectOptions(`character${i}BeltSelect`, boardGameComponents.weapon) // Fill options for character class
  }
}

function fillSelectOptions (elementId, list, usePrefix = false) {
  const selectElement = document.getElementById(elementId)
  list.forEach(element => {
    const optionElement = document.createElement('option')
    let name = element
    if (typeof element !== 'string') {
      if ('class' in element) name = element.class
      else name = element.name
    }
    optionElement.setAttribute('value', toSnakeCase(name))
    optionElement.textContent = usePrefix ? `${TENSION_CARD_SYMBOLS[element.value]}(${element.value}) ${name}` : name
    selectElement.appendChild(optionElement)
  })
}

function loadCharacters () {
  for (let playerIndex = 0; playerIndex < 4; playerIndex++) {
    const characterSelect = document.getElementById(`characterSelect${playerIndex + 1}`)
    characterSelect.value = gameStatus.characters[playerIndex].name
    const characterClass = boardGameComponents.characters.find(element => {
      return toSnakeCase(element.class) === gameStatus.characters[playerIndex].name
    })

    if (!characterClass) return

    // Load tokens
    const estus = document.getElementById(`estusCharacter${playerIndex + 1}`)
    estus.checked = gameStatus.characters[playerIndex].estusReady
    const ember = document.getElementById(`emberCharacter${playerIndex + 1}`)
    ember.checked = gameStatus.characters[playerIndex].emberToken
    const luck = document.getElementById(`luckCharacter${playerIndex + 1}`)
    luck.checked = gameStatus.characters[playerIndex].luckReady
    const heroicAction = document.getElementById(`heroicActionCharacter${playerIndex + 1}`)
    heroicAction.checked = gameStatus.characters[playerIndex].heroicAction

    // Load equipement
    const equips = ['armor', 'leftHand', 'rightHand', 'belt']
    equips.forEach(element => {
      const capitalName = element[0].toUpperCase() + element.slice(1)
      const equip = gameStatus.characters[playerIndex].equipment[element]
      const select = document.getElementById(`character${playerIndex + 1}${capitalName}Select`)
      const notes = document.getElementById(`character${playerIndex + 1}${capitalName}Notes`)
      select.value = equip.item
      notes.value = equip.notes
    })

    // Load attributes
    const attributes = ['Strength', 'Dexterity', 'Intelligence', 'Faith']
    attributes.forEach(attribute => {
      const tierSelect = document.getElementById(`character${attribute}Select${playerIndex + 1}`)
      tierSelect.value = gameStatus.characters[playerIndex].attributes[attribute.toLowerCase()]
      const input = document.getElementById(`character${attribute}${playerIndex + 1}`)
      input.value = characterClass[attribute][tierSelect.value]
    })
  }
}

function loadInventory () {
  gameStatus.inventory.forEach(element => {
    addItemCard(element, element.notes)
  })
}

function addScenario () {
  const select = document.getElementById('scenarioSelect')
  const option = select.querySelector(`option[value="${select.value}"]`)
  const foundElement = boardGameComponents.scenarios.find((element) => {
    if (typeof element === 'string') return toSnakeCase(element) === option.value
    return toSnakeCase(element.name) === option.value
  })
  addScenarioCard(foundElement)
  gameStatus.scenarios.push(foundElement)
  gameStatus.save()
}

function addScenarioCard (foundElement) {
  const container = document.getElementById('scenariosContainer')

  const cardText = typeof foundElement === 'string' ? foundElement : foundElement.name
  const quantity = typeof foundElement === 'string' ? 0 : foundElement.quantity
  const cardComponent = new CardComponent()
  const cartTitle = document.createElement('p')
  cartTitle.setAttribute('class', 'card-text')
  cartTitle.textContent = cardText
  const rowCol = ComponentCreator.createDivWithClass('col-8', [cartTitle])
  const removeButton = ComponentCreator.createIconButton('bi bi-trash', 'btn-danger btn-sm', removeCard)
  const rowCol2 = ComponentCreator.createDivWithClass('col', [removeButton])
  const cardRow = ComponentCreator.createDivWithClass('row', [rowCol, rowCol2])
  cardComponent.addElementContent(cardRow)
  const sectionHeader = document.createElement('h5')
  sectionHeader.textContent = 'Section'
  cardComponent.addElementContent(sectionHeader)
  const listComponent = new ListComponent('ul', 'list-group list-group-flush')
  foundElement.sections.forEach(element => {
    const text = document.createElement('p')
    text.textContent = element.name
    const sectionId = `${toSnakeCase(foundElement.name)}_${toSnakeCase(element.name)}`
    const checkbox = ComponentCreator.createCheckbox(element.completed, `${sectionId}_completed`, handleCheckboxCampaignSectionChange)
    const textCol = ComponentCreator.createDivWithClass('col', [text])
    const checkboxCol = ComponentCreator.createDivWithClass('col', [checkbox])
    listComponent.addListItem(sectionId, null, [ComponentCreator.createDivWithClass('row', [textCol, checkboxCol])])
  })
  cardComponent.addElementContent(listComponent.list)
  const cardElement = cardComponent.generate()
  cardElement.style = 'height: 15rem;overflow-y: auto;'
  const colDiv = ComponentCreator.createDivWithClass('col-xs-12 col-md-3 mb-3', [cardElement])
  container.appendChild(colDiv)
  return foundElement
}

function removeCard (event) {
  const cardElement = event.target.closest('.card')
  const removeElement = cardElement.parentNode
  const container = removeElement.parentNode
  const containerId = container.id
  const index = Array.prototype.indexOf.call(container.children, removeElement)
  if (containerId.includes('scenarios')) {
    gameStatus.scenarios.splice(index, 1)
  } else if (containerId.includes('item')) {
    gameStatus.inventory.splice(index, 1)
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

function handleInputChange (event) {
  const targetId = event.target.id
  if (targetId === 'souls') {
    gameStatus.souls = event.target.value
  } else if (targetId === 'sparks') {
    gameStatus.sparks = event.target.value
  }
  gameStatus.save()
}

function handleClassChange (event) {
  const characterClass = boardGameComponents.characters.find(element => {
    return toSnakeCase(element.class) === event.target.value
  })
  const targetId = event.target.id
  const playerIndex = parseInt(targetId[targetId.length - 1]) - 1

  const strengthTierSelect = document.getElementById(`characterStrengthSelect${playerIndex + 1}`)
  const strengthInput = document.getElementById(`characterStrength${playerIndex + 1}`)
  strengthInput.value = characterClass.Strength[strengthTierSelect.value]
  const dexterityTierSelect = document.getElementById(`characterDexteritySelect${playerIndex + 1}`)
  const dexterityInput = document.getElementById(`characterDexterity${playerIndex + 1}`)
  dexterityInput.value = characterClass.Dexterity[dexterityTierSelect.value]
  const intelligenceTierSelect = document.getElementById(`characterIntelligenceSelect${playerIndex + 1}`)
  const intelligenceInput = document.getElementById(`characterIntelligence${playerIndex + 1}`)
  intelligenceInput.value = characterClass.Intelligence[intelligenceTierSelect.value]
  const faithTierSelect = document.getElementById(`characterFaithSelect${playerIndex + 1}`)
  const faithInput = document.getElementById(`characterFaith${playerIndex + 1}`)
  faithInput.value = characterClass.Faith[faithTierSelect.value]

  gameStatus.characters[playerIndex].name = event.target.value
  gameStatus.characters[playerIndex].attributes.strength = strengthTierSelect.value
  gameStatus.characters[playerIndex].attributes.dexterity = dexterityTierSelect.value
  gameStatus.characters[playerIndex].attributes.intelligence = intelligenceTierSelect.value
  gameStatus.characters[playerIndex].attributes.faith = faithTierSelect.value
  gameStatus.save()
}

function handleCharacterTierChange (event) {
  const targetId = event.target.id
  const playerIndex = extractIntFromString(targetId) - 1
  const charClass = boardGameComponents.characters.find(element => {
    return toSnakeCase(element.class) === gameStatus.characters[playerIndex].name
  })
  if (targetId.includes('Strength')) {
    gameStatus.characters[playerIndex].attributes.strength = event.target.value
    const input = document.getElementById(`characterStrength${playerIndex + 1}`)
    input.value = charClass.Strength[event.target.value]
  } else if (targetId.includes('Dexterity')) {
    gameStatus.characters[playerIndex].attributes.dexterity = event.target.value
    const input = document.getElementById(`characterDexterity${playerIndex + 1}`)
    input.value = charClass.Dexterity[event.target.value]
  } else if (targetId.includes('Faith')) {
    gameStatus.characters[playerIndex].attributes.faith = event.target.value
    const input = document.getElementById(`characterFaith${playerIndex + 1}`)
    input.value = charClass.Faith[event.target.value]
  } else if (targetId.includes('Intelligence')) {
    gameStatus.characters[playerIndex].attributes.intelligence = event.target.value
    const input = document.getElementById(`characterIntelligence${playerIndex + 1}`)
    input.value = charClass.Intelligence[event.target.value]
  }
  gameStatus.save()
}

function addItem () {
  const foundItem = ItemsHandler.retrieveAllItems().find(element => {
    return toSnakeCase(element.name) === itemSelect.value
  })
  addItemCard(foundItem)
  gameStatus.inventory.push({
    name: foundItem.name,
    notes: ''
  })
  gameStatus.save()
}

function addItemCard (item, notes = null) {
  const cardText = item.name
  const cardComponent = new CardComponent()
  const cartTitle = document.createElement('p')
  cartTitle.setAttribute('class', 'card-text')
  cartTitle.textContent = cardText
  const rowCol = ComponentCreator.createDivWithClass('col-8', [cartTitle])
  const removeButton = ComponentCreator.createIconButton('bi bi-trash', 'btn-danger btn-sm', removeCard)
  const rowCol2 = ComponentCreator.createDivWithClass('col', [removeButton])
  const cardRow = ComponentCreator.createDivWithClass('row', [rowCol, rowCol2])
  cardComponent.addElementContent(cardRow)
  const input = document.createElement('input')
  input.setAttribute('class', 'form-control mt-3')
  input.setAttribute('placeholder', 'Notes')
  if (notes) {
    input.value = notes
  }
  input.addEventListener('change', handleInventoryEventChange)
  cardComponent.addElementContent(input)
  const listComponent = new ListComponent('ul', 'list-group list-group-flush')
  cardComponent.addElementContent(listComponent.list)
  const cardElement = cardComponent.generate()
  const colDiv = ComponentCreator.createDivWithClass('col-xs-12 col-md-3 mb-3', [cardElement])
  itemContainer.appendChild(colDiv)
}

function handleInventoryEventChange (event) {
  const cardElement = event.target.closest('.card')
  const removeElement = cardElement.parentNode
  const container = removeElement.parentNode
  const index = Array.prototype.indexOf.call(container.children, removeElement)
  gameStatus.inventory[index].notes = event.target.value
  gameStatus.save()
}

function handleCheckboxCampaignSectionChange (event) {
  const cardElement = event.target.closest('.card')
  const removeElement = cardElement.parentNode
  const container = removeElement.parentNode
  const index = Array.prototype.indexOf.call(container.children, removeElement)
  const ulElement = event.target.closest('ul')
  const sectionIndex = Array.prototype.indexOf.call(ulElement.children, event.target.parentNode.parentNode.parentNode)
  gameStatus.scenarios[index].sections[sectionIndex].completed = event.target.checked
  gameStatus.save()
}

function handleSoulsSparkChange (event) {
  if (event.target.id === 'souls') {
    gameStatus.souls = event.target.value
  }
  if (event.target.id === 'sparks') {
    gameStatus.sparks = event.target.value
  }
  gameStatus.save()
}

function handleTokenChange (event) {
  const targetId = event.target.id
  const playerIndex = extractIntFromString(targetId)

  if (targetId.includes('ember')) {
    gameStatus.characters[playerIndex - 1].emberToken = event.target.checked
  }
  if (targetId.includes('estus')) {
    gameStatus.characters[playerIndex - 1].estusReady = event.target.checked
  }
  if (targetId.includes('heroicAction')) {
    gameStatus.characters[playerIndex - 1].heroicAction = event.target.checked
  }
  if (targetId.includes('luck')) {
    gameStatus.characters[playerIndex - 1].luckReady = event.target.checked
  }
  gameStatus.save()
}
