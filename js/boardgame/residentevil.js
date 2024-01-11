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
let lastMapElement = null

fetch('../../public/data/residentevil.json').then(response => response.json()).then(data => {
  boardGameComponents = data
  gameStatus.load()
  builder()
})

function builder () {
  threatLevel.addEventListener('change', handleThreatLevelChange)
  buildReserveCharacter('Resident Evil')
  fillCharacterSelect()
  buildStartingMap()
  for (let i = 1; i < 5; i++) {
    fillSelectOptions(`character${i}ItemSelect`, boardGameComponents.items) // Fill options for item deck cards
  }
  fillSelectOptions('itemSelect', boardGameComponents.items) // Fill options for item deck cards
  fillSelectOptions('missionCardSelect', boardGameComponents.mission) // Fill options for missions
  fillSelectOptions('narrativeCardSelect', boardGameComponents.narrative) // Fill options for narrative cards
  fillSelectOptions('tensionCardSelect', boardGameComponents.tensionCards, true) // Fill options for narrative cards
  scaleSVGImage()
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

function loadCards () {
  gameStatus.narrative.forEach(element => loadCard('narrativeDeck', element, null, false))
  gameStatus.mission.forEach(element => loadCard('missionDeck', element, null, false))
  gameStatus.items.forEach(element => loadCard('itemBox', element.name, null, true, element.quantity, inputType = 'text'))
  gameStatus.tensionDeck.forEach(element => loadCard('tensionDeck', element.name, TENSION_CARD_COLORS[element.value], true, element.quantity, inputType = 'number'))
}

function loadCard (containerId, element, backgroundColor = null, includeQuantity = false, quantity = 1, inputType = 'number') {
  const container = document.getElementById(containerId)
  const cardElement = buildCard(element, includeQuantity, quantity, inputType)
  if (backgroundColor) {
    cardElement.style.backgroundColor = backgroundColor
  }
  const colDiv = ComponentCreator.createDivWithClass('col-xs-12 col-md-3 mb-3', [cardElement])
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

function scaleSVGImage () {
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  const svgWidth = svgElement.getBoundingClientRect().width
  const svgHeight = svgElement.getBoundingClientRect().height
  const scaleFactor = Math.min(svgWidth / viewportWidth, viewportHeight / svgHeight)
  svgElement.style.transform = `scale(${scaleFactor}, ${scaleFactor})`
}