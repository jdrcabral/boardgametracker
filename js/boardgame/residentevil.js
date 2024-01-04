const svgElement = document.getElementById('map');
const mapPaths = svgElement.getElementById('Paths');
const popupMenu = document.getElementById('popupMenu');
const modalTitle = document.getElementById('modalTitle');
const modalExtraInfo = document.getElementById('modalExtraInfo');
const unlockButton = document.getElementById('unlockButton');
const threatLevel = document.getElementById('threatLevel');
const LEVEL_COLORS = {
    COMPLETED: '#2dcf43',
    UNCOMPLETED: '#ffffff',
}

let boardGameComponents;
let gameStatus = new GameStatus();
let popUpTrigger = false;
let lastMapElement = null;

fetch('../../public/data/residentevil.json').then(response => response.json()).then(data => {
    boardGameComponents = data;
    gameStatus.load();
    builder();
});


function builder() {
    threatLevel.addEventListener('change', handleThreatLevelChange);
    buildReserveCharacter();
    fillCharacterSelect();
    buildStartingMap();
    fillSelectOptions('itemSelect', boardGameComponents.items); // Fill options for item deck cards
    fillSelectOptions('missionCardSelect', boardGameComponents.mission); // Fill options for missions
    fillSelectOptions('narrativeCardSelect', boardGameComponents.narrative); // Fill options for narrative cards
    fillTensionCards();
    scaleSVGImage(svgElement);
    loadCharacters();
    loadCards();
    threatLevel.value = gameStatus.threatLevel;
}

function loadCharacters() {
    gameStatus.characters.forEach((element, index) => {
        if ('name' in element) {
            const selectElement = document.getElementById(`characterSelect${index+1}`);
            selectElement.value = element.name;

            const characterHealth = document.getElementById(`characterHealth${index+1}`);
            characterHealth.value = element.health;

            const characterKerosene = document.getElementById(`characterKerosene${index+1}`);
            characterKerosene.value = element.kerosene ? element.kerosene : 0;
        }
    });
}

function loadCards() {
    gameStatus.narrative.forEach(element => loadCard('narrativeDeck', element));
    gameStatus.mission.forEach(element => loadCard('missionDeck', element));
    gameStatus.items.forEach(element => loadCard('itemBox', element));
    gameStatus.tensionDeck.forEach(element => {
        const cardColors = {
            Green: '#a1fa9d',
            Amber: '#ffe28c',
            Red: '#fc8888',
        }
        const tensionContainer = document.getElementById('tensionDeck');
        const colDiv = ComponentCreator.createDivWithClass('col-xs-12 col-md-3 mb-3') 
        const cardElement = buildCard(element.name);
        cardElement.style.backgroundColor = cardColors[element.value];
        colDiv.appendChild(cardElement);
        tensionContainer.appendChild(colDiv);
    });
}

function loadCard(containerId, element) {
    const container = document.getElementById(containerId);
    const colDiv = ComponentCreator.createDivWithClass('col-xs-12 col-md-3 mb-3') 
    const cardElement = buildCard(element);
    colDiv.appendChild(cardElement);
    container.appendChild(colDiv);
}

function handleThreatLevelChange(event) {
    gameStatus.threatLevel = event.target.value;
    gameStatus.save();
}

function handleCharacterChange(event) {
    const targetId = event.target.id
    const characterIndex = parseInt(targetId[targetId.length - 1]) - 1;
    if (event.target.value === 'Select Character') {
        gameStatus.characters[characterIndex] = {
            ...gameStatus.characters[characterIndex],
            name: 'Select Character',
        };
        gameStatus.save();
        return;
    }
    const healthInputCharacter = document.getElementById(`characterHealth${characterIndex + 1}`)
    const characterId = toSnakeCase(event.target.value);
    const reserveHealth = document.getElementById(`character_${characterId}_health`);
    healthInputCharacter.value = reserveHealth.value;
    gameStatus.characters[characterIndex] = {
        ...gameStatus.characters[characterIndex],
        name: event.target.value,
        health: reserveHealth.value,
    };
    gameStatus.save();
}

