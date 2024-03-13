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

  addRow (content, extraClass = '') {
    const row = ComponentCreator.createDivWithClass(`row ${extraClass}`, Array.isArray(content) ? content : [content])
    this.cardComponent.addElementContent(row)
  }

  addElement (element) {
    this.cardComponent.addElementContent(element)
  }

  setBackgroundColor (color) {
    this.cardComponent.card.style.backgroundColor = color
  }

  build () {
    return this.cardComponent.generate()
  }
}

class CardAdder {
  constructor (container) {
    this.container = container
  }
}
