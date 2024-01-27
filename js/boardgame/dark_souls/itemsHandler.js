class ItemsHandler {
  static retrieveAllItems () {
    return [
      ...boardGameComponents.items.map(itemMapper),
      ...boardGameComponents.armor.map(itemMapper),
      ...boardGameComponents.armor_upgrade.map(itemMapper),
      ...boardGameComponents.weapon.map(itemMapper),
      ...boardGameComponents.weapon_upgrade.map(itemMapper)
    ].sort((a, b) => a.name.localeCompare(b.name))
  }
}

function itemMapper (item) {
  return {
    ...item,
    name: `${item.name} (${item.type})`
  }
}

function handleCharacterItemChange(event) {
  const targetId = event.target.id
  const pattern = /\d+/;
  const match = pattern.exec(targetId);
  if (!match) return
  const playerIndex = match[0] - 1
  if (targetId.includes("Armor")) {
    handleItemUpdate(playerIndex, event.target.value, 'armor', `character${playerIndex+1}ArmorNotes`)
  }
  if (targetId.includes("RightHand")) {
    handleItemUpdate(playerIndex, event.target.value, 'rightHand', `character${playerIndex+1}RightHandNotes`)
  }
  if (targetId.includes("LeftHand")) {
    handleItemUpdate(playerIndex, event.target.value, 'leftHand', `character${playerIndex+1}LeftHandNotes`)
  }
  if (targetId.includes("BeltHand")) {
    handleItemUpdate(playerIndex, event.target.value, 'belt', `character${playerIndex+1}BeltNotes`)
  }
  gameStatus.save()
}

function handleItemUpdate(playerIndex, value, itemType, notesId) {
  if (value) {
    gameStatus.characters[playerIndex].equipment[itemType].item = value
  }
  const itemNotes = document.getElementById(notesId)
  gameStatus.characters[playerIndex].equipment[itemType].notes = itemNotes.value

}

function handleCharacterItemNotesChange(event) {
  const targetId = event.target.id
  const pattern = /\d+/;
  const match = pattern.exec(targetId);
  if (!match) return
  const playerIndex = match[0] - 1
  if (targetId.includes("Armor")) {
    handleItemUpdate(playerIndex, null, 'armor', `character${playerIndex+1}ArmorNotes`)
  }
  if (targetId.includes("RightHand")) {
    handleItemUpdate(playerIndex, null, 'rightHand', `character${playerIndex+1}RightHandNotes`)
  }
  if (targetId.includes("LeftHand")) {
    handleItemUpdate(playerIndex, null, 'leftHand', `character${playerIndex+1}LeftHandNotes`)
  }
  if (targetId.includes("BeltHand")) {
    handleItemUpdate(playerIndex, null, 'belt', `character${playerIndex+1}BeltNotes`)
  }
  gameStatus.save()
}