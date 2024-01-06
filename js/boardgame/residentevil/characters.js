class ReserveCharacterTable {
  static createRow (character) {
    const elementId = toSnakeCase(character.name)
    const tableRow = document.createElement('tr')
    tableRow.setAttribute('id', elementId)
    tableRow.appendChild(ReserveCharacterTable.characterNameColumn(character.name))
    tableRow.appendChild(ReserveCharacterTable.characterUnlockedColumn(elementId, character.unlocked))
    tableRow.appendChild(ReserveCharacterTable.characterDeadColumn(elementId, character.dead))
    tableRow.appendChild(ReserveCharacterTable.characterAdvancedColumn(elementId, character.advanced))
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
    const rangeInput = ComponentCreator.createNumberInput(5, 1, 5, `character_${elementId}_health`)
    rangeInput.addEventListener('change', handleCharacterLifeChange)
    rangeInput.value = value
    charHealthCol.appendChild(rangeInput)
    return charHealthCol
  }
}

function buildReserveCharacter () {
  const reserveCharTable = document.getElementById('reserveCharacters')
  const tableBody = reserveCharTable.getElementsByTagName('tbody')[0]
  gameStatus.reserve.forEach(element => {
    tableBody.appendChild(ReserveCharacterTable.createRow(element))
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
    const characterId = event.target.id
    const regex = /\d+/ // Matches one or more digits
    const match = characterId.match(regex)
    const characterIndex = parseInt(match[0])
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
  const characterId = event.target.id
  const regex = /\d+/ // Matches one or more digits
  const match = characterId.match(regex)
  const characterIndex = parseInt(match[0])
  const character = gameStatus.characters[characterIndex - 1]
  character.kerosene = event.target.value
  gameStatus.save()
}
