const toSnakeCase = (string) => {
  return string.replace(/\W+/g, ' ')
    .split(/ |\B(?=[A-Z])/)
    .map(word => word.toLowerCase())
    .join('_')
}

const extractIntFromString = (string) => {
  const regex = /\d+/ // Matches one or more digits
  const match = string.match(regex)
  if (!match) return null
  return parseInt(match[0])
}

function generateUniqueID () {
  return `${Date.now()}-${Math.floor(Math.random() * 100000)}`
}

class ChildRemover {
  static clearAll (parentId) {
    const parentElement = document.getElementById(parentId)
    while (parentElement.firstChild) {
      parentElement.removeChild(parentElement.lastChild)
    }
  }
  
  static clearTableBody(parentId) {
    const table = document.getElementById(parentId)
    const body = table.getElementsByTagName('tbody')[0]
    while (body.firstChild) {
      body.removeChild(body.lastChild)
    }
  }
}
