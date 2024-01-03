class ReserveCharacterTable {
    static createRow(character) {
        const elementId = toSnakeCase(character.name);
        const tableRow = document.createElement('tr');
        tableRow.setAttribute('id', elementId);
        tableRow.appendChild(ReserveCharacterTable.characterNameColumn(character.name));
        tableRow.appendChild(ReserveCharacterTable.characterUnlockedColumn(elementId, character.unlocked));
        tableRow.appendChild(ReserveCharacterTable.characterDeadColumn(elementId, character.dead));
        tableRow.appendChild(ReserveCharacterTable.characterAdvancedColumn(elementId, character.advanced));
        tableRow.appendChild(ReserveCharacterTable.characterHealthColumn(elementId, character.health));
        return tableRow;
    }

    static characterNameColumn(name) {
        const charNameCol = document.createElement('td');
        charNameCol.textContent = name;
        return charNameCol;
    }

    static characterUnlockedColumn(elementId, value) {
        return ComponentCreator.createTableDataCheckbox(value, `character_${elementId}_unlocked`, handleCheckboxChange);
    }

    static characterDeadColumn(elementId, value) {
        return ComponentCreator.createTableDataCheckbox(value, `character_${elementId}_dead`, handleCheckboxChange);
    }

    static characterAdvancedColumn(elementId, value) {
        return ComponentCreator.createTableDataCheckbox(value, `character_${elementId}_advanced`, handleCheckboxChange);
    }

    static characterHealthColumn(elementId, value) {
        const charHealthCol = document.createElement('td');
        const rangeInput = ComponentCreator.createNumberInput(5, 1, 5, `character_${elementId}_health`);
        rangeInput.addEventListener('change', handleCharacterLifeChange);
        rangeInput.value = value;
        charHealthCol.appendChild(rangeInput);
        return charHealthCol;
    }

}

function buildReserveCharacter() {
    const reserveCharTable = document.getElementById("reserveCharacters");
    const tableBody = reserveCharTable.getElementsByTagName("tbody")[0]
    gameStatus.reserve.forEach(element => {
        tableBody.appendChild(ReserveCharacterTable.createRow(element));
        
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