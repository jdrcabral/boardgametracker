class ComponentCreator {
  static createCheckbox (value = '', id = null) {
    const inputTag = document.createElement('input')
    inputTag.setAttribute('class', 'form-check-input')
    inputTag.setAttribute('type', 'checkbox')
    inputTag.setAttribute('value', value)
    inputTag.checked = !!value
    inputTag.setAttribute('id', id)
    return inputTag
  }

  static createNumberInput (value = 0, min = 0, max = 100, id = null) {
    const inputTag = document.createElement('input')
    inputTag.value = value
    inputTag.setAttribute('type', 'number')
    inputTag.setAttribute('class', 'form-control')
    inputTag.setAttribute('min', min)
    inputTag.setAttribute('max', max)
    inputTag.setAttribute('id', id)
    return inputTag
  }

  static createIconButton (icon, level = 'btn-info') {
    const button = document.createElement('button')
    button.setAttribute('type', 'button')
    button.setAttribute('class', `btn ${level}`)
    const span = document.createElement('span')
    const trashIcon = document.createElement('i')
    trashIcon.setAttribute('class', icon)
    span.appendChild(trashIcon)
    button.appendChild(span)
    return button
  }

  static createDivWithClass (className) {
    const div = document.createElement('div')
    div.setAttribute('class', className)
    return div
  }

  static createTableDataCheckbox (value = '', id = null, callback = null) {
    const tableData = document.createElement('td')
    const checkboxInput = ComponentCreator.createCheckbox(value, id)
    checkboxInput.addEventListener('change', callback)
    tableData.appendChild(checkboxInput)
    return tableData
  }
}

class CardComponent {
  constructor () {
    this.card = document.createElement('div')
    this.card.setAttribute('class', 'card')
    this.cardContent = document.createElement('div')
    this.cardContent.setAttribute('class', 'card-body')
  }

  addTextContent (text) {
    const divContent = document.createElement('div')
    divContent.setAttribute('class', 'content')
    const textElement = document.createElement('p')
    textElement.textContent = text
    divContent.appendChild(textElement)
    this.cardContent.appendChild(divContent)
  }

  addElementContent (element) {
    this.cardContent.appendChild(element)
  }

  generate () {
    this.card.appendChild(this.cardContent)
    return this.card
  }
}
