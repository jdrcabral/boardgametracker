const STORAGE_KEY = 'CTREBG';
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
let gameStatus = null;
let popUpTrigger = false;
let lastMapElement = null;

fetch('../public/data/residentevil.json').then(response => response.json()).then(data => {
    boardGameComponents = data;
    gameStatus = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (gameStatus === null) {
        gameStatus = {
            threatLevel: 0,
            scenarios: [],
            characters: [],
        }
    }
    if (gameStatus.scenarios.length === 0) {
        gameStatus.scenarios = [...boardGameComponents.scenarios];
    }
    if (gameStatus.characters.length === 0) {
        gameStatus.characters = [];
    }
    builder();
});

function builder() {
    threatLevel.addEventListener('change', handleThreatLevelChange);
    buildReserveCharacter();
    fillCharacterSelect();
    markUndiscovered();
    scaleSVGImage(svgElement);
    threatLevel.value = gameStatus.threatLevel;
}

function handleThreatLevelChange(event) {
    gameStatus.threatLevel = event.target.value;
    updateGameData();
}

function buildReserveCharacter() {
    const reserveCharTable = document.getElementById("reserveCharacters");
    const tableBody = reserveCharTable.getElementsByTagName("tbody")[0]
    boardGameComponents.characters.forEach(element => {
        const elementId = toSnakeCase(element)
        const tableRow = document.createElement('tr');
        const charNameCol = document.createElement('td');
        const charUnlockedCol = document.createElement('td');
        const charDeadCol = document.createElement('td');
        const advancedCol = document.createElement('td');
        const charHealthCol = document.createElement('td');

        tableRow.setAttribute('id', elementId);
        charNameCol.textContent = element;
        const unlockedInput = ComponentCreator.createCheckbox("", `character_${elementId}_unlocked`);
        unlockedInput.addEventListener('change', handleCheckboxChange);
        charUnlockedCol.appendChild(unlockedInput);
        const deadInput = ComponentCreator.createCheckbox("", `character_${elementId}_dead`);
        charDeadCol.addEventListener('change', handleCheckboxChange);
        charDeadCol.appendChild(deadInput);
        const advancedInput = ComponentCreator.createCheckbox("", `character_${elementId}_advanced`);
        advancedInput.addEventListener('change', handleCheckboxChange);
        advancedCol.appendChild(advancedInput);
        const rangeInput = ComponentCreator.createNumberInput(5, 1, 5, `character_${elementId}_health`);
        rangeInput.addEventListener('change', handleCharacterLifeChange);
        charHealthCol.appendChild(rangeInput);
        
        tableRow.appendChild(charNameCol);
        tableRow.appendChild(charUnlockedCol);
        tableRow.appendChild(charDeadCol);
        tableRow.appendChild(advancedCol);
        tableRow.appendChild(charHealthCol);

        tableBody.appendChild(tableRow);
    });
}

function fillCharacterSelect() {
    for (let i = 1; i < 5; i++) {
        const selectElement = document.getElementById(`characterSelect${i}`);
        boardGameComponents.characters.forEach(element => {
            if (element.includes('Reserve Only')) return;
            const optionElement = document.createElement('option');
            optionElement.setAttribute('value', toSnakeCase(element));
            optionElement.textContent = element;
            selectElement.appendChild(optionElement);
        });
        selectElement.addEventListener('change', handleCharacterChange);
    }
}


function handleCharacterChange(event) {
    const targetId = event.target.id
    const characterIndex = parseInt(targetId[targetId.length-1]) - 1;
    const healthInputCharacter = document.getElementById(`characterHealth${characterIndex+1}`)
    const characterId = toSnakeCase(event.target.value);
    const reserveHealth = document.getElementById(`character_${characterId}_health`);
    healthInputCharacter.value = reserveHealth.value;
    gameStatus.characters[characterIndex] = {
        ...gameStatus.characters[characterIndex],
        name: event.target.value,
        health: reserveHealth.value,
    };
    updateGameData();
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
    }
    updateGameData();
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
            const healthInputCharacter = document.getElementById(`characterHealth${charactersIndex+1}`)
            healthInputCharacter.value = event.target.value;
        }
    }
    updateGameData();
}

function updateGameData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameStatus));
}


function scaleSVGImage(svgElement) {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const svgWidth = svgElement.getBoundingClientRect().width;
    const svgHeight = svgElement.getBoundingClientRect().height;
  
    const scaleFactor = Math.min(viewportWidth / svgWidth, viewportHeight / svgHeight);
    svgElement.style.transform = `scale(${scaleFactor}, ${scaleFactor})`;
}

