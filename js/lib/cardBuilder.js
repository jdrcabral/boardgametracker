class CardBuilder {
    constructor (title, callback) {
        this.cardComponent = new CardComponent()
        this.cardComponent.card.style
        this.cardTitle = document.createElement('p')
        this.cardTitle.setAttribute('class', 'card-text')
        this.cardTitle.textContent = title
        this.removeButton = ComponentCreator.createIconButton('bi bi-trash', 'btn-danger btn-sm', callback)
        const titleCol = ComponentCreator.createDivWithClass('col-8', [this.cardTitle])
        const removeCol = ComponentCreator.createDivWithClass('col', [this.removeButton])
        const row = ComponentCreator.createDivWithClass('row mb-2', [titleCol, removeCol])
        this.cardComponent.addElementContent(row)
    }

    addRow(content) {
        const row = ComponentCreator.createDivWithClass('row', Array.isArray(content) ? content : [content])
        this.cardComponent.addElementContent(row)
    }

    setBackgroundColor (color) {
        console.log
        this.cardComponent.card.style.backgroundColor = color
    }

    build() {
        return this.cardComponent.generate()
    }
}

class CardAdder {
    constructor (container) {
        this.container = container
    }
}