function openModal(event) {
    const targetElement = event.target.closest('g');
    modalTitle.textContent = targetElement.id.replaceAll('_', ' ');
    lastMapElement = targetElement;
    const scenarioIndex = gameStatus.scenarios.findIndex(element => {
        return element.name.replaceAll(' ', '_') === lastMapElement.id;
    });
    if (gameStatus.scenarios[scenarioIndex].lockedBy) {
        modalExtraInfo.textContent = 'Locked By: ' + gameStatus.scenarios[scenarioIndex].lockedBy;
        unlockButton.removeAttribute('hidden')
    } else {
        modalExtraInfo.textContent = '';
        unlockButton.setAttribute('hidden', true);
    }
}

function handleCheckboxChange(event) {
    const targetId = event.target.id;
    const grandParent = event.target.parentNode.parentNode;
    const grandParentId = grandParent.id;
    if (targetId.includes('character')) {
        const changedCharIndex = gameStatus.reserve.findIndex(element => {
            return grandParentId === toSnakeCase(element.name);
        });
        if (targetId.includes('unlocked')) {
            gameStatus.reserve[changedCharIndex].unlocked = event.target.checked;
        }
        if (targetId.includes('dead')) {
            gameStatus.reserve[changedCharIndex].dead = event.target.checked;
        }
        if (targetId.includes('advanced')) {
            gameStatus.reserve[changedCharIndex].advanced = event.target.checked;
        }
    }
    gameStatus.save();
}


function handleCharacterLifeChange(event) {
    const parent = event.target.parentNode;
    const parentTag = parent.tagName;
    if (parentTag === 'TD') {
        const tableRow = parent.parentNode;
        const tableRowId = tableRow.getAttribute('id');
        const reserveIndex = gameStatus.reserve.findIndex((element) => toSnakeCase(element.name) === tableRowId);
        gameStatus.reserve[reserveIndex].health = event.target.value;

        const charactersIndex = gameStatus.characters.findIndex(element => toSnakeCase(element.name) === tableRowId);
        if (charactersIndex >= 0) {
            gameStatus.characters[charactersIndex].health = event.target.value;
            const healthInputCharacter = document.getElementById(`characterHealth${charactersIndex + 1}`)
            healthInputCharacter.value = event.target.value;
        }
    } else if (parentTag === 'DIV') {
        const characterId = event.target.id;
        const regex = /\d+/; // Matches one or more digits
        const match = characterId.match(regex);
        const characterIndex = parseInt(match[0]);
        const character = gameStatus.characters[characterIndex - 1];
        character.health = event.target.value;

        const charTableHealth = document.getElementById(`character_${character.name}_health`);
        charTableHealth.value = event.target.value;
        const reserveIndex = gameStatus.reserve.findIndex((element) => toSnakeCase(element.name) === character.name);
        gameStatus.reserve[reserveIndex].health = event.target.value;
    }
    gameStatus.save();
}

function handleCharacterKeroseneChange(event) {
    const characterId = event.target.id;
    const regex = /\d+/; // Matches one or more digits
    const match = characterId.match(regex);
    const characterIndex = parseInt(match[0]);
    const character = gameStatus.characters[characterIndex - 1];
    character.kerosene = event.target.value;
    gameStatus.save();
}

function scaleSVGImage(svgElement) {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const svgWidth = svgElement.getBoundingClientRect().width;
    const svgHeight = svgElement.getBoundingClientRect().height;
    const scaleFactor = Math.min(svgWidth / viewportWidth, viewportHeight / svgHeight);
    svgElement.style.transform = `scale(${scaleFactor}, ${scaleFactor})`;
}

function fillSelectOptions(elementId, list) {
    const selectElement = document.getElementById(elementId);
    list.forEach(element => {
        const optionElement = document.createElement('option');
        optionElement.setAttribute('value', toSnakeCase(element));
        optionElement.textContent = element;
        selectElement.appendChild(optionElement);
    }); 
}

function addItemCardButton() {
    const addedNarrativeCard = addCard('itemBox', 'itemSelect', boardGameComponents.items);
    // gameStatus.items.push(addedNarrativeCard);
    // gameStatus.save();
}