function markUndiscovered() {
    gameStatus.scenarios.forEach(element => {
        const nameId = element.name.replaceAll(' ', '_');
        const svgGroup = svgElement.getElementById(nameId);
        lastMapElement = svgGroup;
        svgGroup.addEventListener('click', openModal);
        svgGroup.setAttribute('data-bs-toggle', 'modal');
        svgGroup.setAttribute('data-bs-target', '#mapModal');
        if (!element.discovered) {
            svgGroup.setAttribute('hidden', true);
        }
        if (element.completed) {
            const rectElement = svgGroup.getElementsByTagName('rect');
            rectElement[0].setAttribute('fill', LEVEL_COLORS.COMPLETED);
        }
        if (!element.locked && element.lockedBy) {
            const rectElement = svgGroup.getElementsByTagName('path');
            rectElement[0].setAttribute('hidden', true);
        }
    });
    for (const child of mapPaths.children) {
        if (!child.id.includes('Main_Hall')) {
            const scenarios = child.id.split('_-_');
            const firstScenario = gameStatus.scenarios.findIndex(element => {
                return element.name.replaceAll(' ', '_') === scenarios[0];    
            });
            const secondScenario = gameStatus.scenarios.findIndex(element => {
                return element.name.replaceAll(' ', '_') === scenarios[1];    
            });
            if (!gameStatus.scenarios[firstScenario].discovered || !gameStatus.scenarios[secondScenario].discovered) {
                child.setAttribute('hidden', true);
            }
        }
    }
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
            const healthInputCharacter = document.getElementById(`characterHealth${charactersIndex+1}`)
            healthInputCharacter.value = event.target.value;
        }
    }
    updateGameData();
}

function completeLevel() {
    const rectElement = lastMapElement.getElementsByTagName('rect');
    const scenarioIndex = findScenarioIndexById(lastMapElement.id);
    if (gameStatus.scenarios[scenarioIndex].completed) {
        gameStatus.scenarios[scenarioIndex].completed = false;
        rectElement[0].setAttribute('fill', LEVEL_COLORS.UNCOMPLETED);
    } else {
        gameStatus.scenarios[scenarioIndex].completed = true;
        rectElement[0].setAttribute('fill', LEVEL_COLORS.COMPLETED);
    }
    updateGameData();
    lastMapElement = null;
}

function unlockLevel() {
    const scenarioIndex = findScenarioIndexById(lastMapElement.id);
    const pathElement = lastMapElement.getElementsByTagName('path')[0];
    if (pathElement.id.includes('Locked') && gameStatus.scenarios[scenarioIndex].locked) {
        gameStatus.scenarios[scenarioIndex].locked = false;
        pathElement.setAttribute('hidden', true)
    } else {
        gameStatus.scenarios[scenarioIndex].locked = true;
        pathElement.removeAttribute('hidden');   
    }
    updateGameData();
}

function revealLevel() {
    const clickedElement = findScenarioIndexById(lastMapElement.id);

    if (isAlreadyRevealed(lastMapElement.id)) {
        gameStatus.scenarios[clickedElement].unlocks.forEach(element => {
            unrevealScenario(element);
        });
        updateGameData();
        return;
    } 
    const revealedPaths = [];
    for (const child of mapPaths.children) {
        if (child.id.includes(lastMapElement.id)) {
            child.removeAttribute('hidden');
            revealedPaths.push(child.id);
        }
    }

    revealedPaths.forEach(element => {
        const mapId = element.replaceAll(lastMapElement.id, '').replaceAll('_-_', '');
        const scenarioIndex = findScenarioIndexById(mapId);
        if (scenarioIndex >= 0) {
            gameStatus.scenarios[scenarioIndex].discovered = true;
        }
        const mapToReveal = svgElement.getElementById(mapId);
        mapToReveal.removeAttribute('hidden');
    });
    lastMapElement = null;
    updateGameData();
}

function unrevealScenario(unrevealElement) {
    const unrevealIndex = findScenarioIndexByName(unrevealElement);
    gameStatus.scenarios[unrevealIndex].discovered = false;
    const unrevealId = unrevealElement.replaceAll(' ', '_')
    const mapToUnreveal = svgElement.getElementById(unrevealId);
    mapToUnreveal.setAttribute('hidden', true);

    for (const child of mapPaths.children) {
        if (child.id.includes(unrevealId)) {
            child.setAttribute('hidden', 'true');
        }
    }
    gameStatus.scenarios[unrevealIndex].unlocks.forEach(element => { unrevealScenario(element) });
}

function isAlreadyRevealed(nameId) {
    const clickedElement = findScenarioIndexById(nameId);

    const lookingScenario = gameStatus.scenarios[clickedElement];
    let childRevealed = false;
    lookingScenario.unlocks.forEach(element => {
        const childIndex = findScenarioIndexByName(element);
        if (gameStatus.scenarios[childIndex].discovered) {
            childRevealed = true;
        }
    });
    return childRevealed;
}

function findScenarioIndexByName(name) {
    return gameStatus.scenarios.findIndex(element => {
        return element.name === name;    
    });
}

function findScenarioIndexById(name) {
    return gameStatus.scenarios.findIndex(element => {
        return element.name.replaceAll(' ', '_') === name;    
    });
}