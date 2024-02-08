class GameCardBuilder {
    constructor(title, callback) {
        this.cardComponent = new CardComponent()
        this.cardTitle = document.createElement('p')
        this.cartTitle.setAttribute('class', 'card-text')
        this.cartTitle.textContent = title
        this.removeButton = ComponentCreator.createIconButton('bi bi-trash', 'btn-danger btn-sm', callback)
    }

    addTitleAndRemoveButtonAsRow() {
        const titleCol = ComponentCreator.createDivWithClass('col-8', [this.cardTitle])
        const removeCol = ComponentCreator.createDivWithClass('col', [this.removeButton])
        const row = ComponentCreator.createDivWithClass('row', [titleCol, removeCol])
        this.cardComponent.addElementContent(row)
    }

    addRow(content) {
        const row = ComponentCreator.createDivWithClass('row', Array.isArray(content) ? content : [content])
        this.cardComponent.addElementContent(row)
    }

    build() {
        return this.cardComponent.generate()
    }
}


class QuantityCardBuilder extends GameCardBuilder {

}