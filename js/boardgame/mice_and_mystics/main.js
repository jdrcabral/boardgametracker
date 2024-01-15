const characterContainer = document.getElementById('characterContainer')
const partyAchievements = document.getElementById('storyAchievements')
const partyItems = document.getElementById('partyItem')
const scenariosTable = document.getElementById('scenariosTable')
const gameStatus = new GameStatus()
let boardGameComponents

fetch('../../public/data/mice_and_mystics.json').then(response => response.json()).then(data => {
  boardGameComponents = data
  loadCampaigns()
  // fillSelects()
  // buildReserveCharacter('Resident Evil 3')
  builder()
})

function builder () {
  buildPartyItems()
  buildPartyAchievements()
  buildCharacters()
  buildScenarios()
}

function buildPartyItems () {
  gameStatus.partyItems.forEach(element => {
    const card = new CardComponent()
    card.addTextContent(element.name)
    const checkbox = ComponentCreator.createCheckbox(element.value, `${toSnakeCase(element.name)}_party_item`, handleCheckBoxChange)
    card.addElementContent(checkbox)
    partyItems.appendChild(ComponentCreator.createDivWithClass('col-md-3 col-sm-6 mb-3', [card.generate()]))
  })
}

function buildPartyAchievements () {
  gameStatus.storyAchievements.forEach(element => {
    const card = new CardComponent()
    card.addTextContent(element.name)
    const checkbox = ComponentCreator.createCheckbox(element.value, `${toSnakeCase(element.name)}_party_achievement`, handleCheckBoxChange)
    card.addElementContent(checkbox)
    partyAchievements.appendChild(ComponentCreator.createDivWithClass('col-md-3 col-sm-6 mb-3', [card.generate()]))
  })
}

function buildCharacters () {
  const searchItems = [{text: 'Select Item', value: 'Select Item'}, ...boardGameComponents.searchCards.map(element => {
    return {
      text: element,
      value: toSnakeCase(element),
    }
  })]
  const abilitiesList = [{text: 'Select Item', value: 'Select Item'}, ...boardGameComponents.abilities.map(element => {
    return {
      text: element,
      value: toSnakeCase(element),
    }
  })]
  gameStatus.characters.forEach(element => {
    const column = ComponentCreator.createDivWithClass("col-md-3 col-xs-12 mb-3")
    const card = new CardComponent()
    card.addTextContent(element.name)
    const playerNameInput = ComponentCreator.createTextInput(null, `${toSnakeCase(element.name)}_player`, 'Player Name', () => {})
    if (element.player !== '') {
      playerNameInput.value = element.player
    }
    card.addElementContent(playerNameInput)
    const inventoryHeader = document.createElement('h6')
    inventoryHeader.setAttribute('class', 'mt-3')
    inventoryHeader.textContent = 'Inventory'
    card.addElementContent(inventoryHeader)
    const inventorySelect = ComponentCreator.createSelect(`${element.name} Item Select`, searchItems, null, `select_inventory_${toSnakeCase(element.name)}`)
    const inventoryButton = ComponentCreator.createButton('Add Item', 'btn-primary btn-sm')
    const inventoryColSelect = ComponentCreator.createDivWithClass('col', [inventorySelect])
    const inventoryColButton = ComponentCreator.createDivWithClass('col mb-3', [inventoryButton])
    const inventoryRow = ComponentCreator.createDivWithClass('row', [inventoryColSelect, inventoryColButton])
    const inventoryItemsCol = document.createElement('ul')
    inventoryItemsCol.setAttribute('class', 'list-group')
    inventoryItemsCol.setAttribute('id', `${element.name}AbilitiesList`)
    card.addElementContent(inventoryRow)
    card.addElementContent(inventoryItemsCol)

    const abilitiesHeader = document.createElement('h6')
    abilitiesHeader.setAttribute('class', 'mt-3')
    abilitiesHeader.textContent = 'Abilities'
    card.addElementContent(abilitiesHeader)
    const abilitiesSelect = ComponentCreator.createSelect(`${element.name} Item Select`, searchItems, null, `select_abilities_${toSnakeCase(element.name)}`)
    const abilitiesButton = ComponentCreator.createButton('Add Item', 'btn-primary btn-sm')
    const abilitiesColSelect = ComponentCreator.createDivWithClass('col', [abilitiesSelect])
    const abilitiesColButton = ComponentCreator.createDivWithClass('col mb-3', [abilitiesButton])
    const abilitiesRow = ComponentCreator.createDivWithClass('row', [abilitiesColSelect, abilitiesColButton])
    const abilitiesColItems = document.createElement('ul')
    abilitiesColItems.setAttribute('class', 'list-group')
    abilitiesColItems.setAttribute('id', `${element.name}AbilitiesList`)
    card.addElementContent(abilitiesRow)
    card.addElementContent(abilitiesColItems)

    const generatedCard = card.generate()
    column.appendChild(generatedCard)
    characterContainer.appendChild(column)
  })
}

function buildScenarios() {
  const tableBody = scenariosTable.getElementsByTagName('tbody')[0]
  gameStatus.scenarios.forEach(element => {
    const tableRow = document.createElement('tr')
    const chapter = document.createElement('td')
    chapter.textContent = element.chapter
    const title = document.createElement('td')
    title.textContent = element.title
    const game = document.createElement('td')
    game.textContent = element.game
    const checkbox = ComponentCreator.createTableDataCheckbox(element.completed, `${toSnakeCase(element.title)}_completed`, handleCheckBoxChange)
    tableRow.appendChild(chapter)
    tableRow.appendChild(title)
    tableRow.appendChild(checkbox)
    tableRow.appendChild(game)
    tableBody.appendChild(tableRow)
  })
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

}

function handleCampaignChange (event) {
  const gameId = event.target.value
  gameStatus.loadById(gameId)
  campaignTitle.value = gameStatus.title
  clearAll()
  builder()
}

function exportGameData () {
  return exportData(`mice_and_mystics_${gameStatus.id}`)
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
    const changedIndex = gameStatus.scenarios.findIndex(element => {
      return `${toSnakeCase(element.title)}_completed` === targetId
    })
    gameStatus.scenarios[changedIndex].completed = event.target.value
  }
  gameStatus.save()
}