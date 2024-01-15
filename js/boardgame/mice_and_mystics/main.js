const characterContainer = document.getElementById('characterContainer')
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
  buildCharacters()
}

function buildCharacters () {
  boardGameComponents.characters.forEach(element => {
    console.log(element)
    const column = ComponentCreator.createDivWithClass("col-md-3 col-xs-12 mb-3")
    const card = new CardComponent()
    card.addTextContent(element.name)

    const inventoryHeader = document.createElement('h5')
    inventoryHeader.setAttribute('class', 'mt-3')
    const inventoryRow = ComponentCreator.createDivWithClass('row')
    const inventoryColSelect = ComponentCreator.createDivWithClass('col')
    const inventorySelect = document.createElement('select')
    inventorySelect.setAttribute('class', 'form-select')
    const option = document.createElement('option')
    option.textContent = 'Select Item'
    inventorySelect.appendChild(option)
    inventoryColSelect.appendChild(inventorySelect)
    inventoryRow.appendChild(inventoryColSelect)
    const inventoryColItems = ComponentCreator.createDivWithClass('col')

    card.addElementContent(inventoryRow)
    const generatedCard = card.generate()
    column.appendChild(generatedCard)
    characterContainer.appendChild(column)
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
  