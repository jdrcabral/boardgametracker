const characterContainer = document.getElementById('characterContainer')
const partyAchievements = document.getElementById('storyAchievements')
const partyItems = document.getElementById('partyItem')
const campaignTable = document.getElementById('campaignTable')
const gameStatus = new GameStatus()
let boardGameComponents

fetch('../../public/data/dark_souls.json').then(response => response.json()).then(data => {
  boardGameComponents = data
  loadCampaigns()
  builder()
})

function builder () {
  buildScenarios()
}

function buildScenarios () {
  const tableBody = campaignTable.getElementsByTagName('tbody')[0]

  boardGameComponents.scenarios.forEach(element => {
    const tableRow = document.createElement('tr')
    const campaign = document.createElement('td')
    campaign.textContent = element.name
    
    tableRow.appendChild(campaign)

    for (let i = 0; i < 6; i++) {
      const sectionData = document.createElement('td')
      if (i < element.sections.length ) {
        const sectionId = `${toSnakeCase(element.name)}_${toSnakeCase(element.sections[i].name)}` 
        const checkbox = ComponentCreator.createCheckbox(element.sections[i].completed, `${sectionId}`)
        const label = document.createElement('label')
        label.setAttribute('class', 'form-check-label')
        label.setAttribute('for', sectionId)
        label.textContent = element.sections[i].name
        const checkboxCol = ComponentCreator.createDivWithClass('col', [checkbox])
        const labelCol = ComponentCreator.createDivWithClass('col-12', [label])
        sectionData.appendChild(ComponentCreator.createDivWithClass('row', [labelCol, checkboxCol]))
      }
      tableRow.appendChild(sectionData)
    }

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
