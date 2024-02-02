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
  } else if (containerId.includes('mission')) {
    gameStatus.mission.splice(index, 1)
  } else if (containerId.includes('itemBox')) {
    gameStatus.items.splice(index, 1)
  } else if (containerId.includes('itemADeck')) {
    gameStatus.itemA.splice(index, 1)
  } else if (containerId.includes('encounterDeck')) {
    gameStatus.encounterDeck.splice(index, 1)
  }
  gameStatus.save()
  removeElement.remove()
}

function addItemCardButton () {
  addCard('itemBox', 'itemSelect', boardGameComponents.items, gameStatus.items, false, true, 'text')
}

function addItemDeckCardButton() {
  addCard('itemADeck', 'itemASelect', boardGameComponents.items, gameStatus.itemA, false, true, 'text')
}

function addNarrativeCardButton () {
  addCard('narrativeDeck', 'narrativeCardSelect', boardGameComponents.narrative, gameStatus.narrative)
}

function addMissionCardButton () {
  addCard('missionDeck', 'missionCardSelect', boardGameComponents.mission, gameStatus.mission)
}

function addTensionCardButton () {
  addCard('tensionDeck', 'tensionCardSelect', boardGameComponents.tensionCards, gameStatus.tensionDeck, true, true)
}

function addEncounterCardButton() {
  addEncounterCard('encounterDeck', 'encounterCardSelect', boardGameComponents.encounters, gameStatus.encounterDeck, false, true)
}

function addEncounterCard (containerId, selectId, list, storeLocation, useBackgroundColor = null, includeQuantity = false, inputType = 'number') {
  const container = document.getElementById(containerId)
  const select = document.getElementById(selectId)
  const option = select.querySelector(`option[value="${select.value}"]`)
  const foundElement = list[parseInt(option.value)]
  const cardText = typeof foundElement === 'string' ? foundElement : foundElement.name
  const quantity = typeof foundElement === 'string' ? 0 : foundElement.quantity
  const cardElement = buildEncounterCard(cardText, includeQuantity, quantity, inputType, foundElement)
  const colDiv = ComponentCreator.createDivWithClass('col-xs-12 col-md-3 mb-3', [cardElement])
  container.appendChild(colDiv)
  storeLocation.push({
    ...foundElement,
    quantity: 1
  })
  gameStatus.save()
}

function buildEncounterCard (cardText, includeQuantity = false, quantityValue = 1, inputType = 'number', extra_content = null) {
  const cardComponent = new CardComponent()
  const cartTitle = document.createElement('p')
  cartTitle.setAttribute('class', 'card-text')
  cartTitle.textContent = cardText
  const rowCol = ComponentCreator.createDivWithClass('col-8', [cartTitle])

  const removeButton = ComponentCreator.createIconButton('bi bi-trash', 'btn-danger', removeCard)
  const rowCol2 = ComponentCreator.createDivWithClass('col', [removeButton])
  const cardRow = ComponentCreator.createDivWithClass('row', [rowCol, rowCol2])
  cardComponent.addElementContent(cardRow)
  if (extra_content) {
    const symbol = extra_content.symbol ? extra_content.symbol : "Base"
    const symbolEl = document.createElement('p')
    symbolEl.textContent = symbol
    const symbolCol = ComponentCreator.createDivWithClass('col', [symbolEl])
    const effects = extra_content.effect.map((element) => {
      const span = document.createElement('span')
      span.setAttribute('class', 'badge text-bg-primary')
      span.textContent = element
      const spanCol = ComponentCreator.createDivWithClass('col-sm-4 col-md-3 col-lg-2', [span])
      return spanCol
    })
    const extraRow = ComponentCreator.createDivWithClass('row', [symbolCol])
    const effectRow = ComponentCreator.createDivWithClass('row mb-3', effects)
    cardComponent.addElementContent(extraRow)
    cardComponent.addElementContent(effectRow)
  }
  const input = ComponentCreator.createNumberInput(quantityValue, 0, 100, null, 'Quantity', handleCardValueChange)
  const inputCol = ComponentCreator.createDivWithClass('col', [input])
  const inputRow = ComponentCreator.createDivWithClass('row', [inputCol])
  cardComponent.addElementContent(inputRow)
  return cardComponent.generate()
}


function handleCardValueChange (event) {
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
