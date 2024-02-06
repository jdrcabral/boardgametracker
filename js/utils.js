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

  static clearTableBody (parentId) {
    const table = document.getElementById(parentId)
    const body = table.getElementsByTagName('tbody')[0]
    while (body.firstChild) {
      body.removeChild(body.lastChild)
    }
  }
}

function loadCampaigns () {
  gameStatus.load()
  gameStatus.save()
  const savedCampaigns = gameStatus.retrieveSavedCampaigns()
  savedCampaigns.forEach(element => {
    const optionElement = document.createElement('option')
    optionElement.setAttribute('value', element.id)
    optionElement.textContent = element.title
    campaignSelect.appendChild(optionElement)
  })
  campaignSelect.value = savedCampaigns[0].id
  campaignTitle.value = savedCampaigns[0].title
}

function handleCampaignTitleChange (event) {
  const inputText = event.target.value
  gameStatus.title = inputText
  const option = campaignSelect.querySelector(`option[value="${gameStatus.id}"]`)
  option.textContent = inputText
  gameStatus.save()
}

function deleteCampaign () {
  const operation = confirm('Are you sure you want to delete this campaign? The data will be lost')

  if (!operation) return
  gameStatus.deleteData()
  window.location.reload()
}

function scaleSVGImage (svgElement) {
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  const svgWidth = svgElement.getBoundingClientRect().width
  const svgHeight = svgElement.getBoundingClientRect().height
  const scaleFactor = Math.min(svgWidth / viewportWidth, viewportHeight / svgHeight)
  svgElement.style.transform = `scale(${scaleFactor}, ${scaleFactor})`
}