function addNarrativeCardButton() {
    const addedNarrativeCard = addCard('narrativeDeck', 'narrativeCardSelect', boardGameComponents.narrative);
    // gameStatus.narrative.push(addedNarrativeCard);
    // gameStatus.save();
}

function addMissionCardButton() {
    const addedMissionCard = addCard('missionDeck', 'missionCardSelect', boardGameComponents.mission);
    // gameStatus.mission.push(addedMissionCard);
    // gameStatus.save();
}

function addCard(containerId, selectId, list) {
    const container = document.getElementById(containerId);
    const select = document.getElementById(selectId);
    const option = select.querySelector(`option[value="${select.value}"]`);
    const foundElement = list.find((element) => {
        return toSnakeCase(element) === option.value;
    });
    const colDiv = ComponentCreator.createDivWithClass('col-xs-12 col-md-3 mb-3') 
    const cardElement = buildCard(foundElement);
    colDiv.appendChild(cardElement);
    container.appendChild(colDiv);
    list.push(foundElement);
    gameStatus.save();
    return foundElement;
}

function fillTensionCards() {
    const selectElement = document.getElementById('tensionCardSelect');
    const cardColors = {
        Green: '🟢',
        Amber: '🟡',
        Red: '🔴',
    }
    boardGameComponents.tensionCards.forEach(element => {
        const optionElement = document.createElement('option');
        optionElement.setAttribute('value', toSnakeCase(element.name));
        optionElement.textContent = `${cardColors[element.value]} ${element.name}`;
        selectElement.appendChild(optionElement);
    });
}

function addTensionCardButton() {
    const cardColors = {
        Green: '#a1fa9d',
        Amber: '#ffe28c',
        Red: '#fc8888',
    }
    const tensionContainer = document.getElementById('tensionDeck');
    const tensionSelect = document.getElementById('tensionCardSelect');
    const option = tensionSelect.querySelector(`option[value="${tensionSelect.value}"]`);
    const foundTensionCard = boardGameComponents.tensionCards.find((element) => {
        return toSnakeCase(element.name) === option.value;
    });

    const colDiv = ComponentCreator.createDivWithClass('col-xs-12 col-md-3 mb-3') 
    const cardElement = buildCard(foundTensionCard.name);
    cardElement.style.backgroundColor = cardColors[foundTensionCard.value];
    colDiv.appendChild(cardElement);
    tensionContainer.appendChild(colDiv);
    gameStatus.tensionDeck.push(foundTensionCard);
    gameStatus.save();
}

function buildCard(cardText) {
    const cardComponent = new CardComponent();
    const cardRow = ComponentCreator.createDivWithClass('row');
    const rowCol = ComponentCreator.createDivWithClass('col-8');
    const cartTitle = document.createElement('p');
    cartTitle.setAttribute('class', 'card-text');
    cartTitle.textContent = cardText;
    rowCol.appendChild(cartTitle)

    const rowCol2 = ComponentCreator.createDivWithClass('col');
    const removeButton = ComponentCreator.createIconButton('bi bi-trash', 'btn-danger');
    
    rowCol2.appendChild(removeButton);
    cardRow.appendChild(rowCol);
    cardRow.appendChild(rowCol2);
    cardComponent.addElementContent(cardRow);
    return cardComponent.generate();
}

function removeCard(event) {
    const cardElement = event.target.closest('.card');
    const removeElement = cardElement.parentNode;
    const container = removeElement.parentNode;
    const containerId = container.id;
    var index = Array.prototype.indexOf.call(container.children, removeElement);
    if (containerId.includes('narrative')) {
        gameStatus.narrative.splice(index, 1);        
    } else if (containerId.includes('tension')) {
        gameStatus.tensionDeck.splice(index, 1);
        
    } else if (containerId.includes('mission')) {
        gameStatus.mission.splice(index, 1);
        
    } else if (containerId.includes('item')) {
        gameStatus.items.splice(index, 1);
    }
    gameStatus.save();
    removeElement.remove();
}