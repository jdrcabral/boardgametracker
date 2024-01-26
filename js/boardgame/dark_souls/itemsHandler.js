class ItemsHandler {

    static retrieveAllItems() {
        return [
            ...boardGameComponents.items.map(itemMapper),
            ...boardGameComponents.armor.map(itemMapper),
            ...boardGameComponents.armor_upgrade.map(itemMapper),
            ...boardGameComponents.weapon.map(itemMapper),
            ...boardGameComponents.weapon_upgrade.map(itemMapper)
        ].sort((a, b) => a.name.localeCompare(b.name))
    }
}

function itemMapper(item) {
    return {
        ...item,
        name: `${item.name} (${item.type})`
    }
}