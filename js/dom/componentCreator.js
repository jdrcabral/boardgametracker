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

  static createCheckbox (value = '', id = null, callback = null) {
    const inputTag = document.createElement('input')
    inputTag.setAttribute('class', 'form-check-input')
    inputTag.setAttribute('type', 'checkbox')
    inputTag.setAttribute('value', value)
    inputTag.checked = !!value
    inputTag.setAttribute('id', id)
    if (callback) inputTag.addEventListener('change', callback)
    return inputTag
  }

  static createNumberInput (value = 0, min = 0, max = 100, id = null, placeholder = null, changeEvent = null) {
    const inputTag = document.createElement('input')
    inputTag.value = value
    inputTag.setAttribute('type', 'number')
    inputTag.setAttribute('class', 'form-control')
    inputTag.setAttribute('placeholder', placeholder)
    inputTag.setAttribute('min', min)
    inputTag.setAttribute('max', max)
    if (id) {
      inputTag.setAttribute('id', id)
    }
    if (changeEvent) {
      inputTag.addEventListener('change', changeEvent)
    }
    return inputTag
  }

  static createTextInput (value = 0, id = null, placeholder = null, changeEvent = null) {
    const inputTag = document.createElement('input')
    inputTag.value = value
    inputTag.setAttribute('type', 'text')
    inputTag.setAttribute('class', 'form-control')
    inputTag.setAttribute('placeholder', placeholder)
    if (id) {
      inputTag.setAttribute('id', id)
    }
    if (changeEvent) {
      inputTag.addEventListener('change', changeEvent)
    }
    return inputTag
  }

  static createButton (textContext, level = 'btn-info', clickEvent = null) {
    const button = document.createElement('button')
    button.setAttribute('type', 'button')
    button.setAttribute('class', `btn ${level}`)
    button.textContent = textContext
    if (clickEvent) button.addEventListener('click', clickEvent)
    return button
  }

  static createIconButton (icon, level = 'btn-info', clickEvent = null) {
    const button = document.createElement('button')
    button.setAttribute('type', 'button')
    button.setAttribute('class', `btn ${level}`)
    const span = document.createElement('span')
    const trashIcon = document.createElement('i')
    trashIcon.setAttribute('class', icon)
    span.appendChild(trashIcon)
    button.appendChild(span)
    if (clickEvent) {
      button.addEventListener('click', clickEvent)
    }
    return button
  }

  static createDivWithClass (className, children = null) {
    const div = document.createElement('div')
    div.setAttribute('class', className)
    if (Array.isArray(children)) {
      children.forEach(element => {
        div.appendChild(element)
      })
    }
    return div
  }

  static createTableDataCheckbox (value = '', id = null, callback = null) {
    const tableData = document.createElement('td')
    const checkboxInput = ComponentCreator.createCheckbox(value, id)
    checkboxInput.addEventListener('change', callback)
    tableData.appendChild(checkboxInput)
    return tableData
  }

  static createSelect (ariaLabel = '', options = [], callback = null, id = null) {
    const select = document.createElement('select')
    select.setAttribute('aria-label', ariaLabel)
    select.setAttribute('class', 'form-select')
    if (id) select.setAttribute('id', id)
    if (callback) select.addEventListener('change', callback)
    options.forEach(element => {
      const option = document.createElement('option')
      option.textContent = element.text
      option.value = element.value
      select.appendChild(option)
    })
    return select
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

class ListComponent {
  constructor (tag = 'ul', className = 'list-group') {
    this.list = document.createElement(tag)
    this.list.setAttribute('class', className)
  }

  addListItem (id = null, content = null, children = null) {
    const listItem = document.createElement('li')
    listItem.setAttribute('class', 'list-group-item')
    if (children) {
      children.forEach((element) => {
        listItem.appendChild(element)
      })
    }
    if (content) {
      listItem.textContent = content
    }
    if (id) {
      listItem.setAttribute('id', id)
    }
    this.list.appendChild(listItem)
  }
}
