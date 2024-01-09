let boardGameComponents
const narrativeCards = []
const tensionCards = []
let gameStatus = {
  characters: [{}, {}, {}, {}],
  reserve: [],
  itemBox: []
}
const storageKey = 'CTRE3BG'

fetch('../../public/data/residentevil3.json').then(response => response.json()).then(data => {
  boardGameComponents = data
  builder()
})

function updateGameData () {
  localStorage.setItem(storageKey, JSON.stringify(gameStatus))
}

function loadGameStatus () {
  gameStatus.characters.forEach((element, index) => {
    if ('name' in element) {
      const selectElement = document.getElementById(`characterSelect${index + 1}`)
      selectElement.value = element.name

      const characterHealth = document.getElementById(`characterHealth${index + 1}`)
      characterHealth.value = element.health
    }
  })
  gameStatus.reserve.forEach((element) => {
    const charId = toSnakeCase(element.name)
    const reserveHealth = document.getElementById(`character_${charId}_health`)
    reserveHealth.value = element.health

    const reserveUnlocked = document.getElementById(`character_${charId}_unlocked`)
    reserveUnlocked.checked = element.unlocked

    const reserveDead = document.getElementById(`character_${charId}_dead`)
    reserveDead.checked = element.dead
  })
}

function builder () {
  buildReserveCharacter()
  fillCharacterSelect()
  fillTensionCards()
  fillNarrativeEvent()
  fillItems()
  const retrievedGame = JSON.parse(localStorage.getItem(storageKey))
  if (retrievedGame == null) {
    boardGameComponents.characters.forEach(element => {
      gameStatus.reserve.push({
        name: element,
        unlocked: false,
        dead: false,
        health: 5
      })
    })
    return
  }
  gameStatus = retrievedGame
  loadGameStatus()
}

function buildReserveCharacter () {
  const reserveCharTable = document.getElementById('reserveCharacters')
  const tableBody = reserveCharTable.getElementsByTagName('tbody')[0]
  boardGameComponents.characters.forEach(element => {
    const elementId = toSnakeCase(element)
    const tableRow = document.createElement('tr')
    const charNameCol = document.createElement('td')
    const charUnlockedCol = document.createElement('td')
    const charDeadCol = document.createElement('td')
    const charHealthCol = document.createElement('td')

    tableRow.setAttribute('id', elementId)
    charNameCol.textContent = element
    const unlockedInput = ComponentCreator.createCheckbox('', `character_${elementId}_unlocked`)
    unlockedInput.addEventListener('change', handleCheckboxChange)
    charUnlockedCol.appendChild(unlockedInput)
    const deadInput = ComponentCreator.createCheckbox('', `character_${elementId}_dead`)
    charDeadCol.addEventListener('change', handleCheckboxChange)
    charDeadCol.appendChild(deadInput)
    const rangeInput = ComponentCreator.createNumberInput(5, 1, 5, `character_${elementId}_health`, null, handleCharacterLifeChange)
    charHealthCol.appendChild(rangeInput)

    tableRow.appendChild(charNameCol)
    tableRow.appendChild(charUnlockedCol)
    tableRow.appendChild(charDeadCol)
    tableRow.appendChild(charHealthCol)

    tableBody.appendChild(tableRow)
  })
}

function fillCharacterSelect () {
  for (let i = 1; i < 5; i++) {
    const selectElement = document.getElementById(`characterSelect${i}`)
    boardGameComponents.characters.forEach(element => {
      const optionElement = document.createElement('option')
      optionElement.setAttribute('value', toSnakeCase(element))
      optionElement.textContent = element
      selectElement.appendChild(optionElement)
    })
    selectElement.addEventListener('change', handleCharacterChange)
  }
}

function fillTensionCards () {
  const selectElement = document.getElementById('tensionSelect')
  const cardColors = {
    Green: '🟢',
    Amber: '🟡',
    Red: '🔴'
  }
  boardGameComponents.tensionCards.forEach(element => {
    const optionElement = document.createElement('option')
    optionElement.setAttribute('value', toSnakeCase(element.name))
    optionElement.textContent = `${cardColors[element.value]} ${element.name}`
    selectElement.appendChild(optionElement)
  })
}

function fillNarrativeEvent () {
  const selectElement = document.getElementById('narrativeSelect')
  boardGameComponents.narrative.forEach(element => {
    const optionElement = document.createElement('option')
    optionElement.setAttribute('value', toSnakeCase(element))
    optionElement.textContent = element
    selectElement.appendChild(optionElement)
  })
}

function fillItems () {
  const selectElement = document.getElementById('itemSelect')
  boardGameComponents.items.forEach(element => {
    const optionElement = document.createElement('option')
    optionElement.setAttribute('value', toSnakeCase(element))
    optionElement.textContent = element
    selectElement.appendChild(optionElement)
  })
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
  }
  updateGameData()
}

function handleCharacterChange (event) {
  const targetId = event.target.id
  const characterIndex = parseInt(targetId[targetId.length - 1]) - 1
  const healthInputCharacter = document.getElementById(`characterHealth${characterIndex + 1}`)
  const characterId = toSnakeCase(event.target.value)
  const reserveHealth = document.getElementById(`character_${characterId}_health`)
  healthInputCharacter.value = reserveHealth.value
  gameStatus.characters[characterIndex] = {
    ...gameStatus.characters[characterIndex],
    name: event.target.value,
    health: reserveHealth.value
  }
  updateGameData()
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
  }
  updateGameData()
}

function addTensionCardButton () {
  const tensionSelect = document.getElementById('tensionSelect')
  const option = tensionSelect.querySelector(`option[value="${tensionSelect.value}"]`)
  const foundNarratvie = boardGameComponents.tensionCards.find((element) => {
    return toSnakeCase(element.name) === option.value
  })
}

function addNarrativeButton () {
  const narrativeContainer = document.getElementById('narrativeCards')
  const narrativeSelect = document.getElementById('narrativeSelect')
  const option = narrativeSelect.querySelector(`option[value="${narrativeSelect.value}"]`)
  const colDiv = ComponentCreator.createDivWithClass('col-3')
  const cardComponent = new CardComponent()
  const cardRow = ComponentCreator.createDivWithClass('row')
  const rowCol = ComponentCreator.createDivWithClass('col-8')
  const cartTitle = document.createElement('p')
  cartTitle.setAttribute('class', 'card-text')
  cartTitle.textContent = option.textContent
  rowCol.appendChild(cartTitle)

  const rowCol2 = ComponentCreator.createDivWithClass('col')
  const removeButton = ComponentCreator.createIconButton('bi bi-trash', 'btn-danger')

  rowCol2.appendChild(removeButton)
  cardRow.appendChild(rowCol)
  cardRow.appendChild(rowCol2)
  cardComponent.addElementContent(cardRow)
  const cardElement = cardComponent.generate()
  colDiv.appendChild(cardElement)
  narrativeContainer.appendChild(colDiv)
}

function removeCard (event) {
  const removeElement = event.target.closest('.col-3')
  removeElement.remove()
}
