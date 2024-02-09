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
    cardElement.setBackgroundColor(TENSION_CARD_COLORS[foundElement.value])
  }
  const colDiv = ComponentCreator.createDivWithClass('col-xs-12 col-md-3 mb-3', [cardElement.build()])
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
  const cardComponent = new CardBuilder(cardText, removeCard)
  if (includeQuantity) {
    let input
    if (inputType === 'text') {
      input = ComponentCreator.createTextInput(quantityValue, null, 'Quantity', handleCardValueChange)
    } else {
      input = ComponentCreator.createNumberInput(quantityValue, 0, 100, null, 'Quantity', handleCardValueChange)
    }
    cardComponent.addRow(ComponentCreator.createDivWithClass('col', [input]))
  }
  return cardComponent
}

function removeCard (event) {
  const cardElement = event.target.closest('.card')
  const removeElement = cardElement.parentNode
  const container = removeElement.parentNode
  const containerId = container.id
  const index = Array.prototype.indexOf.call(container.children, removeElement)
  if (containerId === 'narrativeDeck') {
    gameStatus.narrative.splice(index, 1)
  } else if (containerId === 'addedNarrativeDeck') {
    gameStatus.addedNarrative.splice(index, 1)
  } else if (containerId === 'tensionDeck') {
    gameStatus.tensionDeck.splice(index, 1)
  } else if (containerId === 'removedTensionDeck') {
    gameStatus.removedTensionDeck.splice(index, 1)
  } else if (containerId === 'addedMissionDeck') {
    gameStatus.addedMission.splice(index, 1)
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

function addItemDeckCardButton () {
  addCard('itemADeck', 'itemASelect', boardGameComponents.items, gameStatus.itemA, false, true, 'text')
}

function addNarrativeCardButton () {
  addCard('narrativeDeck', 'narrativeCardSelect', boardGameComponents.narrative, gameStatus.narrative)
}

function addAddedNarrativeCardButton () {
  addCard('addedNarrativeDeck', 'addedNarrativeCardSelect', boardGameComponents.narrative, gameStatus.addedNarrative)
}

function addMissionCardButton () {
  addCard('missionDeck', 'missionCardSelect', boardGameComponents.mission, gameStatus.mission)
}

function addAddedMissionCardButton () {
  addCard('addedMissionDeck', 'addedMissionCardSelect', boardGameComponents.mission, gameStatus.addedMission)
}

function addTensionCardButton () {
  addCard('tensionDeck', 'tensionCardSelect', boardGameComponents.tensionCards, gameStatus.tensionDeck, true, true)
}

function addRemovedTensionCardButton () {
  addCard('removedTensionDeck', 'removedTensionCardSelect', boardGameComponents.tensionCards, gameStatus.removedTensionDeck, true, true)
}

function addEncounterCardButton () {
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
  const colDiv = ComponentCreator.createDivWithClass('col-xs-12 col-md-3 mb-3', [cardElement.build()])
  container.appendChild(colDiv)
  storeLocation.push({
    ...foundElement,
    quantity: 1
  })
  gameStatus.save()
}

function buildEncounterCard (cardText, includeQuantity = false, quantityValue = 1, inputType = 'number', extra_content = null) {
  const cardBuilder = new CardBuilder(cardText, removeCard)
  if (extra_content) {
    const symbol = extra_content.symbol ? extra_content.symbol : 'Base'
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
    cardBuilder.addRow(symbolCol)
    cardBuilder.addRow(effects, 'mb-3')
  }
  const input = ComponentCreator.createNumberInput(quantityValue, 0, 100, null, 'Quantity', handleCardValueChange)
  cardBuilder.addRow(ComponentCreator.createDivWithClass('col', [input]))
  return cardBuilder
}

function handleCardValueChange (event) {
  const cardItem = event.target.closest('.card')
  const cardContainer = cardItem.parentNode
  const rowContainer = cardContainer.closest('.row')
  const index = Array.prototype.indexOf.call(rowContainer.children, cardContainer)
  if (rowContainer.id === 'tensionDeck') {
    gameStatus.tensionDeck[index].quantity = event.target.value
  } else if (rowContainer.id === 'removedTensionDeck') {
    gameStatus.removedTensionDeck[index].quantity = event.target.value
  } else if (rowContainer.id === 'itemBox') {
    gameStatus.items[index].quantity = event.target.value
  } else if (rowContainer.id === 'itemADeck') {
    gameStatus.itemA[index].quantity = event.target.value
  } else if (rowContainer.id === 'encounterDeck') {
    gameStatus.encounterDeck[index].quantity = event.target.value
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
