const STORAGE_KEY = 'CTREBG';
const svgElement = document.getElementById('map');
const mapPaths = svgElement.getElementById('Paths');

let boardGameComponents;
let gameStatus = {}
let popUpTrigger = false;

fetch('../assets/data/residentevil.json').then(response => response.json()).then(data => {
    boardGameComponents = data;
    builder();
});

function builder() {
    buildReserveCharacter();
    fillCharacterSelect();
    markUndiscovered();
    scaleSVGImage(svgElement);
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

const triggerElement = document.getElementById('2nd_Floor_East_A');
const popupMenu = document.getElementById('popupMenu');


triggerElement.addEventListener('click', () => {
  if (popupMenu.style.display === 'none') {
    // Generate menu content dynamically
    const menuItems = ['Item 1', 'Item 2', 'Item 3'];
    const menuContent = menuItems.map(item => `<li><a href="#">${item}</a></li>`).join('');
    popupMenu.innerHTML = menuContent;

    // Position the menu relative to the clicked element
    console.log('Position menu');
    const position = triggerElement.getBoundingClientRect();
    console.log(position);
    console.log(triggerElement.height, triggerElement.width);
    popupMenu.style.left = position.left// + triggerElement.width;
    popupMenu.style.top = position.top - 100;
    popupMenu.style.position = "fixed";
    popupMenu.style.zIndex = 1;
    console.log(popupMenu.style.left, popupMenu.style.top);
    popupMenu.style.display = 'block';
    popUpTrigger = true;
  } else {
    popupMenu.style.display = 'none';
  }
});

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
    //localStorage.setItem(storageKey, JSON.stringify(gameStatus));
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
    boardGameComponents.scenarios.forEach(element => {
        const nameId = element.name.replaceAll(' ', '_');
        const svgGroup = svgElement.getElementById(nameId);
        if (!element.discovered) {
            svgGroup.setAttribute('hidden', true);
        }
    });
    console.log(mapPaths);
    for (const child of mapPaths.children) {
        if (!child.id.includes('Main_Hall')) {
            child.setAttribute('hidden', true);
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


document.body.addEventListener('click', function(event) {
    if (popupMenu.style.display == 'block' && !popUpTrigger) popupMenu.style.display = 'none';
    popUpTrigger = false;
});