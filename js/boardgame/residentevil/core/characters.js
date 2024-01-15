const reserveCharTable = document.getElementById('reserveCharacters')
const tableBody = reserveCharTable.getElementsByTagName('tbody')[0]

class ReserveCharacterTable {
  static createRow (character, game = 'Resident Evil') {
    const elementId = toSnakeCase(character.name)
    const tableRow = document.createElement('tr')
    tableRow.setAttribute('id', elementId)
    tableRow.appendChild(ReserveCharacterTable.characterNameColumn(character.name))
    tableRow.appendChild(ReserveCharacterTable.characterUnlockedColumn(elementId, character.unlocked))
    tableRow.appendChild(ReserveCharacterTable.characterDeadColumn(elementId, character.dead))
    if (game === 'Resident Evil') {
      tableRow.appendChild(ReserveCharacterTable.characterAdvancedColumn(elementId, character.advanced))
    }
    tableRow.appendChild(ReserveCharacterTable.characterHealthColumn(elementId, character.health))
    return tableRow
  }

  static characterNameColumn (name) {
    const charNameCol = document.createElement('td')
    charNameCol.textContent = name
    return charNameCol
  }

  static characterUnlockedColumn (elementId, value) {
    return ComponentCreator.createTableDataCheckbox(value, `character_${elementId}_unlocked`, handleCheckboxChange)
  }

  static characterDeadColumn (elementId, value) {
    return ComponentCreator.createTableDataCheckbox(value, `character_${elementId}_dead`, handleCheckboxChange)
  }

  static characterAdvancedColumn (elementId, value) {
    return ComponentCreator.createTableDataCheckbox(value, `character_${elementId}_advanced`, handleCheckboxChange)
  }

  static characterHealthColumn (elementId, value) {
    const charHealthCol = document.createElement('td')
    const rangeInput = ComponentCreator.createNumberInput(5, 1, 5, `character_${elementId}_health`, null, handleCharacterLifeChange)
    rangeInput.value = value
    charHealthCol.appendChild(rangeInput)
    return charHealthCol
  }

  static reloadRows (character, game = 'Resident Evil') {
    const elementId = toSnakeCase(character.name)

    const unlockedCol = document.getElementById(`character_${elementId}_unlocked`)
    unlockedCol.checked = character.unlocked
    const deadCol = document.getElementById(`character_${elementId}_dead`)
    deadCol.checked = character.dead
    if (game === 'Resident Evil') {
      const advancedCol = document.getElementById(`character_${elementId}_advanced`)
      advancedCol.checked = character.advanced
    }
    const healthCol = document.getElementById(`character_${elementId}_health`)
    healthCol.value = character.health
  }
}

function buildReserveCharacter (game = 'Resident Evil') {
  gameStatus.reserve.forEach(element => {
    tableBody.appendChild(ReserveCharacterTable.createRow(element, game))
  })
}

function fillCharacterSelect () {
  for (let i = 1; i < 5; i++) {
    const selectElement = document.getElementById(`characterSelect${i}`)
    boardGameComponents.characters.forEach(element => {
      if (element.includes('Reserve Only')) return
      const optionElement = document.createElement('option')
      optionElement.setAttribute('value', toSnakeCase(element))
      optionElement.textContent = element
      selectElement.appendChild(optionElement)
    })
    selectElement.addEventListener('change', handleCharacterChange)
  }
}

function handleCharacterChange (event) {
  const targetId = event.target.id
  const characterIndex = parseInt(targetId[targetId.length - 1]) - 1
  if (event.target.value === 'Select Character') {
    gameStatus.characters[characterIndex] = {
      ...gameStatus.characters[characterIndex],
      name: 'Select Character'
    }
    gameStatus.save()
    return
  }
  const healthInputCharacter = document.getElementById(`characterHealth${characterIndex + 1}`)
  const characterId = toSnakeCase(event.target.value)
  const reserveHealth = document.getElementById(`character_${characterId}_health`)
  healthInputCharacter.value = reserveHealth.value
  gameStatus.characters[characterIndex] = {
    ...gameStatus.characters[characterIndex],
    name: event.target.value,
    health: reserveHealth.value
  }
  gameStatus.save()
}

function handleCheckboxChange (event) {
  const targetId = event.target.id
  const grandParent = event.target.parentNode.parentNode
  const grandParentId = grandParent.id
  if (targetId.includes('character')) {
    const changedCharIndex = gameStatus.reserve.findIndex(element => {
      return grandParentId === toSnakeCase(element.name)
    })
    if (targetId.includes('unlocked')) {
      gameStatus.reserve[changedCharIndex].unlocked = event.target.checked
    }
    if (targetId.includes('dead')) {
      gameStatus.reserve[changedCharIndex].dead = event.target.checked
    }
    if (targetId.includes('advanced')) {
      gameStatus.reserve[changedCharIndex].advanced = event.target.checked
    }
  } else if (targetId.includes('scenario')) {
    const changedScenario = gameStatus.scenarios.findIndex(element => {
      return grandParentId === toSnakeCase(element.name)
    })
    if (targetId.includes('discovered')) {
      gameStatus.scenarios[changedScenario].discovered = event.target.checked
    }
    if (targetId.includes('unlocked')) {
      gameStatus.scenarios[changedScenario].unlocked = event.target.checked
    }
    if (targetId.includes('advanced')) {
      gameStatus.scenarios[changedScenario].completed = event.target.checked
    }
    if (targetId.includes('itemC')) {
      gameStatus.scenarios[changedScenario].itemC = event.target.checked
    }
  }
  gameStatus.save()
}

function handleCharacterLifeChange (event) {
  const parent = event.target.parentNode
  const parentTag = parent.tagName
  if (parentTag === 'TD') {
    const tableRow = parent.parentNode
    const tableRowId = tableRow.getAttribute('id')
    const reserveIndex = gameStatus.reserve.findIndex((element) => toSnakeCase(element.name) === tableRowId)
    gameStatus.reserve[reserveIndex].health = event.target.value

    const charactersIndex = gameStatus.characters.findIndex(element => toSnakeCase(element.name) === tableRowId)
    if (charactersIndex >= 0) {
      gameStatus.characters[charactersIndex].health = event.target.value
      const healthInputCharacter = document.getElementById(`characterHealth${charactersIndex + 1}`)
      healthInputCharacter.value = event.target.value
    }
  } else if (parentTag === 'DIV') {
    const characterIndex = extractIntFromString(event.target.id)

    const character = gameStatus.characters[characterIndex - 1]
    character.health = event.target.value

    const charTableHealth = document.getElementById(`character_${character.name}_health`)
    charTableHealth.value = event.target.value
    const reserveIndex = gameStatus.reserve.findIndex((element) => toSnakeCase(element.name) === character.name)
    gameStatus.reserve[reserveIndex].health = event.target.value
  }
  gameStatus.save()
}

function handleCharacterKeroseneChange (event) {
  const characterIndex = extractIntFromString(event.target.id)
  const character = gameStatus.characters[characterIndex - 1]
  character.kerosene = event.target.value
  gameStatus.save()
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

function buildInventoryItem (characterIndex, item) {
  createElement(characterIndex, item)

  gameStatus.characters[characterIndex - 1].inventory.push({
    name: item,
    value: 0
  })
  gameStatus.save()
}

function loadInventory (character, index) {
  character.inventory.forEach(item => {
    createElement(index + 1, item)
  })
}
