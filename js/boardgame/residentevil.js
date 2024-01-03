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

fetch('../../public/data/residentevil.json').then(response => response.json()).then(data => {
    boardGameComponents = data;
    loadGameStatus();
    builder();
});

function loadGameStatus() {
    gameStatus = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (gameStatus === null) {
        gameStatus = {
            threatLevel: 0,
            scenarios: [],
            characters: [],
            reserve: [],
        }
    }
    if (gameStatus.scenarios.length === 0) {
        gameStatus.scenarios = [...boardGameComponents.scenarios];
    }
    if (gameStatus.characters.length === 0) {
        gameStatus.characters = [];
    }
    if (!gameStatus.reserve || gameStatus.reserve.length === 0) {
        gameStatus.reserve = boardGameComponents.characters.map(element => {
            return {
                name: element,
                unlocked: false,
                dead: false,
                advanced: false,
                health: 5,
            }
        });
    }
}

function builder() {
    threatLevel.addEventListener('change', handleThreatLevelChange);
    console.log(gameStatus);
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

function handleCharacterChange(event) {
    const targetId = event.target.id
    const characterIndex = parseInt(targetId[targetId.length - 1]) - 1;
    const healthInputCharacter = document.getElementById(`characterHealth${characterIndex + 1}`)
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
    console.log(event);
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
            const healthInputCharacter = document.getElementById(`characterHealth${charactersIndex + 1}`)
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
